import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowRight, Menu, X } from 'lucide-react';
import logo from '@/assets/logo-impepact.svg';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', to: '/home' },
    { label: 'Custom Packaging', to: '#' },
    { label: 'Katalog', to: '#' },
    { label: 'Tentang Kami', to: '#' },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-[0px_2px_1px_0px_rgba(0,0,0,0.25)]">

      {/* ── Main Bar ── */}
      <div className="w-full h-16 md:h-20 flex items-center px-4 md:px-8">

        {/* Logo — kiri */}
        <Link to="/home" className="flex-shrink-0">
          <img
            src={logo}
            alt="Impepac - Imperial Indopack"
            className="h-9 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Nav Links + Actions — dibungkus ml-auto supaya mentok kanan */}
        <div className="ml-auto flex items-center gap-4 md:gap-6 lg:gap-8">

          {/* Nav Links — hidden di mobile */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            <Link
              to="/home"
              className="bg-[#3f6d35] text-white px-5 py-2 rounded-lg font-medium transition-all hover:opacity-90 shadow-md text-sm lg:text-base"
            >
              Home
            </Link>
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[#3f6d35] font-semibold hover:text-green-800 transition-colors text-sm lg:text-base whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 text-[#3f6d35] hover:text-red-600 transition-colors group"
            aria-label="Logout"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[9px] font-bold uppercase tracking-tighter hidden sm:block">Logout</span>
          </button>

          {/* Tombol Pesan Sekarang — hidden di xs */}
          <Button className="hidden sm:flex bg-[#3f6d35] hover:bg-[#2d4f26] text-white rounded-lg px-4 md:px-6 py-4 md:py-5 items-center gap-2 group shadow-lg shadow-green-900/20 text-sm md:text-base">
            <span className="font-semibold whitespace-nowrap">Pesan Sekarang</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-[#3f6d35] p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 shadow-md">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={
                i === 0
                  ? 'bg-[#3f6d35] text-white px-4 py-2.5 rounded-lg font-medium text-sm text-center shadow-md'
                  : 'text-[#3f6d35] font-semibold text-sm py-2 border-b border-gray-100 last:border-0'
              }
            >
              {link.label}
            </Link>
          ))}
          <Button
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            variant="outline"
            className="border-red-400 text-red-500 hover:bg-red-50 rounded-lg py-4 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            <span className="font-semibold">Logout</span>
          </Button>
          <Button
            onClick={() => setMenuOpen(false)}
            className="bg-[#3f6d35] hover:bg-[#2d4f26] text-white rounded-lg py-5 flex items-center justify-center gap-2 group shadow-lg shadow-green-900/20"
          >
            <span className="font-semibold">Pesan Sekarang</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
