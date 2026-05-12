import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import kotakKertasImg from '@/assets/kotak-kertas.png';
import clipImg from '@/assets/clip.png';
import leafIconImg from '@/assets/leaf-icon.svg';

const HeroSection = () => {
    return (
        <section className="w-full bg-color-white overflow-hidden">
            {/* Container tanpa padding & max-width supaya gambar bisa nempel ke kanan browser */}
            <div className="flex flex-col md:flex-row items-center">

                {/* ── Left: Text Content — padding hanya di sini ── */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 px-6 md:pl-10 lg:pl-16 py-8 md:py-10 z-10">

                    {/* Badge */}
                    <div className="flex items-center gap-2">
                        <img src={leafIconImg} alt="Leaf Icon" className="w-5 h-auto object-contain" />
                        <span className="text-color-primary font-medium text-xs md:text-base">
                            Food Grade Packaging
                        </span>
                    </div>

                    {/* Headline */}
                    <div className='mb-2'>
                        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Custom Box Makanan
                            <br />
                            Food Grade untuk
                        </h1>
                        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-bold text-color-dark leading-tight mt-1">
                            Bisnis Anda
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="text-color-gray text-sm md:text-base leading-relaxed">
                        Kemasan berkualitas tinggi, aman untuk makanan,
                        <br />
                        desain custom sesuai brand anda.
                        <br />
                        Minimal order 500 pcs.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <Button iconRight={<ArrowRight size={16} />}>
                            Mulai Custom
                        </Button>
                        <Button variant="outline" iconRight={<ArrowRight size={16} />}>
                            Lihat Katalog
                        </Button>
                    </div>
                </div>

                {/* ── Right: Hero Images — nempel ke kanan browser ── */}
                <div className="hidden md:block md:w-1/2 relative min-h-[420px] lg:min-h-[500px]">

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
                        className="absolute right-20 top-1/2 -translate-y-[55%] w-[70%] object-contain z-20 drop-shadow-xl -rotate-6"
                    />

                </div>

            </div>
        </section>
    );
};

export default HeroSection;
