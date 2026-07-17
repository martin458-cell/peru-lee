import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#071126] text-[#f5f5f0] mt-auto py-8 border-t border-natural-primary/55 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm font-serif font-bold text-natural-accent uppercase tracking-widest">El Perú Lee 2026</p>
          <p className="text-xs text-slate-300 mt-1 font-light max-w-xl">
            Plataforma Informativa Descentralizada e Inteligente en Soporte a los Concursos Educativos del Perú, diseñada con los colores institucionales: Rojo, Blanco, Dorado y Azul Marino de la I.E.P.M. N° 24009 "Túpac Amaru II".
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-natural-accent bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-mono">
            SICE v2.1 (Soporte Base de Datos Integrado)
          </span>
        </div>
      </div>
    </footer>
  );
}
