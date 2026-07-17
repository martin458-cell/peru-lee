import React from 'react';
import { BookOpen, Calendar, HelpCircle } from 'lucide-react';

export default function CronogramaTab() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white border border-natural-border rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="border-b border-natural-border pb-5">
          <h2 className="text-2xl font-serif font-bold text-natural-text">Cronograma General y Específico 2026</h2>
          <p className="text-natural-secondary text-sm mt-1">Conoce las fechas críticas de ejecución de la fase preparatoria y de desarrollo del concurso en cada una de sus instancias descentralizadas (I.E., UGEL, DRE, Macrorregional y Nacional).</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative pl-6 border-l-2 border-natural-border space-y-8">
              
              {/* Fase Preparatoria */}
              <div className="relative">
                <div className="absolute -left-9 top-1.5 bg-natural-secondary text-white p-1 rounded-full border-4 border-white shadow-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-natural-secondary uppercase">Fase Preparatoria</span>
                  <h4 className="text-md font-bold text-natural-text mt-1">Generación de condiciones y lectura guiada</h4>
                  <p className="text-natural-secondary text-xs mt-1 leading-relaxed">
                    Fomento del acceso a bibliotecas físicas y virtuales (BNP, PerúEduca). Planificación del Plan Lector institucional y desarrollo autónomo de bitácoras, carteleras y reseñas literarias por parte de las aulas.
                  </p>
                  <div className="mt-2 text-[11px] font-semibold text-natural-primary bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md w-fit">
                    Desde la aprobación de bases hasta la culminación de la etapa UGEL
                  </div>
                </div>
              </div>

              {/* Etapa I.E. */}
              <div className="relative">
                <div className="absolute -left-9 top-1.5 bg-natural-primary text-white p-1 rounded-full border-4 border-white shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-natural-primary uppercase">Etapa Institución Educativa (I.E.)</span>
                  <h4 className="text-md font-bold text-natural-text mt-1">Ejecución del Concurso Interno y Registro en el SICE</h4>
                  <p className="text-natural-secondary text-xs mt-1 leading-relaxed">
                    Los docentes asisten y recopilan las producciones creadas. Se ejecuta el Desafío Lector presencial interno para estudiantes de las categorías C, D y E. Calificación grupal e inscripción en la UGEL.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold text-natural-text bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Inicio: 15 de Julio de 2026</span>
                    <span className="text-[11px] font-semibold text-natural-text bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Fin: 18 de Agosto de 2026</span>
                  </div>
                </div>
              </div>

              {/* Etapa UGEL */}
              <div className="relative">
                <div className="absolute -left-9 top-1.5 bg-natural-primary text-white p-1 rounded-full border-4 border-white shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-natural-primary uppercase">Etapa UGEL (Unidad de Gestión Educativa Local)</span>
                  <h4 className="text-md font-bold text-natural-text mt-1">Calificación de Productos y Desafío Presencial UGEL</h4>
                  <p className="text-natural-secondary text-xs mt-1 leading-relaxed">
                    Calificación virtual de productos de todas las categorías (A y B continúan 100% virtual). Desafío presencial de lectura y análisis para C, D y E. Registro en SICE.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold text-natural-primary bg-natural-primary/10 px-3 py-1 rounded border border-natural-primary/20">Inscripción: 24 al 31 de Agosto de 2026</span>
                    <span className="text-[11px] font-semibold text-natural-text bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Ejecución: 28 de Agosto al 4 de Setiembre de 2026</span>
                  </div>
                </div>
              </div>

              {/* Etapa DRE */}
              <div className="relative">
                <div className="absolute -left-9 top-1.5 bg-natural-secondary text-white p-1 rounded-full border-4 border-white shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-natural-secondary uppercase">Etapa DRE / GRE</span>
                  <h4 className="text-md font-bold text-natural-text mt-1">Evaluación de Nuevos Productos a nivel Regional</h4>
                  <p className="text-natural-secondary text-xs mt-1 leading-relaxed">
                    Los clasificados pueden reelaborar o mejorar sus productos bajo asesoría. Desafío presencial para categorías C, D y E en evento público de la DRE.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-natural-primary bg-natural-primary/10 px-3 py-1 rounded border border-natural-primary/20">Inscripción: 14 al 18 de Setiembre de 2026</span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Ejecución: 7 al 11 de Setiembre de 2026</span>
                  </div>
                </div>
              </div>

              {/* Etapa Macrorregional */}
              <div className="relative">
                <div className="absolute -left-9 top-1.5 bg-natural-secondary text-white p-1 rounded-full border-4 border-white shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-natural-secondary uppercase">Etapa Macrorregional</span>
                  <h4 className="text-md font-bold text-natural-text mt-1">Calificación Virtual Global de Macrorregiones</h4>
                  <p className="text-natural-secondary text-xs mt-1 leading-relaxed">
                    Evaluación y clasificación macrorregional descentralizada. El Desafío de Lectura y Análisis se realiza de forma <strong>100% Virtual</strong> para C, D y E en esta etapa específica.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-natural-primary bg-natural-primary/10 px-3 py-1 rounded border border-natural-primary/20">Inscripción: 5 de Octubre de 2026</span>
                    <span className="text-[11px] font-semibold text-[#5A5A40] bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Ejecución: 21 de Setiembre al 2 de Octubre de 2026</span>
                  </div>
                </div>
              </div>

              {/* Gran Final Nacional */}
              <div className="relative">
                <div className="absolute -left-9 top-1.5 bg-natural-primary text-white p-1 rounded-full border-4 border-white shadow-sm animate-pulse">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-natural-primary uppercase">Gran Final Nacional</span>
                  <h4 className="text-md font-bold text-natural-text mt-1">Evaluación Final y Premiación de Campeones de Comprensión</h4>
                  <p className="text-natural-secondary text-xs mt-1 leading-relaxed">
                    Gran evento organizado por la DEFID-MINEDU de forma presencial para el Desafío de Lectura y Análisis de las categorías C, D y E, reuniendo a las delegaciones más destacadas de todo el país.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold text-natural-text bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Inscripción: 5 al 9 de Octubre de 2026</span>
                    <span className="text-[11px] font-semibold text-natural-text bg-[#f9f9f7] border border-natural-border px-3 py-1 rounded-md">Ejecución: 9 al 13 de Noviembre de 2026</span>
                    <span className="text-[11px] font-bold text-natural-primary bg-natural-primary/15 px-3 py-1 rounded border border-natural-primary/25">Resultados Finales: 18 de Noviembre de 2026</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Rules and guidelines sidebar */}
          <div className="bg-[#f9f9f7] rounded-2xl border border-natural-border p-6 space-y-6 h-fit text-natural-secondary">
            <h4 className="font-serif font-bold text-natural-text text-sm tracking-wider uppercase border-b border-natural-border pb-3">Reglas Críticas del SICE</h4>
            <ul className="space-y-4 text-xs text-natural-secondary">
              <li className="flex items-start gap-3">
                <span className="p-1 bg-natural-primary/15 text-natural-primary rounded font-bold text-[10px]">1</span>
                <div>
                  <p className="font-bold text-natural-text">Carga del Expediente y Anexos</p>
                  <p className="mt-0.5">La ficha estadística (Anexo F6) es prerrequisito obligatorio antes del registro. Los Anexos F1, F2 y F7 deben subirse firmados y sellados por el Director.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="p-1 bg-natural-primary/15 text-natural-primary rounded font-bold text-[10px]">2</span>
                <div>
                  <p className="font-bold text-natural-text">Fallas Técnicas de Conectividad</p>
                  <p className="mt-0.5">Excepcionalmente, zonas de frontera, VRAEM o rurales pueden realizar inscripción física con el especialista UGEL. En caso de fallas web, reportar por correo con captura legible antes de las 23:59 del día de cierre.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="p-1 bg-natural-primary/15 text-natural-primary rounded font-bold text-[10px]">3</span>
                <div>
                  <p className="font-bold text-natural-text">Mejora de Productos</p>
                  <p className="mt-0.5">Los estudiantes clasificados a la etapa DRE o Nacional pueden editar o mejorar su producto original hasta tres (3) días antes del desarrollo del concurso en esa etapa.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
