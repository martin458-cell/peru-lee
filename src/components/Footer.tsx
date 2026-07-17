import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a17] text-[#f5f5f0] mt-auto py-8 border-t border-natural-primary/55 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-serif font-bold text-[#e1e1d8] uppercase tracking-widest">El Perú Lee 2026</p>
          <p className="text-xs text-[#a3a398] mt-1 font-light max-w-xl">
            Plataforma Informativa Descentralizada e Inteligente en Soporte a los Concursos Educativos del Perú, diseñada con estética de tonos naturales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8a8a7e] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-mono">
            SICE v2.1 (Soporte Base de Datos Integrado)
          </span>
        </div>
      </div>
    </footer>
  );
}
