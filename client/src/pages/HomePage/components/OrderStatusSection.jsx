import React from 'react';
import { Button } from '@/components';
import searchOrderIcon from '@/assets/search-order.svg';
import protectedIcon from '@/assets/protected.svg';

const OrderStatusSection = () => {
    return (
        <section className="w-full px-6 md:px-10 lg:px-16 pb-12">
            <div
                className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-color-white px-6 md:px-8 py-6 md:py-7"
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 0 8px 2px rgba(0, 0, 0, 0.10)',
                }}
            >
                {/* ── Kiri: Ikon + Teks ── */}
                <div className="flex items-center gap-4 w-full md:w-1/2">
                    {/* Icon circle */}
                    <div className="flex-shrink-0 w-[50px] h-[50px] rounded-full bg-color-lighter flex items-center justify-center">
                        <img src={searchOrderIcon} alt="Search Order" className="w-9 h-9" />
                    </div>
                    {/* Teks */}
                    <div>
                        <h3 className="font-semibold text-color-black text-base md:text-base leading-snug">
                            Cek Status Pesanan Anda
                        </h3>
                        <p className="text-color-gray text-xs md:text-sm mt-0.5 leading-relaxed">
                            Masukkan nomor pesanan atau nomor WhatsApp untuk melihat status produksi.
                        </p>
                    </div>
                </div>

                {/* ── Kanan: Input + Button ── */}
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Masukkan nomor pesanan / WhatsApp"
                            className="flex-1 border border-gray-200 rounded-sm px-4 py-2.5 text-sm text-color-black placeholder-color-gray focus:outline-none focus:ring-2 focus:ring-color-dark/30 focus:border-color-dark transition shadow-[0_0_4px_0_rgba(0,0,0,0.25)]"
                        />
                        <Button className="whitespace-nowrap">
                            Lacak Pesanan
                        </Button>
                    </div>
                    {/* Keterangan keamanan */}
                    <p className="flex items-center gap-1.5 text-xs text-color-gray">
                        <img src={protectedIcon} alt="Protected" className="w-3.5 h-3.5" />
                        Data aman dan hanya dapat diakses oleh pemilik pesanan.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OrderStatusSection;
