import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

const TABLES = [
  { id: 'flashcards', label: 'Flashcards (term, definition, image_url, level)' },
  { id: 'quizzes', label: 'Module Quizzes (question, option_a..d, correct_option, level)' },
  { id: 'final_tests', label: 'Advanced Final (question, option_a..d, correct_option)' },
]

export default function AdminPage(){
  const [table,setTable] = useState('flashcards')
  const [rows,setRows] = useState([])
  const [uploading,setUploading] = useState(false)
  const [images,setImages] = useState([])
  const [bucketPublicUrl,setBucketPublicUrl] = useState('')

  useEffect(()=>{
    // Compute public URL base for 'insects' bucket
    const url = import.meta.env.VITE_SUPABASE_URL
    setBucketPublicUrl(url ? url + '/storage/v1/object/public/insects/' : '')
  },[])

  function onFile(e){
    const file = e.target.files[0]
    if(!file) return
    Papa.parse(file, { header:true, skipEmptyLines:true, complete:(res)=> setRows(res.data) })
  }

  async function uploadCSV(){
    if(rows.length===0) return alert('No rows parsed.')
    setUploading(true)
    try {
      const { error } = await supabase.from(table).insert(rows)
      if(error) throw error
      alert('Upload successful!')
      setRows([])
    } catch(err){
      alert('Error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function uploadImages(e){
    const files = Array.from(e.target.files||[])
    if(files.length===0) return
    setUploading(true)
    try{
      const uploaded = []
      for(const file of files){
        const path = Date.now() + '_' + file.name.replace(/\s+/g,'_')
        const { error } = await supabase.storage.from('insects').upload(path, file, { upsert: true })
        if(error) throw error
        uploaded.push({ name: file.name, public_url: bucketPublicUrl + path })
      }
      setImages(uploaded)
    }catch(err){
      alert('Image upload failed: ' + err.message)
    }finally{
      setUploading(false)
    }
  }

  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin – CSV & Image Upload</h1>
        <Link to="/" className="px-3 py-1.5 rounded-xl border shadow-sm hover:bg-gray-50">Return Home</Link>
      </div>

      <label className="block mb-2">Target table</label>
      <select className="border rounded px-3 py-2 mb-4" value={table} onChange={e=>setTable(e.target.value)}>
        {TABLES.map(t=> <option key={t.id} value={t.id}>{t.label}</option>)}
      </select>

      <div className="rounded-2xl border bg-white p-4 shadow-sm mb-6">
        <h2 className="font-semibold mb-2">Upload CSV</h2>
        <input type="file" accept=".csv" onChange={onFile} />
        <button onClick={uploadCSV} disabled={uploading || rows.length===0} className="ml-3 px-3 py-2 rounded-xl border shadow-sm hover:bg-gray-50">
          {uploading ? 'Uploading…' : 'Insert rows'}
        </button>
        <p className="text-xs text-gray-500 mt-2">Preview (first 3 rows)</p>
        <pre className="bg-gray-100 p-2 rounded max-h-48 overflow-auto text-xs">{JSON.stringify(rows.slice(0,3), null, 2)}</pre>
        <p className="text-xs text-gray-500 mt-2">Expected columns by table:</p>
        <ul className="text-xs list-disc list-inside text-gray-600">
          <li><b>flashcards</b>: term, definition, image_url (optional), level (beginner|intermediate|advanced)</li>
          <li><b>quizzes</b>: question, option_a, option_b, option_c, option_d, correct_option (A|B|C|D), level</li>
          <li><b>final_tests</b>: question, option_a, option_b, option_c, option_d, correct_option</li>
        </ul>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Upload Insect Images (Supabase Storage)</h2>
        <input type="file" multiple accept="image/*" onChange={uploadImages} />
        {bucketPublicUrl && <p className="text-xs text-gray-600 mt-2">Public URL base: <code>{bucketPublicUrl}</code></p>}
        {images.length>0 && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {images.map((im,i)=> (
              <div key={i} className="rounded border p-2 bg-gray-50">
                <img src={im.public_url} className="h-28 object-contain mx-auto" />
                <p className="text-xs mt-1 break-all">{im.public_url}</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">Paste these image URLs into your CSV under the <code>image_url</code> column for flashcards.</p>
      </div>
    </div>
  )
}
