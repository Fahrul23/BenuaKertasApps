import React from 'react';
import { QUALITY_PACKAGING_DATA } from '../constants';

const QualityPackagingSection = () => {
    return (
        <section className="w-full px-6 md:px-10 lg:px-16 py-10 md:py-14">
            {/* Heading */}
            <h2 className="text-center font-semibold text-color-black text-lg md:text-2xl mb-8 md:mb-10">
                Kemasan Berkualitas untuk Bisnis Anda
            </h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {QUALITY_PACKAGING_DATA.map((item) => (
                    <div
                        key={item.title}
                        className="group flex flex-col items-center text-center bg-color-white rounded-[5px] px-3 py-5 md:px-6 md:py-8 border-2 border-transparent hover:border-color-primary hover:bg-gradient-to-br hover:from-color-grad_start hover:from-60% hover:to-color-grad_end hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        style={{
                            boxShadow:
                                '0 0 5px 0 rgba(0,0,0,0.00), 0 0 5px 0 rgba(0,0,0,0.01), 0 0 4px 0 rgba(0,0,0,0.05), 0 0 3px 0 rgba(0,0,0,0.09), 0 0 2px 0 rgba(0,0,0,0.10)',
                        }}
                    >
                        {/* Icon circle */}
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-color-lighter group-hover:bg-white flex items-center justify-center mb-3 md:mb-4 transition-colors duration-300">
                            <img src={item.icon} alt={item.title} className="w-7 h-7 md:w-9 md:h-9" />
                        </div>
                        {/* Title */}
                        <h3 className="font-bold text-color-black group-hover:text-color-white text-xs md:text-base mb-1 md:mb-2 transition-colors duration-300">
                            {item.title}
                        </h3>
                        {/* Description */}
                        <p className="text-color-gray group-hover:text-white/80 text-[10px] md:text-sm leading-relaxed transition-colors duration-300">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default QualityPackagingSection;
