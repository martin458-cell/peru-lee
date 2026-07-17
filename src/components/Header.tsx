import React from 'react';
import { Award, Mail } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-natural-primary text-white shadow-md relative overflow-hidden no-print border-b border-natural-border">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/10 mb-3 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-natural-accent animate-pulse"></span>
              Bases Oficiales, Calificaciones y Generador del Expediente EPL 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Plataforma El Perú Lee <span className="italic font-normal text-natural-accent">2026</span>
            </h1>
            <p className="mt-2 text-sm text-slate-200 max-w-2xl font-light leading-relaxed">
              Guía pedagógica interactiva, calculadora de rúbricas ponderadas, generador de Ficha de Inscripción (Anexo F1) para EBR y base de datos de expedientes, diseñada con los colores institucionales de la I.E.P.M. N° 24009 "Túpac Amaru II" (Rojo, Blanco, Dorado y Azul Marino).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <div className="text-[10px] uppercase tracking-wider text-[#dcdcd0] font-bold">Soporte Técnico MINEDU</div>
              <a href="mailto:elperulee@minedu.gob.pe" className="text-sm font-serif italic font-semibold hover:underline text-[#f5f5f0] flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <Mail className="w-3.5 h-3.5 opacity-80" />
                elperulee@minedu.gob.pe
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
