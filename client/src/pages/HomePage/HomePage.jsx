import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import OrderStatusSection from './components/OrderStatusSection';
import QualityPackagingSection from './components/QualityPackagingSection';
import OrderProcessSection from './components/OrderProcessSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-color-white">
            <Navbar />
            <HeroSection />
            <OrderStatusSection />
            <QualityPackagingSection />
            <OrderProcessSection />
            <FeaturedProductsSection />
            <Footer />
        </div>
    );
};

export default HomePage;
