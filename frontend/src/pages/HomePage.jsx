import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PA_CERT_CATEGORIES } from '../categories';
import veropestLogo from '../assets/branding/veropest_logo.png';
export default function HomePage() {
  // Branding colors (from logo): green (#3CA35B), blue (#1A4D8F), neutral (#F5F7FA)
  return (
    <>
      <div className="max-w-4xl items-center mx-auto p-8 text-center rounded-2xl shadow-lg bg-[#404040]">
        <img src={veropestLogo} alt="VeroPest Logo" className="h-20 mb-6 drop-shadow-lg mx-auto" />
         <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#a880b9] drop-shadow-md">VeroTraining</h1>
          <p className="text-lg font-medium text-[#4db848]">Empowering Learners for PA & National Certification</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-8 text-center rounded-2xl shadow-lg bg-[#F5F7FA]">
       

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2 text-[#a880b9] drop-shadow">Core Training Categories</h2>
          <p className="mb-4 text-gray-700 text-base">General pest control knowledge, safety, and regulations.</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="block px-6 py-5 rounded-2xl bg-[#4db848] text-white font-semibold shadow hover:bg-[#399a38] transition-all text-lg"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2 text-[#a880b9] drop-shadow">PA Certification</h2>
          <p className="mb-4 text-gray-700 text-base">Specialized Pennsylvania pesticide applicator categories for certification and exam prep.</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {PA_CERT_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="block px-6 py-5 rounded-2xl bg-[#4db848] text-white font-semibold shadow hover:bg-[#399a38] transition-all text-lg"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2 text-[#a880b9] drop-shadow">Other Tools</h2>
          <p className="mb-4 text-gray-700 text-base">Pest identification and admin features.</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Link to="/identify" className="block px-6 py-5 rounded-2xl bg-[#4db848] text-white font-semibold shadow hover:bg-[#399a38] transition-all text-lg">Pest Identification</Link>
            <Link to="/admin" className="block px-6 py-5 rounded-2xl bg-gray-500 text-white font-semibold shadow hover:bg-gray-600 transition-all text-lg">Admin</Link>
          </div>
        </section>
      </div>
    </>
  );
}
