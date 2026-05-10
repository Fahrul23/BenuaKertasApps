import React from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import kotakKertasImg from '@/assets/kotak-kertas.png';
import clipImg from '@/assets/clip.png';

// ── Leaf decoration SVG ──────────────────────────────────────────────
const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C7 2 3 7 3 12C3 16.5 6 20 12 20C18 20 21 16.5 21 12C21 7 17 2 12 2Z" fill="#3f6d35" />
    <path d="M12 4 L12 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M12 8 Q8 7 6 10" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
    <path d="M12 8 Q16 7 18 10" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
    <path d="M12 13 Q8 12 6 15" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
    <path d="M12 13 Q16 12 18 15" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
  </svg>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#f0f4ef]">
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO / BANNER SECTION
      ══════════════════════════════════════════ */}
      <section className="w-full bg-[#f0f4ef] overflow-hidden">
        {/* Container tanpa padding & max-width supaya gambar bisa nempel ke kanan browser */}
        <div className="flex flex-col md:flex-row items-center">

          {/* ── Left: Text Content — padding hanya di sini ── */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 px-6 md:pl-10 lg:pl-16 py-8 md:py-10 z-10">

            {/* Badge */}
            <div className="flex items-center gap-2">
              <LeafIcon className="w-5 h-5" />
              <span className="text-[#3f6d35] font-semibold text-sm md:text-base">
                Food Grade Packaging
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Custom Box Makanan
                <br />
                Food Grade untuk
              </h1>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#3f6d35] leading-tight mt-1">
                Bisnis Anda
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Kemasan berkualitas tinggi, aman untuk makanan,
              <br />
              desain custom sesuai brand anda.
              <br />
              Minimal order 500 pcs.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <Button className="bg-[#3f6d35] hover:bg-[#2d4f26] text-white rounded-lg px-6 py-5 font-semibold shadow-lg shadow-green-900/20 text-sm md:text-base">
                Mulai Custom
              </Button>
              <Button
                variant="outline"
                className="border-[#3f6d35] text-[#3f6d35] hover:bg-[#3f6d35]/5 rounded-lg px-6 py-5 font-semibold flex items-center gap-2 group text-sm md:text-base"
              >
                Lihat Katalog
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* ── Right: Hero Images — nempel ke kanan browser ── */}
          <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[420px] lg:min-h-[500px]">

            
            {/* clip.png — mentok ke kanan browser, layer bawah */}
            <img
              src={clipImg}
              alt="Packaging clip"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[80%] object-contain z-10"
            />

            {/* kotak-kertas.png — menimpa clip.png, float di atas */}
            <img
              src={kotakKertasImg}
              alt="Custom Box Packaging"
              className="absolute right-0 top-1/2 -translate-y-[55%] w-[80%] object-contain z-20 drop-shadow-xl"
            />

          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
