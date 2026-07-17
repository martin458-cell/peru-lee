import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2 } from 'lucide-react';
import { regionsMapping } from '../constants';

export default function SedesTab({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [selectedRegion, setSelectedRegion] = useState('');

  const mapped = selectedRegion ? regionsMapping[selectedRegion] : null;

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedRegion(val);
    if (val && regionsMapping[val]) {
      onShowToast(`Región identificada: Macro ${regionsMapping[val].macro} activada y resaltada.`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white border border-natural-border rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="border-b border-natural-border pb-5">
          <h2 className="text-2xl font-serif font-bold text-natural-text">Sedes Macrorregionales y Jurisdicciones</h2>
          <p className="text-natural-secondary text-sm mt-1">Busca o selecciona tu región del Perú para identificar inmediatamente tu Macrorregión asociada, la sede de articulación logística y el grupo de regiones participantes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-natural-text mb-2">Busca o selecciona tu Región</label>
            <div className="relative">
              <select 
                id="regions-selector" 
                value={selectedRegion}
                onChange={handleRegionChange}
                className="w-full bg-[#f9f9f7] border border-natural-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-natural-primary appearance-none font-medium text-natural-text"
              >
                <option value="">Seleccione Región...</option>
                {Object.keys(regionsMapping).sort().map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-natural-secondary">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center">
            {mapped ? (
              <div className="p-4 bg-natural-primary/5 border border-natural-primary/20 rounded-xl text-xs font-semibold text-natural-text w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                <div>
                  <span className="font-bold text-natural-primary block sm:inline">Resultado de Búsqueda:</span>{' '}
                  La región <span className="underline text-natural-primary font-bold">{selectedRegion}</span> pertenece a la <strong className="text-natural-primary font-extrabold">MACRO N.° {mapped.macro}</strong>.
                  <p className="text-[11px] text-natural-secondary mt-1 font-medium">Sede Logística Designada: <strong className="text-natural-text">{mapped.sede}</strong>. Regiones del grupo: <span className="text-natural-secondary">{mapped.peers}</span>.</p>
                </div>
                <span className="px-2.5 py-1 bg-natural-primary text-white rounded text-[10px] font-bold shrink-0 self-center flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MACRO {mapped.macro} ACTIVADA
                </span>
              </div>
            ) : (
              <div className="p-4 bg-[#f9f9f7] border border-natural-border rounded-xl text-xs font-semibold text-natural-secondary w-full text-center md:text-left flex items-center gap-2 justify-center sm:justify-start">
                <Search className="w-4 h-4 text-natural-secondary animate-pulse" />
                <span>Selecciona una región para calcular la jurisdicción.</span>
              </div>
            )}
          </div>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 border-t border-natural-border pt-8" id="macros-grid">
          {[
            { macro: 1, sede: "Ucayali", peers: ["Ucayali (Sede)", "Amazonas", "Loreto", "San Martín"] },
            { macro: 2, sede: "Huánuco", peers: ["Huánuco (Sede)", "Junín", "Pasco", "Huancavelica"] },
            { macro: 3, sede: "Arequipa", peers: ["Arequipa (Sede)", "Puno", "Tacna", "Moquegua"] },
            { macro: 4, sede: "La Libertad", peers: ["La Libertad (Sede)", "Cajamarca", "Lambayeque", "Piura", "Tumbes"] },
            { macro: 5, sede: "Lima Metropolitana", peers: ["Lima Metropolitana (Sede)", "Áncash", "Callao", "Ica", "Lima Provincias"] },
            { macro: 6, sede: "Apurímac", peers: ["Apurímac (Sede)", "Cusco", "Ayacucho", "Madre de Dios"] }
          ].map(m => {
            const isActive = mapped?.macro === m.macro;
            return (
              <div 
                key={m.macro} 
                className={`transition-all duration-300 rounded-2xl p-6 space-y-4 border ${
                  isActive 
                    ? 'bg-natural-primary/5 border-2 border-natural-primary shadow-md transform -translate-y-1' 
                    : 'bg-[#f9f9f7] border-natural-border'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                    isActive 
                      ? 'bg-natural-primary text-white border-natural-primary/20' 
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    MACRO N.° {m.macro}
                  </span>
                  <span className="text-xs font-medium text-natural-secondary">Sede: {m.sede}</span>
                </div>
                <h4 className="font-bold text-natural-text text-sm">Regiones Integrantes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {m.peers.map(peer => {
                    const isSede = peer.includes('(Sede)');
                    const isTarget = peer.replace(' (Sede)', '') === selectedRegion;
                    return (
                      <span 
                        key={peer} 
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          isTarget
                            ? 'bg-natural-primary text-white border border-natural-primary font-bold shadow-sm'
                            : isSede
                              ? 'bg-[#5A5A40] text-white font-semibold'
                              : 'bg-white border border-natural-border text-natural-secondary'
                        }`}
                      >
                        {peer}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
