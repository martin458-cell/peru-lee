import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, FileText, Calendar, MapPin, CheckSquare, History, CheckCircle, AlertCircle, X } from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import CategoriasTab from './components/CategoriasTab';
import EvaluadorTab from './components/EvaluadorTab';
import GenerarFichaTab from './components/GenerarFichaTab';
import CronogramaTab from './components/CronogramaTab';
import SedesTab from './components/SedesTab';
import ChecklistTab from './components/ChecklistTab';
import HistorialTab from './components/HistorialTab';

import { FichaRecord, EvaluationRecord } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('categories');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Database lists state
  const [fichas, setFichas] = useState<FichaRecord[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Loaded record state (to pass to GenerarFichaTab)
  const [selectedFichaToLoad, setSelectedFichaToLoad] = useState<FichaRecord | null>(null);

  // Administrator Unlock state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('db_unlocked') === 'true';
  });

  // Fetch from Express Server APIs with local storage synchronization fallback
  const fetchDatabase = async () => {
    setLoadingDb(true);
    try {
      // 1. Fetch server records
      let serverFichas: FichaRecord[] = [];
      let serverEvaluations: EvaluationRecord[] = [];
      
      try {
        const fResponse = await fetch('/api/fichas');
        if (fResponse.ok) {
          serverFichas = await fResponse.json();
        }
      } catch (err) {
        console.warn("Could not fetch fichas from server", err);
      }

      try {
        const eResponse = await fetch('/api/evaluations');
        if (eResponse.ok) {
          serverEvaluations = await eResponse.json();
        }
      } catch (err) {
        console.warn("Could not fetch evaluations from server", err);
      }

      // 2. Load local storage records
      const localFichasRaw = localStorage.getItem('local_fichas');
      const localFichas: FichaRecord[] = localFichasRaw ? JSON.parse(localFichasRaw) : [];

      const localEvaluationsRaw = localStorage.getItem('local_evaluations');
      const localEvaluations: EvaluationRecord[] = localEvaluationsRaw ? JSON.parse(localEvaluationsRaw) : [];

      // 3. Merge Fichas (combine both lists using unique IDs)
      const mergedFichasMap = new Map<string, FichaRecord>();
      localFichas.forEach(f => mergedFichasMap.set(f.id, f));
      serverFichas.forEach(f => mergedFichasMap.set(f.id, f));

      const mergedFichas = Array.from(mergedFichasMap.values()).sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      // 4. Merge Evaluations
      const mergedEvalsMap = new Map<string, EvaluationRecord>();
      localEvaluations.forEach(e => mergedEvalsMap.set(e.id, e));
      serverEvaluations.forEach(e => mergedEvalsMap.set(e.id, e));

      const mergedEvals = Array.from(mergedEvalsMap.values()).sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      // 5. Update local storage with the latest merged list to ensure synchronization
      localStorage.setItem('local_fichas', JSON.stringify(mergedFichas));
      localStorage.setItem('local_evaluations', JSON.stringify(mergedEvals));

      // 6. Try to upload local-only records to server so they persist there too if active
      const localOnlyFichas = mergedFichas.filter(f => !serverFichas.some(sf => sf.id === f.id));
      for (const lf of localOnlyFichas) {
        try {
          await fetch('/api/fichas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lf)
          });
        } catch (e) {
          console.error("Sync error uploading ficha:", e);
        }
      }

      const localOnlyEvals = mergedEvals.filter(e => !serverEvaluations.some(se => se.id === e.id));
      for (const le of localOnlyEvals) {
        try {
          await fetch('/api/evaluations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(le)
          });
        } catch (e) {
          console.error("Sync error uploading evaluation:", e);
        }
      }

      setFichas(mergedFichas);
      setEvaluations(mergedEvals);
    } catch (e) {
      console.error("Error reading backend/local data:", e);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  const handleShowToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleDeleteFicha = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de ficha F1?")) return;

    try {
      // Delete from local storage
      const localFichasRaw = localStorage.getItem('local_fichas');
      if (localFichasRaw) {
        const localFichas: FichaRecord[] = JSON.parse(localFichasRaw);
        const updated = localFichas.filter(f => f.id !== id);
        localStorage.setItem('local_fichas', JSON.stringify(updated));
      }

      // Delete from server
      await fetch(`/api/fichas/${id}`, { method: 'DELETE' });
      
      handleShowToast("Registro de Ficha F1 eliminado correctamente.");
      fetchDatabase();
    } catch (e) {
      console.error(e);
      handleShowToast("Eliminado del registro local.", "success");
      fetchDatabase();
    }
  };

  const handleDeleteEvaluation = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de calificación?")) return;

    try {
      // Delete from local storage
      const localEvalsRaw = localStorage.getItem('local_evaluations');
      if (localEvalsRaw) {
        const localEvals: EvaluationRecord[] = JSON.parse(localEvalsRaw);
        const updated = localEvals.filter(e => e.id !== id);
        localStorage.setItem('local_evaluations', JSON.stringify(updated));
      }

      // Delete from server
      await fetch(`/api/evaluations/${id}`, { method: 'DELETE' });
      
      handleShowToast("Registro de calificación eliminado correctamente.");
      fetchDatabase();
    } catch (e) {
      console.error(e);
      handleShowToast("Eliminado del registro local.", "success");
      fetchDatabase();
    }
  };

  const handleLoadFichaToForm = (ficha: FichaRecord) => {
    setSelectedFichaToLoad(ficha);
    setActiveTab('generator');
  };

  return (
    <div className="bg-natural-bg text-natural-text min-h-screen flex flex-col font-sans">
      
      {/* Header */}
      <Header />

      {/* Sticky Tab Navigation */}
      <nav className="bg-white border-b border-natural-border sticky top-0 z-50 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto scrollbar-none">
            
            <button 
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'categories'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Categorías EBR
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'calculator'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Evaluador & Rúbricas
            </button>

            <button 
              type="button"
              onClick={() => {
                // Clear selected ficha to load blank fields if coming clean
                setSelectedFichaToLoad(null);
                setActiveTab('generator');
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'generator'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Generar Ficha F1
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'history'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <History className="w-4 h-4 text-natural-primary" />
              Base de Datos ({fichas.length + evaluations.length})
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'timeline'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Cronograma Oficial
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('sedes')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'sedes'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Sedes Macrorregionales
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === 'checklist'
                  ? 'bg-natural-primary/10 text-natural-primary border-natural-primary/20'
                  : 'text-natural-secondary hover:bg-natural-bg hover:text-natural-primary border-transparent'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Anexos & Checklist
            </button>

          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Render Active Tab Content */}
        {activeTab === 'categories' && <CategoriasTab />}
        
        {activeTab === 'calculator' && (
          <EvaluadorTab 
            onShowToast={handleShowToast} 
            onRefreshHistory={fetchDatabase} 
          />
        )}
        
        {activeTab === 'generator' && (
          <GenerarFichaTab 
            onShowToast={handleShowToast} 
            onRefreshHistory={fetchDatabase}
            initialFichaToLoad={selectedFichaToLoad}
            isAdmin={isUnlocked}
          />
        )}

        {activeTab === 'history' && (
          <HistorialTab 
            fichas={fichas}
            evaluations={evaluations}
            onDeleteFicha={handleDeleteFicha}
            onDeleteEvaluation={handleDeleteEvaluation}
            onLoadFichaToForm={handleLoadFichaToForm}
            onRefresh={fetchDatabase}
            isUnlocked={isUnlocked}
            setIsUnlocked={setIsUnlocked}
          />
        )}

        {activeTab === 'timeline' && <CronogramaTab />}

        {activeTab === 'sedes' && <SedesTab onShowToast={handleShowToast} />}

        {activeTab === 'checklist' && <ChecklistTab />}

      </main>

      {/* Footer */}
      <Footer />

      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slideIn select-none max-w-md ${
            toastType === 'success' 
              ? 'bg-[#1a1a17] text-[#f5f5f0] border-natural-border' 
              : 'bg-[#5A2E2E] text-white border-red-900/30'
          }`}
          id="toast"
        >
          {toastType === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
          )}
          <p className="text-xs font-bold leading-relaxed pr-6" id="toast-message">
            {toastMessage}
          </p>
          <button 
            type="button"
            onClick={() => setToastMessage(null)}
            className="absolute right-3 top-3 text-[#a3a398] hover:text-[#f5f5f0] transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
