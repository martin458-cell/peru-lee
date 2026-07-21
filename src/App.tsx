import React, { useState, useEffect } from 'react';
import { BookOpen, Calculator, FileText, Calendar, MapPin, CheckSquare, History, CheckCircle, AlertCircle, X, Cloud, Database, FileSpreadsheet, LogOut, RefreshCw } from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import CategoriasTab from './components/CategoriasTab';
import EvaluadorTab from './components/EvaluadorTab';
import GenerarFichaTab from './components/GenerarFichaTab';
import CronogramaTab from './components/CronogramaTab';
import SedesTab from './components/SedesTab';
import ChecklistTab from './components/ChecklistTab';
import HistorialTab from './components/HistorialTab';
import GuiaDocenteTab from './components/GuiaDocenteTab';
import BibliotecaTab from './components/BibliotecaTab';

import { FichaRecord, EvaluationRecord } from './types';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, setCachedAccessToken } from './lib/googleAuth';
import { getOrCreateFichasSheet, syncFichasToGoogleSheet, deleteFichaFromGoogleSheet } from './lib/googleDriveSheets';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('guide');
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

  // Google Workspace Integration States
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleSpreadsheetId, setGoogleSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('google_spreadsheet_id');
  });
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('google_token');
    if (storedToken) {
      setCachedAccessToken(storedToken);
      setGoogleToken(storedToken);
    }

    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        sessionStorage.setItem('google_token', token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        sessionStorage.removeItem('google_token');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        sessionStorage.setItem('google_token', result.accessToken);
        handleShowToast("¡Conectado a Google exitosamente!", "success");
        
        // Find or create spreadsheet
        const sheetId = await getOrCreateFichasSheet(result.accessToken);
        setGoogleSpreadsheetId(sheetId);
        localStorage.setItem('google_spreadsheet_id', sheetId);
        handleShowToast("Sincronizado con Google Sheets.", "success");
      }
    } catch (err: any) {
      console.error("Error connecting to Google:", err);
      handleShowToast("Error de conexión Google: " + err.message, "error");
    }
  };

  const handleGoogleLogout = async () => {
    if (!window.confirm("¿Deseas desconectar tu cuenta de Google?")) return;
    try {
      await logout();
      setGoogleUser(null);
      setGoogleToken(null);
      sessionStorage.removeItem('google_token');
      handleShowToast("Cuenta de Google desconectada.", "success");
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSyncToSheets = async () => {
    if (!googleToken) {
      handleShowToast("Por favor, conecta primero tu cuenta de Google.", "error");
      return;
    }
    
    setIsSyncingSheets(true);
    try {
      let sheetId = googleSpreadsheetId;
      if (!sheetId) {
        sheetId = await getOrCreateFichasSheet(googleToken);
        setGoogleSpreadsheetId(sheetId);
        localStorage.setItem('google_spreadsheet_id', sheetId);
      }

      await syncFichasToGoogleSheet(googleToken, sheetId, fichas);
      handleShowToast("¡Sincronización completa con Google Sheets!", "success");
    } catch (err: any) {
      console.error(err);
      handleShowToast("Error de sincronización Sheets: " + err.message, "error");
    } finally {
      setIsSyncingSheets(false);
    }
  };

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

      // 3. Merge Fichas (combine both lists prioritizing local client edits over server)
      const mergedFichasMap = new Map<string, FichaRecord>();
      serverFichas.forEach(f => mergedFichasMap.set(f.id, f));
      localFichas.forEach(f => mergedFichasMap.set(f.id, f));

      const mergedFichas = Array.from(mergedFichasMap.values()).sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      // 4. Merge Evaluations
      const mergedEvalsMap = new Map<string, EvaluationRecord>();
      serverEvaluations.forEach(e => mergedEvalsMap.set(e.id, e));
      localEvaluations.forEach(e => mergedEvalsMap.set(e.id, e));

      const mergedEvals = Array.from(mergedEvalsMap.values()).sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      // 5. Update local storage with the latest merged list to ensure synchronization
      localStorage.setItem('local_fichas', JSON.stringify(mergedFichas));
      localStorage.setItem('local_evaluations', JSON.stringify(mergedEvals));

      // 6. Try to upload local-only or modified records to server so they persist there too if active
      const fichasToSync = mergedFichas.filter(f => {
        const sf = serverFichas.find(s => s.id === f.id);
        if (!sf) return true; // Local-only
        // Sync if local is different from server version
        return JSON.stringify(f) !== JSON.stringify(sf);
      });
      for (const lf of fichasToSync) {
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

      const evalsToSync = mergedEvals.filter(e => {
        const se = serverEvaluations.find(s => s.id === e.id);
        if (!se) return true; // Local-only
        // Sync if local is different from server version
        return JSON.stringify(e) !== JSON.stringify(se);
      });
      for (const le of evalsToSync) {
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
      
      // Delete from Google Sheets if connected
      if (googleToken && googleSpreadsheetId) {
        try {
          await deleteFichaFromGoogleSheet(googleToken, googleSpreadsheetId, id);
        } catch (err) {
          console.warn("Could not sync deletion to Google Sheets:", err);
        }
      }
      
      handleShowToast("Registro de Ficha F1 de baja.");
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
      <nav className="bg-white border-b border-natural-border sticky top-0 z-50 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row md:flex-wrap items-center justify-start md:justify-center gap-1.5 md:gap-2 py-3 overflow-x-auto md:overflow-x-visible scrollbar-none">
            
            <button 
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
                activeTab === 'guide'
                  ? 'bg-red-600/10 text-red-600 border-red-200/40'
                  : 'text-natural-secondary hover:bg-red-50 hover:text-red-700 border-transparent'
              }`}
            >
              <FileText className="w-4 h-4 text-red-600" />
              Guía Pedagógica PDF
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
                activeTab === 'library'
                  ? 'bg-red-600/10 text-red-600 border-red-200/40'
                  : 'text-natural-secondary hover:bg-red-50 hover:text-red-700 border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-red-600" />
              Biblioteca Digital
            </button>

            <button 
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
              className={`px-3 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 md:gap-2 border ${
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
        
        {/* Google Workspace Connection Status Banner */}
        <div className="mb-6 bg-white border border-natural-border/60 rounded-3xl p-5 shadow-sm no-print flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${googleUser ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-natural-text flex items-center gap-2">
                Conexión con Google Workspace
                {googleUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Activo
                  </span>
                )}
              </h2>
              <p className="text-xs text-natural-secondary mt-1 max-w-2xl leading-relaxed">
                {googleUser 
                  ? `Vinculado a Google Sheets y Google Drive con la cuenta: ${googleUser.email}. Todos tus registros se sincronizarán.`
                  : "Vincula tu cuenta de Google para almacenar de manera automática las fichas de inscripción (Anexo 1) en Google Sheets y guardar los documentos generados en tu cuenta de Google Drive."}
              </p>
              {googleSpreadsheetId && googleUser && (
                <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-natural-secondary">
                  <Database className="w-3.5 h-3.5 text-natural-primary" />
                  <span>ID de Hoja: <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">{googleSpreadsheetId.slice(0, 10)}...{googleSpreadsheetId.slice(-6)}</span></span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
            {googleUser ? (
              <>
                <button
                  type="button"
                  onClick={handleSyncToSheets}
                  disabled={isSyncingSheets}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-emerald-500 hover:shadow shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                  {isSyncingSheets ? "Sincronizando..." : "Sincronizar Sheets"}
                </button>
                {googleSpreadsheetId && (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${googleSpreadsheetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 hover:shadow shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Abrir Sheet ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 hover:shadow shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Desconectar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2.5 hover:shadow-md shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>Conectar con Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Render Active Tab Content */}
        {activeTab === 'guide' && <GuiaDocenteTab />}
        
        {activeTab === 'library' && <BibliotecaTab />}
        
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
            googleToken={googleToken}
            googleSpreadsheetId={googleSpreadsheetId}
            googleUser={googleUser}
            onGoogleLogin={handleGoogleLogin}
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
