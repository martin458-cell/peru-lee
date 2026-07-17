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

  // Fetch from Express Server APIs
  const fetchDatabase = async () => {
    setLoadingDb(true);
    try {
      const fResponse = await fetch('/api/fichas');
      const eResponse = await fetch('/api/evaluations');
      if (fResponse.ok && eResponse.ok) {
        const fData = await fResponse.json();
        const eData = await eResponse.json();
        setFichas(fData);
        setEvaluations(eData);
      }
    } catch (e) {
      console.error("Error reading backend data:", e);
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
      const response = await fetch(`/api/fichas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        handleShowToast("Registro de Ficha F1 eliminado correctamente.");
        fetchDatabase();
      } else {
        handleShowToast("Error al eliminar del servidor.", "error");
      }
    } catch (e) {
      console.error(e);
      handleShowToast("Falla de conexión al servidor.", "error");
    }
  };

  const handleDeleteEvaluation = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de calificación?")) return;

    try {
      const response = await fetch(`/api/evaluations/${id}`, { method: 'DELETE' });
      if (response.ok) {
        handleShowToast("Registro de calificación eliminado correctamente.");
        fetchDatabase();
      } else {
        handleShowToast("Error al eliminar del servidor.", "error");
      }
    } catch (e) {
      console.error(e);
      handleShowToast("Falla de conexión al servidor.", "error");
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
