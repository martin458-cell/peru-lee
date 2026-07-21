import React from 'react';
import { BookOpen, Award, Download, Printer, FileText, CheckCircle, HelpCircle, AlertTriangle, ChevronRight } from 'lucide-react';

export default function GuiaDocenteTab() {
  
  const handlePrintPDF = () => {
    // We will build a beautifully formatted official print window for PDF export
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Por favor habilita las ventanas emergentes para descargar la guía en PDF.");
      return;
    }

    // Get SVG logo content or use absolute image URL
    const svgLogoUrl = '/assets/logo.svg';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Guía Pedagógica Oficial - El Perú Lee 2026 - I.E. 24009</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap');
            
            @page {
              size: A4;
              margin: 20mm;
            }
            
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              color: #1e293b;
              line-height: 1.6;
              font-size: 11pt;
              margin: 0;
              padding: 0;
            }

            .no-print-btn {
              position: fixed;
              top: 20px;
              right: 20px;
              background-color: #B31013;
              color: white;
              border: none;
              padding: 12px 24px;
              font-size: 11pt;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              z-index: 1000;
              font-family: 'Plus Jakarta Sans', sans-serif;
              transition: all 0.2s;
            }

            .no-print-btn:hover {
              background-color: #900;
              transform: translateY(-2px);
            }

            @media print {
              .no-print-btn {
                display: none;
              }
              body {
                background: white;
              }
            }

            .header-container {
              display: flex;
              align-items: center;
              border-bottom: 3px double #B31013;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }

            .logo-img {
              width: 90px;
              height: 90px;
              margin-right: 20px;
            }

            .header-text {
              flex-grow: 1;
            }

            .header-text h1 {
              font-family: 'Cinzel', serif;
              font-size: 18pt;
              color: #1a365d;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .header-text h2 {
              font-size: 12pt;
              color: #B31013;
              margin: 5px 0 0 0;
              font-weight: 700;
              letter-spacing: 1px;
            }

            .header-text p {
              font-size: 9pt;
              color: #64748b;
              margin: 2px 0 0 0;
              font-weight: bold;
            }

            .title-section {
              text-align: center;
              margin-bottom: 30px;
            }

            .title-section h3 {
              font-size: 16pt;
              color: #1e293b;
              margin: 0;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
              display: inline-block;
            }

            .title-section p {
              font-style: italic;
              color: #475569;
              margin-top: 5px;
              font-size: 10pt;
            }

            .section-card {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }

            .section-title {
              font-family: 'Cinzel', serif;
              font-size: 12pt;
              color: #1a365d;
              border-left: 5px solid #B31013;
              padding-left: 10px;
              margin-top: 0;
              margin-bottom: 15px;
              text-transform: uppercase;
            }

            .table-summary {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              font-size: 9.5pt;
            }

            .table-summary th {
              background-color: #1a365d;
              color: white;
              font-weight: bold;
              text-align: left;
              padding: 8px 10px;
              border: 1px solid #cbd5e1;
            }

            .table-summary td {
              padding: 8px 10px;
              border: 1px solid #cbd5e1;
            }

            .table-summary tr:nth-child(even) {
              background-color: #f8fafc;
            }

            .bullet-list {
              padding-left: 20px;
              margin: 10px 0;
            }

            .bullet-list li {
              margin-bottom: 8px;
              font-size: 10pt;
            }

            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 8pt;
              font-weight: bold;
              text-transform: uppercase;
            }

            .badge-primaria {
              background-color: #f1f5f9;
              color: #1e293b;
              border: 1px solid #cbd5e1;
            }

            .badge-points {
              background-color: #fef2f2;
              color: #b91c1c;
              border: 1px solid #fca5a5;
            }

            .category-detail {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 25px;
              page-break-inside: avoid;
            }

            .category-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }

            .category-header h4 {
              font-size: 12pt;
              color: #1a365d;
              margin: 0;
            }

            .indicator-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 8px;
              margin-top: 10px;
            }

            .indicator-item {
              background: white;
              border: 1px solid #e2e8f0;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 9.5pt;
            }

            .indicator-item strong {
              color: #B31013;
            }

            .footer-notes {
              margin-top: 40px;
              border-top: 1px solid #cbd5e1;
              padding-top: 15px;
              text-align: center;
              font-size: 8.5pt;
              color: #64748b;
              page-break-inside: avoid;
            }

            .seal-container {
              display: flex;
              justify-content: space-around;
              margin-top: 50px;
              page-break-inside: avoid;
            }

            .seal-box {
              text-align: center;
              width: 200px;
              font-size: 9pt;
              color: #475569;
            }

            .seal-line {
              border-top: 1px solid #475569;
              margin-top: 50px;
              padding-top: 5px;
            }

            .avoid-break {
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <button class="no-print-btn" onclick="window.print()">📥 Imprimir / Guardar como PDF</button>

          <!-- Official MINEDU & Institution Header -->
          <div class="header-container">
            <img src="${svgLogoUrl}" class="logo-img" alt="Logo">
            <div class="header-text">
              <h1>I.E.P.M. N° 24009 "Túpac Amaru II"</h1>
              <h2>Sede Puquio - Ayacucho</h2>
              <p>COMITÉ PEDAGÓGICO LECTOR — CONCURSO NACIONAL "EL PERÚ LEE" 2026</p>
            </div>
          </div>

          <div class="title-section">
            <h3>GUÍA DE ORIENTACIÓN PEDAGÓGICA Y RÚBRICAS</h3>
            <p>Categorías A, B y C (Nivel Primaria de EBR) - Bases Oficiales 2026</p>
          </div>

          <!-- Section I -->
          <div class="section-card">
            <h3 class="section-title">I. Presentación del Concurso Lector</h3>
            <p>
              Estimados docentes y asesores de la <strong>I.E. 24009 "Túpac Amaru II"</strong>, la presente guía tiene como propósito esclarecer de forma rigurosa y pedagógica los requisitos, criterios de evaluación y formatos de participación del Concurso Nacional <strong>"El Perú Lee" 2026</strong> en las categorías de Primaria (A, B y C). 
            </p>
            <p>
              Fieles a nuestro lema institucional <strong>"ESTUDIO • SUPERACIÓN • TRABAJO"</strong>, buscamos orientar a los docentes para que guíen eficazmente a los estudiantes en la creación de sus productos y en la preparación del Desafío Presencial, reduciendo las dudas frecuentes sobre criterios de calificación.
            </p>
          </div>

          <!-- Section II -->
          <div class="section-card">
            <h3 class="section-title">II. Cuadro de Resumen Comparativo de Categorías</h3>
            <table class="table-summary">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Nivel/Ciclo</th>
                  <th>Grados</th>
                  <th>Producto Requerido</th>
                  <th>Formato y Tiempo</th>
                  <th>Puntaje</th>
                  <th>Ponderación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Categoría A</strong></td>
                  <td>Primaria / Ciclo III</td>
                  <td>1.er y 2.do Grado</td>
                  <td>Video horizontal de la <strong>Bitácora de Lectura</strong> (Individual)</td>
                  <td>De 6 a 8 minutos. Formato MP4 horizontal</td>
                  <td>28 pts</td>
                  <td>100% Evaluación del Video</td>
                </tr>
                <tr>
                  <td><strong>Categoría B</strong></td>
                  <td>Primaria / Ciclo IV</td>
                  <td>3.er y 4.to Grado</td>
                  <td>Video horizontal de <strong>"Mi Cartelera Lectora"</strong> (Grupal)</td>
                  <td>De 6 a 8 minutos. Grupo de 3 integrantes</td>
                  <td>36 pts</td>
                  <td>100% Evaluación del Video</td>
                </tr>
                <tr>
                  <td><strong>Categoría C</strong></td>
                  <td>Primaria / Ciclo V</td>
                  <td>5.to y 6.to Grado</td>
                  <td>Video horizontal de <strong>Cartelera Comparativa de 2 obras</strong> (Grupal)</td>
                  <td>De 6 a 8 minutos. Grupo de 3 integrantes</td>
                  <td>36 pts</td>
                  <td><strong>30% Video (Producto)<br>70% Desafío Presencial</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="page-break-after: always;"></div>

          <!-- Section III: Category A -->
          <div class="category-detail">
            <div class="category-header">
              <h4>CATEGORÍA A: Mi Bitácora de Lectura (1.° y 2.° Primaria)</h4>
              <span class="badge badge-points">Máximo: 28 puntos</span>
            </div>
            <p><strong>Orientación Pedagógica:</strong> En esta categoría los niños plasman sus lecturas autónomas en un cuaderno, fólder o bitácora mediante dibujos y pequeñas frases escritas. El video consiste en que el estudiante muestre su bitácora de lectura, relatando qué leyó y compartiendo su interpretación.</p>
            <p><strong>Estructura Exigida en el Video:</strong></p>
            <ul class="bullet-list">
              <li><strong>Presentación:</strong> Saludo breve indicando su nombre, sección y la obra que va a exponer.</li>
              <li><strong>Muestra de Bitácora:</strong> Explicación de los dibujos realizados en su bitácora. El estudiante debe pasar las hojas mostrando su creatividad artística.</li>
              <li><strong>Narración del Relato:</strong> Contar brevemente las partes de la historia con una secuencia coherente (Inicio, Nudo, Desenlace).</li>
              <li><strong>Cierre y Recomendación:</strong> Decir qué le pareció el libro y por qué otros niños deberían leerlo.</li>
            </ul>
            
            <p><strong>Criterios de Evaluación Clave:</strong></p>
            <div class="indicator-grid">
              <div class="indicator-item"><strong>1. Obtención de Información:</strong> Identifica el título, autor y partes evidentes del texto leído.</div>
              <div class="indicator-item"><strong>2. Secuenciación:</strong> Logra ordenar correctamente los sucesos principales cronológicamente.</div>
              <div class="indicator-item"><strong>3. Deducción de Características:</strong> Infiere el aspecto físico o de carácter de los personajes principales.</div>
              <div class="indicator-item"><strong>4. Relaciones Lógicas:</strong> Explica causas y efectos simples del relato (¿por qué pasó esto?).</div>
              <div class="indicator-item"><strong>5. Relación Texto-Imagen:</strong> Explica cómo se integran sus propios dibujos con el mensaje de la obra.</div>
              <div class="indicator-item"><strong>6. Formulación de Opiniones:</strong> Justifica por qué le agradó un hecho o personaje con argumentos propios de su edad.</div>
              <div class="indicator-item"><strong>7. Recomendación:</strong> Sugiere el libro con convicción, invitando activamente a otros a leerlo.</div>
            </div>
          </div>

          <!-- Section III: Category B -->
          <div class="category-detail">
            <div class="category-header">
              <h4>CATEGORÍA B: Mi Cartelera Lectora Colectiva (3.° y 4.° Primaria)</h4>
              <span class="badge badge-points">Máximo: 36 puntos</span>
            </div>
            <p><strong>Orientación Pedagógica:</strong> Participan en grupos estables de tres (3) estudiantes de la misma aula. Elaboran un cartel físico de una obra consensuada. El video muestra al equipo exponiendo su cartelera, donde cada uno debe hablar el mismo tiempo aproximado y complementarse fluidamente.</p>
            <p><strong>Estructura Exigida en el Video:</strong></p>
            <ul class="bullet-list">
              <li><strong>Introducción:</strong> Presentación del equipo y justificación de por qué escogieron colectivamente esa obra literaria.</li>
              <li><strong>Estructura de la Cartelera:</strong> Mostrar el cartel, señalando los elementos clave (título, autor, personajes principales, mensaje, moralejas, diseño tipográfico y dibujos).</li>
              <li><strong>Interpretación Temática:</strong> Explicación de los significados figurados, lecciones del libro y motivaciones profundas de los personajes.</li>
              <li><strong>Cohesión Grupal:</strong> Evidenciar que dialogan entre sí. No debe parecer tres exposiciones individuales aisladas.</li>
            </ul>

            <p><strong>Criterios de Evaluación Clave:</strong></p>
            <div class="indicator-grid">
              <div class="indicator-item"><strong>1. Análisis de Significado Contextual:</strong> Infiere modismos o palabras de sentido figurado según el texto.</div>
              <div class="indicator-item"><strong>2. Propósito y Mensaje:</strong> Explica con solvencia la moraleja e intencionalidad real del escritor.</div>
              <div class="indicator-item"><strong>3. Análisis de Recursos Gráficos:</strong> Justifica el uso de colores, tamaños de letra y diseño en el cartel.</div>
              <div class="indicator-item"><strong>4. Cohesión y Fluidez:</strong> Participación simétrica (un tercio del tiempo aproximado para cada estudiante).</div>
            </div>
          </div>

          <div style="page-break-after: always;"></div>

          <!-- Section III: Category C -->
          <div class="category-detail">
            <div class="category-header">
              <h4>CATEGORÍA C: Cartelera Comparativa Intertextual (5.° y 6.° Primaria)</h4>
              <span class="badge badge-points">Máximo: 36 puntos</span>
            </div>
            <p><strong>Orientación Pedagógica:</strong> Esta es una categoría de alto desempeño. Los estudiantes (en grupos de 3) deben comparar dos (2) obras literarias bajo un criterio explícito (ej. el mismo autor, misma época, o temática común). El video del producto solo constituye el 30% de la nota de preselección, mientras que el <strong>Desafío Presencial (Prueba de Diálogo) representa el 70% restante</strong> de la calificación de la etapa.</p>
            <p><strong>Estructura Exigida en el Video:</strong></p>
            <ul class="bullet-list">
              <li><strong>Análisis Intertextual:</strong> Establecer analogías, diferencias y similitudes específicas en la estructura de ambas obras.</li>
              <li><strong>Justificación Crítica:</strong> Defender la elección de las obras frente a la realidad escolar actual.</li>
              <li><strong>Efectos del Texto:</strong> Explicar el impacto emocional y moral de los personajes en la mentalidad de los estudiantes.</li>
            </ul>

            <p><strong>Estrategia de Éxito para el Desafío Presencial (70%):</strong></p>
            <p>En el Desafío Presencial, el jurado somete a los estudiantes a un diálogo espontáneo sin guiones, formulando preguntas analíticas complejas. Recomendamos ensayar:</p>
            <div class="indicator-grid">
              <div class="indicator-item"><strong>• Asociación Contextual:</strong> Relacionar el comportamiento de los personajes con el entorno geográfico e histórico real donde se sitúan las obras.</div>
              <div class="indicator-item"><strong>• Juicio Crítico de Valores:</strong> Tomar una posición ética sobre los dilemas morales que afrontan los personajes.</div>
              <div class="indicator-item"><strong>• Enlace con la Vida Cotidiana:</strong> Conectar el propósito del libro con problemáticas que viven hoy en el aula o comunidad de Puquio.</div>
            </div>
          </div>

          <!-- Section IV -->
          <div class="category-detail avoid-break" style="background-color: #fffef0; border-color: #eab308;">
            <div class="category-header" style="border-bottom-color: #eab308;">
              <h4 style="color: #854d0e;">⚠️ Errores Críticos que Causan Descalificación Directa</h4>
            </div>
            <ol style="padding-left: 20px; font-size: 9.5pt; margin: 5px 0;">
              <li><strong>Exceder la duración del video:</strong> Las bases fijan de 6 a 8 minutos. Videos de 5m 50s o de 8m 10s pueden ser penalizados drásticamente. ¡Ajusten el tiempo con cronómetro!</li>
              <li><strong>Problemas de Consentimiento:</strong> No adjuntar la autorización firmada por el padre o tutor para el uso de la imagen del menor de edad.</li>
              <li><strong>Ficha de Inscripción (Anexo F1) con tachaduras o datos incompletos:</strong> Utilicen la sección "Generador de Ficha" de esta plataforma para descargar un Anexo F1 limpio, preciso y digitalizado.</li>
              <li><strong>Audio Deficiente:</strong> Grabar en ambientes con eco, viento o ruidos de la calle. El jurado descalifica producciones donde la voz del estudiante no se entienda de forma nítida.</li>
            </ol>
          </div>

          <!-- Signatures Section -->
          <div class="seal-container">
            <div class="seal-box">
              <div class="seal-line">
                <strong>Comité Lector EPL 2026</strong><br>
                I.E. Túpac Amaru II
              </div>
            </div>
            <div class="seal-box">
              <div class="seal-line">
                <strong>Dirección Académica</strong><br>
                Subdirección de Primaria
              </div>
            </div>
          </div>

          <!-- Footer Notes -->
          <div class="footer-notes">
            Guía Informativa de Apoyo Docente generada por la Plataforma Digital "El Perú Lee 2026" de la I.E. 24009 "Túpac Amaru II".<br>
            Puquio, Lucanas, Ayacucho - Perú. Licencia de uso libre para la comunidad de educadores del plantel.
          </div>

        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Premium Header Banner in School Colors */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1A365D] via-[#2B6CB0] to-[#1A365D] text-white p-8 sm:p-10 border border-white/10 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-600 border border-red-500/30 text-white shadow-sm">
              Material Pedagógico Oficial 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight">
              Guía de Orientación Lector para Docentes Asesores
            </h2>
            <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              ¿Tienes dudas sobre los criterios pedagógicos exigidos por el MINEDU? Hemos compilado un manual detallado con sugerencias didácticas y rúbricas analizadas para las <strong>Categorías A, B y C</strong> que puedes exportar instantáneamente en PDF para tus sesiones de preparación.
            </p>
          </div>
          
          <div className="shrink-0">
            <button
              onClick={handlePrintPDF}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-red-500/40 cursor-pointer"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>DESCARGAR GUÍA EN PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category A Card */}
        <div className="bg-white rounded-3xl border border-natural-border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">CICLO III - PRIMARIA</span>
              <span className="text-xs font-bold text-red-600">1° y 2° Grado</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-natural-text">Categoría A: Bitácora de Lectura</h3>
            <p className="text-xs text-natural-secondary font-light leading-relaxed">
              Enfoque en la lectura autónoma o guiada. Los niños plasman dibujos y oraciones cortas que muestran la secuencia lógica del relato.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Video horizontal individual (6 a 8 minutos).</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Puntaje máximo de evaluación: 28 puntos.</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">No tiene desafío presencial (100% video).</span>
              </div>
            </div>
          </div>
          <div className="p-5 bg-slate-50/80 border-t border-natural-border flex justify-between items-center">
            <span className="text-xs font-semibold text-natural-primary">Sugerencias incluidas en PDF</span>
            <ChevronRight className="w-4 h-4 text-natural-primary" />
          </div>
        </div>

        {/* Category B Card */}
        <div className="bg-white rounded-3xl border border-natural-border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">CICLO IV - PRIMARIA</span>
              <span className="text-xs font-bold text-red-600">3° y 4° Grado</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-natural-text">Categoría B: Cartelera Lectora</h3>
            <p className="text-xs text-natural-secondary font-light leading-relaxed">
              Participación colectiva en grupos estables de tres integrantes. Exposición del cartel mostrando relaciones temáticas y recursos gráficos.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Exposición equilibrada (los 3 hablan por igual).</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Evaluación grupal consensuada (36 puntos).</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Exige justificar tamaño de letra y dibujos.</span>
              </div>
            </div>
          </div>
          <div className="p-5 bg-slate-50/80 border-t border-natural-border flex justify-between items-center">
            <span className="text-xs font-semibold text-natural-primary">Sugerencias incluidas en PDF</span>
            <ChevronRight className="w-4 h-4 text-natural-primary" />
          </div>
        </div>

        {/* Category C Card */}
        <div className="bg-white rounded-3xl border border-natural-border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">CICLO V - PRIMARIA</span>
              <span className="text-xs font-bold text-red-600">5° y 6° Grado</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-natural-text">Categoría C: Cartelera Comparativa</h3>
            <p className="text-xs text-natural-secondary font-light leading-relaxed">
              El nivel más alto de primaria. Requiere contrastar dos textos literarios de un mismo autor o temática, con un fuerte enfoque crítico.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Ponderación: 30% Video / 70% Desafío Oral.</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Desafío presencial de diálogo libre con el jurado.</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-natural-secondary">Exige vincular dilemas morales a la vida real.</span>
              </div>
            </div>
          </div>
          <div className="p-5 bg-slate-50/80 border-t border-natural-border flex justify-between items-center">
            <span className="text-xs font-semibold text-natural-primary">Sugerencias incluidas en PDF</span>
            <ChevronRight className="w-4 h-4 text-natural-primary" />
          </div>
        </div>

      </div>

      {/* Visual interactive FAQ Section to clarify teacher doubts */}
      <div className="bg-white border border-natural-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-xl font-serif font-bold text-natural-text flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-600" />
          Absolución de Dudas Frecuentes de Profesores (FAQ)
        </h3>
        
        <div className="divide-y divide-natural-border">
          
          <div className="py-4 space-y-1.5">
            <h4 className="text-sm font-bold text-natural-text flex items-start gap-2">
              <span className="text-red-600">P1:</span>
              ¿Se puede descalificar un video por durar unos segundos más o menos?
            </h4>
            <p className="text-xs text-natural-secondary leading-relaxed pl-7">
              <strong>Sí.</strong> Las bases oficiales son sumamente estrictas en las etapas UGEL y DRE. La duración permitida es estrictamente de 6 a 8 minutos. Un video que dure menos de 6 minutos o más de 8 minutos otorga argumentos fáciles de descalificación por parte de los comités veedores de la UGEL. Recomendamos encarecidamente editar y ajustar los videos a los rangos exactos.
            </p>
          </div>

          <div className="py-4 space-y-1.5">
            <h4 className="text-sm font-bold text-natural-text flex items-start gap-2">
              <span className="text-red-600">P2:</span>
              ¿En qué consiste el "Desafío Presencial" de la Categoría C y por qué vale tanto?
            </h4>
            <p className="text-xs text-natural-secondary leading-relaxed pl-7">
              Representa el <strong>70% de la calificación final</strong>. El jurado convoca a los tres integrantes del equipo de forma presencial. Les plantean preguntas analíticas de respuesta espontánea e interactiva para certificar que verdaderamente han leído de manera profunda y que no se limitaron a memorizar un guión para el video.
            </p>
          </div>

          <div className="py-4 space-y-1.5">
            <h4 className="text-sm font-bold text-natural-text flex items-start gap-2">
              <span className="text-red-600">P3:</span>
              ¿Qué textos deben leer para las Carteleras Comparativas de Categoría C?
            </h4>
            <p className="text-xs text-natural-secondary leading-relaxed pl-7">
              Deben elegir dos obras que tengan hilos conductores explícitos. Por ejemplo: dos fábulas del mismo autor (como fábulas de Esopo) para contrastar intencionalidades, o dos relatos históricos de la misma región (ejemplo: mitos de Ayacucho frente a mitos de la selva) para comparar recursos estilísticos y visiones de mundo.
            </p>
          </div>

          <div className="py-4 space-y-1.5">
            <h4 className="text-sm font-bold text-natural-text flex items-start gap-2">
              <span className="text-red-600">P4:</span>
              ¿Qué documentos son obligatorios para formalizar la inscripción de mis estudiantes?
            </h4>
            <p className="text-xs text-natural-secondary leading-relaxed pl-7">
              El expediente de postulación debe contener: 1) Ficha de Inscripción (Anexo F1) completamente digitalizada y firmada sin tachaduras, 2) Declaración jurada de no tener parentesco con el jurado, 3) Autorización firmada para el uso de imagen del menor y 4) El enlace directo del video guardado en Drive o YouTube en modo oculto/público.
            </p>
          </div>

        </div>

        {/* Warning Notification Box */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-red-800">Nota del Comité de Rúbricas de la I.E. 24009 "Túpac Amaru II"</h4>
            <p className="text-[11px] text-red-700 leading-relaxed font-light">
              La correcta aplicación de los indicadores de esta guía en tus aulas elevará la calidad de producción de tus estudiantes. Te recomendamos imprimir o guardar la guía oficial para socializarla con los padres de familia y comisiones preparatorias del grado.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
