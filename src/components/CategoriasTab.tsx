import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { categoriesData } from '../constants';

type CategoryKey = 'A' | 'B' | 'C' | 'D' | 'E';

export default function CategoriasTab() {
  const [selectedCat, setSelectedCat] = useState<CategoryKey>('C');

  const data = categoriesData[selectedCat];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <div className="bg-[#e1e1d8]/40 p-6 rounded-[24px] border border-natural-border flex flex-col md:flex-row gap-6 items-center">
        <div className="p-3 bg-natural-primary rounded-xl text-white">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-natural-text">Competición adaptada por niveles de escolaridad</h2>
          <p className="text-natural-secondary mt-1 text-sm font-light leading-relaxed">
            El concurso abarca estudiantes de Educación Básica Regular (EBR) tanto en castellano como en lenguas originarias. Cada ciclo escolar cuenta con productos literarios específicos, duraciones controladas y modalidades de participación individuales o grupales.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {([
          { key: 'A', level: 'PRIMARIA', cycle: 'Ciclo III', grades: '1.er y 2.do de Primaria', prod: 'Video: Mi bitácora de lectura', eval: '100% Producto' },
          { key: 'B', level: 'PRIMARIA', cycle: 'Ciclo IV', grades: '3.er y 4.to de Primaria', prod: 'Video: Mi cartelera lectora', eval: '100% Producto' },
          { key: 'C', level: 'PRIMARIA', cycle: 'Ciclo V', grades: '5.to y 6.to de Primaria', prod: 'Video: Cartelera Comparativa', eval: '30% Prod. / 70% Desafío' },
          { key: 'D', level: 'SECUNDARIA', cycle: 'Ciclo VI', grades: '1.er y 2.do de Secundaria', prod: 'Video: Reseña de Obra', eval: '30% Prod. / 70% Desafío' },
          { key: 'E', level: 'SECUNDARIA', cycle: 'Ciclo VII', grades: '3.er a 5.to de Secundaria', prod: 'Pódcast de audio digital', eval: '30% Prod. / 70% Desafío' },
        ] as const).map((cat) => {
          const isSelected = selectedCat === cat.key;
          return (
            <div 
              key={cat.key}
              onClick={() => setSelectedCat(cat.key)}
              className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between h-full hover:shadow-md ${
                isSelected 
                  ? 'border-natural-primary bg-white ring-2 ring-natural-primary/25 transform -translate-y-1' 
                  : 'bg-white border-natural-border'
              }`}
            >
              <div className="p-4 border-b border-natural-border bg-[#f9f9f7]">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cat.level === 'PRIMARIA' ? 'bg-[#5A5A40]/15 text-natural-primary' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cat.level}
                  </span>
                  <span className="text-[10px] font-medium text-natural-secondary">{cat.cycle}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-natural-text mt-2">Categoría {cat.key}</h3>
                <p className="text-xs text-natural-secondary mt-0.5 font-light leading-tight">{cat.grades}</p>
              </div>

              <div className="p-4 flex-grow space-y-2 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-natural-accent font-bold uppercase">Producto:</span>
                  <span className="font-semibold text-natural-primary">{cat.prod}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1.5 border-t border-natural-border">
                  <span className="text-[10px] text-natural-accent font-bold uppercase">Evaluación:</span>
                  <span className="font-medium text-natural-text">{cat.eval}</span>
                </div>
              </div>

              <div className="p-3 bg-[#f9f9f7] border-t border-natural-border">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCat(cat.key);
                  }}
                  className={`w-full text-center py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isSelected 
                      ? 'bg-natural-primary text-white hover:bg-natural-primary-hover shadow-sm' 
                      : 'bg-white border border-natural-border text-natural-text hover:bg-natural-bg'
                  }`}
                >
                  <span>Analizar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis Panel */}
      <div className="bg-white border border-natural-border rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-natural-border">
          <div>
            <h3 className="text-xl font-serif font-bold text-natural-text flex items-center gap-2">
              <span className="text-natural-primary italic font-semibold">{data.title}</span> - Rúbricas e Indicadores de Logro
            </h3>
            <p className="text-xs text-natural-secondary mt-1 font-light">{data.grades} — Análisis en conformidad con las bases nacionales.</p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-natural-primary/10 border border-natural-primary/20 text-xs font-bold text-natural-primary">
            Puntaje Máximo: {data.points} pts.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Production Reqs */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-natural-text text-sm tracking-wide uppercase border-l-4 border-natural-primary pl-3">Requisitos de la Producción</h4>
            <div className="p-4 bg-[#f9f9f7] rounded-2xl space-y-3 border border-natural-border">
              {data.reqs.map((req, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-white border border-natural-border rounded-xl text-xs leading-relaxed text-natural-text shadow-xs"
                  dangerouslySetInnerHTML={{ __html: req }}
                />
              ))}
            </div>
          </div>

          {/* Indicators List */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-natural-text text-sm tracking-wide uppercase border-l-4 border-natural-secondary pl-3">Criterios de Evaluación del Jurado</h4>
            <div className="divide-y divide-natural-border max-h-80 overflow-y-auto pr-2">
              {data.indicators.map((ind, index) => (
                <div key={index} className="py-3 flex items-start gap-3.5">
                  <div className="mt-0.5 w-5 h-5 rounded bg-natural-primary/10 border border-natural-primary/20 text-natural-primary flex items-center justify-center font-bold text-xs shrink-0">{index + 1}</div>
                  <div>
                    <p className="font-bold text-natural-text text-xs">{ind.t}</p>
                    <p className="text-[11px] text-natural-secondary mt-0.5 leading-relaxed font-light">{ind.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
