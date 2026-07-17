import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, FileText, CheckSquare } from 'lucide-react';

interface ChecklistItem {
  id: string;
  code: string;
  title: string;
  desc: string;
  badgeColor: string;
}

const checklists: ChecklistItem[] = [
  {
    id: "f1",
    code: "Anexo F1",
    title: "Ficha de Inscripción del Participante",
    desc: "Debe ser generada y descargada. Posteriormente, debe estar firmada y sellada por el Director de la I.E. y el docente asesor, y subida al SICE.",
    badgeColor: "bg-[#5A5A40]/15 text-natural-primary border-natural-primary/20"
  },
  {
    id: "f2",
    code: "Anexo F2",
    title: "Credencial de Acreditación del Docente Asesor",
    desc: "Declaración jurada del director de la I.E. que acredita la labor pedagógica del docente asesor para la delegación escolar asignada.",
    badgeColor: "bg-[#8a8a7e]/20 text-[#5A5A40] border-[#8a8a7e]/30"
  },
  {
    id: "f3",
    code: "Anexo F3",
    title: "Carta de Compromiso del Padre / Madre o Apoderado",
    desc: "Autorización expresa firmada y con huella digital por parte de quien ejerza la patria potestad o tutela para la participación voluntaria del estudiante.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200"
  },
  {
    id: "f4",
    code: "Anexo F4 / F5",
    title: "Autorización de Difusión de Trabajos y Uso de Imagen",
    desc: "Consentimiento legal basado en la Ley de Protección de Datos Personales (Ley 29733) para la grabación de audio, video y fotografías con fines pedagógicos del MINEDU.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200"
  },
  {
    id: "f6",
    code: "Anexo F6",
    title: "Ficha Estadística de Estudiantes Participantes (Prerrequisito)",
    desc: "Declaración jurada obligatoria del total consolidado de estudiantes que participaron inicialmente en la etapa interna de la Institución Educativa, previo a inscribirse en el SICE.",
    badgeColor: "bg-[#5A5A40]/15 text-natural-primary border-natural-primary/20"
  },
  {
    id: "f7",
    code: "Anexo F7",
    title: "Declaración Jurada del Docente Asesor",
    desc: "Declaración de no registrar antecedentes policiales, penales ni judiciales, ni procesos disciplinarios vigentes bajo la Ley de Reforma Magisterial.",
    badgeColor: "bg-[#8a8a7e]/20 text-[#5A5A40] border-[#8a8a7e]/30"
  },
  {
    id: "f8",
    code: "Anexo F8",
    title: "Acta de Compromiso de Responsabilidades del Asesor",
    desc: "Suscripción de compromisos de verificación de datos, coordinación de traslados, custodia de permisos de viaje y trámites ante la comisión organizadora.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200"
  }
];

export default function ChecklistTab() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('epl_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggle = (id: string) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);
    localStorage.setItem('epl_checklist', JSON.stringify(next));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklists.length) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white border border-natural-border rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="border-b border-natural-border pb-5">
          <h2 className="text-2xl font-serif font-bold text-natural-text">Checklist de Control de Expedientes</h2>
          <p className="text-natural-secondary text-sm mt-1 font-light leading-relaxed">Garantiza el correcto registro de tus estudiantes. Los anexos oficiales deben ser descargados, firmados, sellados por el director de la Institución Educativa y cargados en el SICE para evitar nulidades o descalificaciones de la UGEL.</p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 p-5 bg-[#5A5A40]/5 border border-natural-primary/20 rounded-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif font-bold text-natural-primary text-sm">¿Deseas descargar los formatos editables vacíos oficiales?</h4>
            <p className="text-xs text-natural-secondary leading-relaxed max-w-2xl">Accede a la carpeta oficial autorizada por el Ministerio de Educación para descargar la plantilla directa en Word (.docx) y PDF de cada anexo:</p>
          </div>
          <a 
            href="https://acortar.link/3C6Z8z" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-3 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center gap-2 whitespace-nowrap transition-all shrink-0 hover:shadow-md"
          >
            Descargar Formatos Editables (.docx/.pdf)
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Progress bar */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-xs font-bold text-natural-text">
            <span>Progreso del Expediente ({completedCount} de {checklists.length} completados)</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#f5f5f0] rounded-full overflow-hidden border border-natural-border">
            <div 
              className="h-full bg-natural-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Interactivo */}
        <div className="space-y-4 mt-8">
          {checklists.map(item => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div 
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
                  isChecked 
                    ? 'bg-[#5A5A40]/5 border-natural-primary/40 shadow-xs' 
                    : 'bg-[#f9f9f7] border-natural-border hover:bg-[#f5f5f0]'
                }`}
              >
                <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleToggle(item.id)}
                    className="w-4 h-4 rounded text-natural-primary focus:ring-natural-primary/50 cursor-pointer border-natural-border accent-natural-primary"
                  />
                </div>
                <div className="space-y-1 flex-grow">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${item.badgeColor}`}>
                    {item.code}
                  </span>
                  <h4 className={`font-bold text-natural-text text-sm mt-1.5 flex items-center gap-1.5`}>
                    {item.title}
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-natural-primary shrink-0" />}
                  </h4>
                  <p className="text-xs text-natural-secondary leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
