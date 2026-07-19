import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Sparkles, CheckSquare, Trash2, Award } from 'lucide-react';
import { calcData } from '../constants';

interface EvaluadorProps {
  onShowToast: (msg: string) => void;
  onRefreshHistory: () => void;
}

export default function EvaluadorTab({ onShowToast, onRefreshHistory }: EvaluadorProps) {
  const [category, setCategory] = useState('C5');
  const [studentName, setStudentName] = useState('');
  const [scores, setScores] = useState<number[]>([]);
  const [desafioScores, setDesafioScores] = useState<number[]>([3, 3]); // default Level II
  const [isSaving, setIsSaving] = useState(false);

  const data = calcData[category];

  // Initialize scores array when category changes
  useEffect(() => {
    if (data) {
      setScores(Array(data.indicators.length).fill(3)); // Default to 3 (Logro esperado)
    }
  }, [category]);

  if (!data) return null;

  const handleScoreChange = (index: number, val: number) => {
    const nextScores = [...scores];
    nextScores[index] = val;
    setScores(nextScores);
  };

  const handleDesafioChange = (index: number, val: number) => {
    const nextDesafio = [...desafioScores];
    nextDesafio[index] = val;
    setDesafioScores(nextDesafio);
  };

  // Run calculation
  const totalProductRaw = scores.reduce((sum, score) => sum + score, 0);
  const maxProductRaw = data.maxRaw;
  const productPercentage = (totalProductRaw / maxProductRaw) * 100;

  let finalScorePercent = 0;
  let totalDesafioRaw = 0;
  const maxDesafioRaw = 8;

  if (data.needsDesafio) {
    totalDesafioRaw = desafioScores.reduce((sum, s) => sum + s, 0);
    const desafioPercentage = (totalDesafioRaw / maxDesafioRaw) * 100;
    finalScorePercent = (productPercentage * 0.3) + (desafioPercentage * 0.7);
  } else {
    finalScorePercent = productPercentage;
  }

  // Determine Level badge
  let level = 'EN INICIO';
  let badgeClass = 'bg-natural-secondary/15 text-natural-secondary border border-natural-secondary/20';
  let levelTitle = 'En Inicio';
  let levelTitleClass = 'text-natural-secondary font-serif font-bold';
  let levelDesc = 'El estudiante o equipo muestra dificultades muy significativas para estructurar ideas, ubicar datos explícitos del texto o justificar argumentalmente sus sugerencias lectoras.';

  if (finalScorePercent >= 90) {
    level = 'LOGRO DESTACADO';
    badgeClass = 'bg-natural-accent text-white';
    levelTitle = 'Logro Destacado';
    levelTitleClass = 'text-natural-accent font-serif font-bold';
    levelDesc = 'Desempeño descollante y sobresaliente. Deconstruye con facilidad textos complejos, evalúa falacias, paradojas e integra de forma intertextual e interdisciplinar de manera impecable.';
  } else if (finalScorePercent >= 75) {
    level = 'LOGRO ESPERADO';
    badgeClass = 'bg-natural-primary text-white';
    levelTitle = 'Logro Esperado';
    levelTitleClass = 'text-natural-primary font-serif font-bold';
    levelDesc = 'El estudiante o equipo evidencia las competencias pedagógicas mínimas del CNEB. Identifica propósitos narrativos con soltura, sintetiza de forma lógica y recomienda estructurando juicios sólidos.';
  } else if (finalScorePercent >= 45) {
    level = 'EN PROCESO';
    badgeClass = 'bg-blue-50 text-natural-primary border border-blue-200';
    levelTitle = 'En Proceso';
    levelTitleClass = 'text-blue-800 font-serif font-bold';
    levelDesc = 'El estudiante o equipo está muy próximo a lograr el estándar de competencia pero requiere acompañamiento mediado para deducir sentidos figurados de las palabras o cruzar analogías intertextuales.';
  }

  // Get desafio descriptions dynamically
  const getDesafioDesc = (index: number, val: number) => {
    if (index === 0) {
      if (category.startsWith('C')) {
        return val === 2 ? "Se basa en información general que se reitera a lo largo del texto para construir el sentido global." :
               val === 3 ? "Se realizan de forma adecuada inferencias que involucran partes específicas y vincula información dispersa." :
                           "Logra realizar inferencias altamente cohesionadas cruzando ideas específicas de ambos textos leídos de forma sobresaliente.";
      } else if (category.startsWith('D')) {
        return val === 2 ? "Deduce ideas de carácter general uniendo partes explícitas dispersas." :
               val === 3 ? "Integra información explícita e implícita de forma intertextual sólida." :
                           "Deduce de forma fluida información explícita, implícita y especializada de diversas fuentes.";
      } else {
        return val === 2 ? "Interpreta de manera global apoyándose en datos explícitos del texto." :
               val === 3 ? "Identifica información implícita, complementaria y analiza estructuras argumentales." :
                           "Reconoce de forma brillante matices, ironías, falacias e informaciones ambiguas para una lectura compleja.";
      }
    } else {
      if (category.startsWith('C')) {
        return val === 2 ? "Brinda opinión sobre el tema general sin vincularla directamente con el contenido." :
               val === 3 ? "Brinda una opinión personal y madura sobre el contenido de ambos textos leídos." :
                           "Opina críticamente explicando el uso de recursos y figuras del lenguaje según el efecto en el lector.";
      } else if (category.startsWith('D')) {
        return val === 2 ? "Opina sobre el contenido general sin explicar formas discursivas." :
               val === 3 ? "Brinda opinión personal de fondo y explica el uso del lenguaje para el lector." :
                           "Opina críticamente, evalúa rigurosamente el estilo lingüístico y juzga su idoneidad narrativa.";
      } else {
        return val === 2 ? "Explica usos simples de recursos de persuasión del autor." :
               val === 3 ? "Opina de forma crítica, evalúa la eficacia formal y justifica cómo se estructuró la obra." :
                           "Evalúa la validez científica o lógica cruzando fuentes e ideologías de manera autónoma y deconstruye el discurso.";
      }
    }
  };

  const handleSaveEvaluation = async () => {
    if (!studentName.trim()) {
      onShowToast("Por favor, ingresa el nombre del estudiante o equipo calificado.");
      return;
    }

    const evalId = "ev-" + Date.now();
    const newEvalRecord = {
      id: evalId,
      studentName,
      category,
      scores,
      desafioScores: data.needsDesafio ? desafioScores : [],
      totalProductRaw,
      maxProductRaw,
      finalScorePercent: parseFloat(finalScorePercent.toFixed(2)),
      level,
      createdAt: new Date().toISOString()
    };

    // 1. Dual Persistence: Save to local storage first
    try {
      const localEvalsRaw = localStorage.getItem('local_evaluations');
      let localEvals = localEvalsRaw ? JSON.parse(localEvalsRaw) : [];
      localEvals.unshift(newEvalRecord);
      localStorage.setItem('local_evaluations', JSON.stringify(localEvals));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    setIsSaving(true);
    try {
      // 2. Dual Persistence: Try to save/sync with server
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvalRecord)
      });

      if (response.ok) {
        onShowToast(`¡Evaluación de ${studentName} guardada con éxito en la base de datos!`);
        setStudentName('');
        onRefreshHistory();
      } else {
        onShowToast("Evaluación guardada localmente de forma segura (Sincronización diferida).");
        setStudentName('');
        onRefreshHistory();
      }
    } catch (e) {
      console.error(e);
      onShowToast("Evaluación guardada localmente (Servidor temporalmente desconectado).");
      setStudentName('');
      onRefreshHistory();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white border border-natural-border rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="border-b border-natural-border pb-5">
          <h2 className="text-2xl font-serif font-bold text-natural-text">Evaluador Inteligente de Logros</h2>
          <p className="text-natural-secondary text-sm mt-1 font-light leading-relaxed">Selecciona la categoría de un estudiante o equipo y califica sus rúbricas e indicadores para calcular el nivel de competencia y la ponderación final del concurso (30% producto / 70% desafío) de forma instantánea.</p>
        </div>

        {/* SELECTORES DE EVALUACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-semibold text-natural-text mb-2">Seleccione Categoría</label>
            <select 
              id="calc-category" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f9f9f7] border border-natural-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-natural-primary font-bold text-natural-text"
            >
              <option value="A1">Categoría A (1.er Grado de Primaria)</option>
              <option value="A2">Categoría A (2.do Grado de Primaria)</option>
              <option value="B3">Categoría B (3.er Grado de Primaria)</option>
              <option value="B4">Categoría B (4.to Grado de Primaria)</option>
              <option value="C5">Categoría C (5.to Grado de Primaria)</option>
              <option value="C6">Categoría C (6.to Grado de Primaria)</option>
              <option value="D1">Categoría D (1.er Grado de Secundaria)</option>
              <option value="D2">Categoría D (2.do Grado de Secundaria)</option>
              <option value="E3">Categoría E (3.er Grado de Secundaria)</option>
              <option value="E4">Categoría E (4.to Grado de Secundaria)</option>
              <option value="E5">Categoría E (5.to Grado de Secundaria)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-natural-text mb-2">Ponderación Oficial</label>
            <div id="calc-weight-desc" className="p-3 bg-natural-primary/5 border border-natural-primary/20 rounded-xl text-xs font-semibold text-natural-text flex items-center justify-between h-12">
              <span>{data.needsDesafio ? "Ponderación Compleja:" : "Ponderación Única:"}</span>
              <span className="bg-natural-primary text-white border border-natural-primary/10 px-2.5 py-1 rounded-md font-bold text-[10px] uppercase">
                {data.needsDesafio ? "30% Producto + 70% Desafío" : "100% Producto Único"}
              </span>
            </div>
          </div>
        </div>

        {/* REGISTRATION PANEL (STUDENT NAME INPUT) */}
        <div className="mt-6 p-4 bg-[#f9f9f7] border border-natural-border rounded-xl flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-grow w-full">
            <label className="block text-xs font-bold text-natural-text mb-1.5 uppercase tracking-wider">Nombre del Estudiante o del Equipo Evaluado</label>
            <input 
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ej. Juan Carlos Cahuana / Equipo C - 5to B"
              className="w-full bg-white border border-natural-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-natural-primary font-medium text-natural-text placeholder-natural-secondary/55"
            />
          </div>
          <button 
            type="button"
            onClick={handleSaveEvaluation}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center justify-center gap-2 transition-all shrink-0 hover:shadow disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{isSaving ? "Guardando..." : "Guardar Evaluación en BD"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 border-t border-natural-border pt-8">
          {/* PRODUCT INDICATORS */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-bold text-natural-text text-sm flex items-center gap-2 tracking-wide uppercase">
                <span className="w-2.5 h-2.5 rounded-full bg-natural-primary"></span>
                Rúbrica del Producto Escrito / Video / Podcast
              </h3>
              <p className="text-xs text-natural-secondary mt-1 font-light">Asigna el nivel correspondiente de 1 a 4 puntos para cada indicador de logro.</p>
            </div>

            {/* Render score selectors */}
            <div className="space-y-4">
              {data.indicators.map((indicator, index) => (
                <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-[#f9f9f7] border border-natural-border rounded-xl hover:border-natural-primary/30 transition-all">
                  <div className="flex-grow pr-4">
                    <p className="text-xs font-semibold text-natural-text leading-relaxed">{index + 1}. {indicator}</p>
                  </div>
                  <div className="w-full sm:w-auto shrink-0">
                    <select 
                      value={scores[index] || 3}
                      onChange={(e) => handleScoreChange(index, parseInt(e.target.value))}
                      className="w-full sm:w-auto bg-white border border-natural-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-natural-text focus:outline-none focus:ring-1 focus:ring-natural-primary"
                    >
                      <option value="1">En inicio (1 pt)</option>
                      <option value="2">En proceso (2 pts)</option>
                      <option value="3">Logro esperado (3 pts)</option>
                      <option value="4">Logro destacado (4 pts)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* CHALLENGE PANEL (IF APPLICABLE) */}
            {data.needsDesafio && (
              <div className="space-y-4 pt-6 border-t border-natural-border">
                <div>
                  <h3 className="font-bold text-natural-text text-sm flex items-center gap-2 tracking-wide uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-natural-secondary"></span>
                    Rúbrica del Desafío de Lectura y Análisis (70%)
                  </h3>
                  <p className="text-xs text-natural-secondary mt-1 font-light">Basado en el anexo F10. Se evalúa de manera presencial/virtual oral por el jurado descentralizado.</p>
                </div>

                <div className="space-y-4 bg-natural-primary/5 border border-natural-primary/20 p-4 rounded-2xl">
                  {/* Aspect 1 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <label className="text-xs font-bold text-natural-text">Aspecto 1: Inferir e interpretar información del texto</label>
                      <select 
                        value={desafioScores[0]}
                        onChange={(e) => handleDesafioChange(0, parseInt(e.target.value))}
                        className="bg-white border border-natural-border rounded-lg px-2 py-1 text-xs font-bold text-natural-text focus:outline-none focus:ring-1 focus:ring-natural-primary self-start sm:self-auto"
                      >
                        <option value="2">Nivel I (En Proceso) - 2 pts.</option>
                        <option value="3">Nivel II (Logro Esperado) - 3 pts.</option>
                        <option value="4">Nivel III (Logro Destacado) - 4 pts.</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-natural-secondary leading-relaxed font-light italic">
                      {getDesafioDesc(0, desafioScores[0])}
                    </p>
                  </div>

                  {/* Aspect 2 */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-natural-primary/20">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <label className="text-xs font-bold text-natural-text">Aspecto 2: Reflexionar y evaluar la forma, contenido y contexto</label>
                      <select 
                        value={desafioScores[1]}
                        onChange={(e) => handleDesafioChange(1, parseInt(e.target.value))}
                        className="bg-white border border-natural-border rounded-lg px-2 py-1 text-xs font-bold text-natural-text focus:outline-none focus:ring-1 focus:ring-natural-primary self-start sm:self-auto"
                      >
                        <option value="2">Nivel I (En Proceso) - 2 pts.</option>
                        <option value="3">Nivel II (Logro Esperado) - 3 pts.</option>
                        <option value="4">Nivel III (Logro Destacado) - 4 pts.</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-natural-secondary leading-relaxed font-light italic">
                      {getDesafioDesc(1, desafioScores[1])}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR REPORT */}
          <div className="bg-[#2d2d2a] text-white rounded-3xl p-6 sm:p-8 shadow-xl h-fit sticky top-24 flex flex-col justify-between border border-[#5A5A40]/10">
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider">Reporte de Calificación</h3>
              
              <div className="border-b border-white/10 pb-4">
                <div className="text-4xl font-serif font-black text-white">{finalScorePercent.toFixed(2)}%</div>
                <div className="text-[10px] text-[#a3a398] mt-1 uppercase tracking-wider font-bold">Puntaje Final Ponderado</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#a3a398]">Puntaje Producto:</span>
                  <span className="font-semibold text-[#e1e1d8]">
                    {totalProductRaw} / {maxProductRaw} pts ({productPercentage.toFixed(1)}%)
                  </span>
                </div>
                {data.needsDesafio && (
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#a3a398]">Puntaje Desafío:</span>
                    <span className="font-semibold text-[#e1e1d8]">
                      {desafioScores.reduce((a, b) => a + b, 0)} / 8 pts ({(desafioScores.reduce((a, b) => a + b, 0) / 8 * 100).toFixed(1)}%)
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs pt-3 border-t border-white/10 items-center">
                  <span className="text-[#a3a398]">Rendimiento:</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded text-[9px] tracking-wider ${badgeClass}`}>
                    {level}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#3a3a35] rounded-xl text-xs space-y-1.5 border border-white/5">
                <p className={levelTitleClass}>{levelTitle}</p>
                <p className="text-[#e1e1d8] leading-relaxed font-light text-[11px]">{levelDesc}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-[10px] text-[#a3a398] italic leading-relaxed">
              *Cálculo implementado en estricta conformidad con las directrices de ponderación del anexo F del Concurso Nacional de Comprensión Lectora 2026.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
