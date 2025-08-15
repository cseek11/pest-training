import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || '';
export const api = axios.create({ baseURL, timeout: 15000 });
export async function fetchContent() {
  try { const res = await api.get('/api/content'); return res.data; }
  catch (e) { console.warn('Falling back to embedded content.', e?.message); return null; }
}