import React from 'react';
import premiumIcon from '@/assets/kertas-premium.svg';
import hargaIcon from '@/assets/harga.svg';
import flexIcon from '@/assets/flexible.svg';
import layananIcon from '@/assets/layanan.svg';
import mesinImg from '@/assets/mesin.svg';

const FEATURES = [
    {
        icon: premiumIcon,
        title: 'Bahan Berkualitas Premium',
        desc: 'Menggunakan bahan terbaik dengan standar food grade.'
    },
    {
        icon: hargaIcon,
        title: 'Harga Kompetitif',
        desc: 'Harga terbaik dengan kualitas yang tidak diragukan.'
    },
    {
        icon: flexIcon,
        title: 'Minimal Order Fleksibel',
        desc: 'Minimal order mulai dari 1000 pcs'
    },
    {
        icon: layananIcon,
        title: 'Layanan Profesional',
        desc: 'Tim kami siap membantu dari awal hingga pesanan tiba.'
    }
];

const WhyChooseUsSection = () => {
    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-20 bg-[#FAFBFA]">
            <div className="text-center mb-10 md:mb-14">
                <h2 className="font-bold text-color-black text-2xl md:text-3xl lg:text-4xl">
                    Mengapa Memilih Imperial Indopack?
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 max-w-6xl mx-auto items-center">
                
                {/* Left: Features List */}
                <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8">
                    {FEATURES.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-[#EEF5E9] rounded-full flex items-center justify-center shadow-sm">
                                <img src={feature.icon} alt={feature.title} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                            </div>
                            <div className="flex flex-col pt-1">
                                <h3 className="font-bold text-color-black text-base md:text-lg mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-color-gray text-sm md:text-base">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
                    <img 
                        src={mesinImg} 
                        alt="Mesin Cetak" 
                        className="w-full h-auto object-cover rounded-[10px] shadow-sm"
                    />
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;
