import React, { useState } from 'react';
import { Search, Trash2, Calendar, FileText, Award, Eye, ExternalLink, RefreshCw, Layers, Lock, Unlock, FileSpreadsheet } from 'lucide-react';
import { FichaRecord, EvaluationRecord } from '../types';

interface HistorialProps {
  fichas: FichaRecord[];
  evaluations: EvaluationRecord[];
  onDeleteFicha: (id: string) => void;
  onDeleteEvaluation: (id: string) => void;
  onLoadFichaToForm: (ficha: FichaRecord) => void;
  onRefresh: () => void;
  isUnlocked: boolean;
  setIsUnlocked: (val: boolean) => void;
}

export default function HistorialTab({ 
  fichas, 
  evaluations, 
  onDeleteFicha, 
  onDeleteEvaluation, 
  onLoadFichaToForm,
  onRefresh,
  isUnlocked,
  setIsUnlocked
}: HistorialProps) {
  const [activeSubTab, setActiveSubTab] = useState<'fichas' | 'evals'>('fichas');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Password Protection State
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim().toLowerCase();
    if (cleanPassword === '24009' || cleanPassword === 'tupac24009' || cleanPassword === 'admin') {
      setIsUnlocked(true);
      sessionStorage.setItem('db_unlocked', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Contraseña incorrecta. Inténtelo de nuevo.');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('db_unlocked');
    setPassword('');
  };

  // Filtering lists
  const filteredFichas = fichas.filter(f => {
    const matchesSearch = 
      f.workTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.ieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.students.some(s => s.fullname.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter ? f.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const filteredEvals = evaluations.filter(e => {
    const matchesSearch = 
      e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.level.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? e.category.startsWith(categoryFilter) : true;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getLevelBadgeClass = (lvl: string) => {
    switch (lvl) {
      case 'LOGRO DESTACADO':
        return 'bg-amber-50 text-[#cf9e2e] border-amber-200';
      case 'LOGRO ESPERADO':
        return 'bg-blue-50 text-[#0b1b3d] border-blue-200';
      case 'EN PROCESO':
        return 'bg-red-50 text-[#c00000] border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const exportFichasToExcel = () => {
    const headers = [
      "ID", "Categoria", "Fecha de Creacion", "Institucion Educativa", "Codigo Modular", "DRE", "UGEL", "Gestion", "Region", "Provincia", "Distrito", "Direccion I.E.", 
      "Titulo del Trabajo", "Lengua / Variante", "Enlace de Video", 
      "Docente Asesor", "Docente DNI", "Docente Especialidad", "Docente Celular", "Docente Correo",
      "Estudiante 1 Nombre", "Estudiante 1 DNI", "Estudiante 1 Edad", "Estudiante 1 Grado", "Estudiante 1 Seccion", "Estudiante 1 Apoderado", "Estudiante 1 Apoderado DNI",
      "Estudiante 2 Nombre", "Estudiante 2 DNI", "Estudiante 2 Edad", "Estudiante 2 Grado", "Estudiante 2 Seccion", "Estudiante 2 Apoderado", "Estudiante 2 Apoderado DNI",
      "Estudiante 3 Nombre", "Estudiante 3 DNI", "Estudiante 3 Edad", "Estudiante 3 Grado", "Estudiante 3 Seccion", "Estudiante 3 Apoderado", "Estudiante 3 Apoderado DNI"
    ];

    const rows = filteredFichas.map(f => {
      const studentData = [];
      for (let i = 0; i < 3; i++) {
        const std = (f.students?.[i] || {}) as any;
        studentData.push(
          std.fullname || "",
          std.dni || "",
          std.age || "",
          std.grade || "",
          std.section || "",
          std.parentName || "",
          std.parentDni || ""
        );
      }

      return [
        f.id,
        `Categoria ${f.category}`,
        formatDate(f.createdAt),
        f.ieName,
        f.ieModular,
        f.ieDre,
        f.ieUgel,
        f.ieGestion,
        f.ieRegion,
        f.ieProvincia,
        f.ieDistrito,
        f.ieDireccion,
        f.workTitle,
        f.workLang,
        f.workLink,
        f.docName,
        f.docDni,
        f.docSpec,
        f.docCell,
        f.docEmail,
        ...studentData
      ];
    });

    const escapeCSVField = (val: any) => {
      if (val === undefined || val === null) return "";
      const stringified = String(val).replace(/"/g, '""');
      if (stringified.includes(";") || stringified.includes("\n") || stringified.includes('"')) {
        return `"${stringified}"`;
      }
      return stringified;
    };

    const csvContent = [
      headers.map(escapeCSVField).join(";"),
      ...rows.map(row => row.map(escapeCSVField).join(";"))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Fichas_F1_Registradas_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportEvaluationsToExcel = () => {
    const headers = [
      "ID", "Estudiante o Equipo", "Categoria", "Puntaje Rustico Producto", "Puntaje Maximo Producto", "Puntajes Detallados Producto", "Puntajes Detallados Desafio", "Puntaje Final (%)", "Nivel de Logro", "Fecha de Creacion"
    ];

    const rows = filteredEvals.map(e => {
      const scoresStr = Array.isArray(e.scores) ? e.scores.join(", ") : "";
      const desafioScoresStr = Array.isArray(e.desafioScores) ? e.desafioScores.join(", ") : "";
      return [
        e.id,
        e.studentName,
        e.category,
        e.totalProductRaw,
        e.maxProductRaw,
        scoresStr,
        desafioScoresStr,
        e.finalScorePercent ? `${e.finalScorePercent}%` : "",
        e.level,
        formatDate(e.createdAt)
      ];
    });

    const escapeCSVField = (val: any) => {
      if (val === undefined || val === null) return "";
      const stringified = String(val).replace(/"/g, '""');
      if (stringified.includes(";") || stringified.includes("\n") || stringified.includes('"')) {
        return `"${stringified}"`;
      }
      return stringified;
    };

    const csvContent = [
      headers.map(escapeCSVField).join(";"),
      ...rows.map(row => row.map(escapeCSVField).join(";"))
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Evaluaciones_Registradas_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-natural-border rounded-3xl shadow-xl space-y-6 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-natural-primary/10 rounded-2xl flex items-center justify-center mx-auto text-natural-primary animate-pulse">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-natural-text">Acceso Protegido</h2>
          <p className="text-xs text-natural-secondary leading-relaxed">
            La base de datos contiene registros y calificaciones oficiales de la I.E.P.M. N° 24009 "Túpac Amaru II". Ingrese la contraseña para acceder y gestionar los datos.
          </p>
        </div>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Ingrese la contraseña"
              className="w-full text-center tracking-widest border border-natural-border rounded-xl p-3 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-bold text-natural-text text-sm"
              autoFocus
            />
            {errorMsg && (
              <p className="text-[10px] text-red-600 font-bold mt-1.5">{errorMsg}</p>
            )}
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Desbloquear Base de Datos</span>
          </button>
        </form>

        <div className="pt-4 border-t border-natural-border/60 text-[10px] text-natural-secondary font-medium">
          💡 <span className="font-bold">Sugerencia:</span> La contraseña es el número de la institución educativa (ej: <span className="font-bold bg-[#f3f3ee] px-1.5 py-0.5 rounded select-all font-mono">24009</span>).
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-natural-border rounded-3xl shadow-sm p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setActiveSubTab('fichas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeSubTab === 'fichas'
                ? 'bg-natural-primary text-white border-natural-primary shadow-sm'
                : 'bg-[#f9f9f7] text-natural-text border-natural-border hover:bg-[#f3f3ee]'
            }`}
          >
            Fichas F1 Registradas ({fichas.length})
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab('evals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeSubTab === 'evals'
                ? 'bg-natural-primary text-white border-natural-primary shadow-sm'
                : 'bg-[#f9f9f7] text-natural-text border-natural-border hover:bg-[#f3f3ee]'
            }`}
          >
            Evaluaciones Guardadas ({evaluations.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-grow justify-end">
          {/* Search box */}
          <div className="relative flex-grow max-w-md">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeSubTab === 'fichas' ? "Buscar por obra, docente, alumno..." : "Buscar por estudiante o rendimiento..."}
              className="w-full bg-[#f9f9f7] border border-natural-border rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary text-natural-text"
            />
            <div className="absolute left-3 top-3 text-natural-secondary">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Category Filter */}
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#f9f9f7] border border-natural-border rounded-xl px-3 py-2 text-xs font-bold text-natural-text focus:outline-none focus:ring-1 focus:ring-natural-primary"
          >
            <option value="">Todas las Categorías</option>
            <option value="A">Categoría A</option>
            <option value="B">Categoría B</option>
            <option value="C">Categoría C</option>
            <option value="D">Categoría D</option>
            <option value="E">Categoría E</option>
          </select>

          {/* Refresh Button */}
          <button 
            type="button"
            onClick={onRefresh}
            className="p-2 bg-[#f9f9f7] hover:bg-[#f3f3ee] border border-natural-border text-natural-text rounded-xl transition-all shrink-0"
            title="Sincronizar base de datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Export to Excel Button */}
          <button 
            type="button"
            onClick={activeSubTab === 'fichas' ? exportFichasToExcel : exportEvaluationsToExcel}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shrink-0"
            title="Exportar registros a Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>

          {/* Lock Button */}
          <button 
            type="button"
            onClick={handleLock}
            className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-all shrink-0"
            title="Bloquear base de datos"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Database Lists */}
      {activeSubTab === 'fichas' ? (
        <div className="space-y-4">
          {filteredFichas.length === 0 ? (
            <div className="bg-white border border-natural-border rounded-3xl p-12 text-center text-natural-secondary">
              <FileText className="w-12 h-12 text-natural-border mx-auto mb-3" />
              <p className="font-bold">No hay fichas F1 registradas</p>
              <p className="text-xs text-natural-secondary/80 mt-1 font-light">Completa y guarda una ficha desde el panel de "Generar Ficha F1" para verla listada aquí.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFichas.map(ficha => (
                <div key={ficha.id} className="bg-white border border-natural-border rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 border-b border-natural-border pb-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-natural-primary text-white uppercase tracking-wider">
                          Categoría {ficha.category}
                        </span>
                        <p className="text-[10px] text-natural-secondary font-bold mt-1 uppercase flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(ficha.createdAt)}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => onDeleteFicha(ficha.id)}
                        className="p-1.5 text-natural-secondary hover:text-natural-primary hover:bg-natural-primary/5 rounded-lg transition-all"
                        title="Eliminar de base de datos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif font-bold text-natural-text text-sm leading-snug line-clamp-2">
                        {ficha.workTitle || "Sin título de trabajo registrado"}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div>
                          <span className="text-[10px] text-natural-secondary font-bold block uppercase">Institución:</span>
                          <span className="font-medium text-natural-text line-clamp-1">{ficha.ieName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-natural-secondary font-bold block uppercase">Asesor:</span>
                          <span className="font-medium text-natural-text line-clamp-1">{ficha.docName}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-natural-secondary font-bold block uppercase mb-1">Integrantes ({ficha.students.length}):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {ficha.students.map((st, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 bg-[#f9f9f7] border border-natural-border rounded text-[10px] font-medium text-natural-text">
                              {st.fullname ? st.fullname.split(',')[0] : `Alumno ${sIdx + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-natural-border">
                    <button 
                      type="button"
                      onClick={() => onLoadFichaToForm(ficha)}
                      className="w-full py-2 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Cargar en Vista Previa y Word</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvals.length === 0 ? (
            <div className="bg-white border border-natural-border rounded-3xl p-12 text-center text-natural-secondary">
              <Award className="w-12 h-12 text-natural-border mx-auto mb-3" />
              <p className="font-bold">No hay evaluaciones registradas</p>
              <p className="text-xs text-natural-secondary/80 mt-1 font-light">Completa y guarda una calificación desde el "Evaluador & Rúbricas" para verla listada aquí.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border border-natural-border rounded-3xl shadow-sm">
              <table className="w-full text-xs text-natural-text border-collapse">
                <thead>
                  <tr className="bg-[#f9f9f7] text-natural-secondary font-bold uppercase border-b border-natural-border text-[10px]">
                    <th className="p-4 text-left">Estudiante / Equipo</th>
                    <th className="p-4 text-left">Categoría</th>
                    <th className="p-4 text-center">Puntaje Total</th>
                    <th className="p-4 text-center">Ponderado</th>
                    <th className="p-4 text-center">Rendimiento</th>
                    <th className="p-4 text-left">Fecha Registro</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-border font-medium">
                  {filteredEvals.map(ev => (
                    <tr key={ev.id} className="hover:bg-[#f9f9f7]/60">
                      <td className="p-4 font-serif font-bold text-natural-text text-sm">{ev.studentName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-natural-primary/10 text-natural-primary border border-natural-primary/20 rounded font-bold text-[10px]">
                          {ev.category}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono">
                        {ev.totalProductRaw} / {ev.maxProductRaw} pts
                      </td>
                      <td className="p-4 text-center font-bold text-natural-primary font-mono text-sm">
                        {ev.finalScorePercent.toFixed(2)}%
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] border ${getLevelBadgeClass(ev.level)}`}>
                          {ev.level}
                        </span>
                      </td>
                      <td className="p-4 text-natural-secondary text-[10px]">{formatDate(ev.createdAt)}</td>
                      <td className="p-4 text-center">
                        <button 
                          type="button"
                          onClick={() => onDeleteEvaluation(ev.id)}
                          className="p-1.5 text-natural-secondary hover:text-natural-primary hover:bg-natural-primary/5 rounded-lg transition-all"
                          title="Eliminar de base de datos"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
