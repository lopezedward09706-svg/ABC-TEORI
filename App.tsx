
import React, { useState, useEffect, useCallback } from 'react';
import { IA_DEFS, COLORS, EMERGENT_PARTICLES, ABC_NODES_DEF } from './constants';
import { LogEntry, IAConfig, ParticleDef } from './types';
import { getAIAnalysis } from './services/geminiService';
import NetworkCanvas from './components/NetworkCanvas';
import ValidationChart from './components/ValidationChart';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ias, setIas] = useState<IAConfig[]>(IA_DEFS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'network'>('network');
  const [activeConcept, setActiveConcept] = useState<string>('abc-nodes');
  const [globalScore, setGlobalScore] = useState(0);
  const [selectedParticle, setSelectedParticle] = useState<ParticleDef | null>(null);

  // Simulation Parameters
  const [nodeSpeed, setNodeSpeed] = useState(1.5);
  const [nodeDensity, setNodeDensity] = useState(40);
  const [interactionDistance, setInteractionDistance] = useState(120);
  const [interactionForce, setInteractionForce] = useState(0.5);
  const [showConnections, setShowConnections] = useState(true);
  const [isForceEnabled, setIsForceEnabled] = useState(true);

  // 3D Specific Parameters
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(45);
  const [zoom, setZoom] = useState(1);

  // Local states for inputs
  const [speedInput, setSpeedInput] = useState('1.5');
  const [densityInput, setDensityInput] = useState('40');
  const [distanceInput, setDistanceInput] = useState('120');
  const [forceInput, setForceInput] = useState('0.5');

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info', icon?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      icon
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    addLog('Sistema de Validación ABC inicializado', 'success', '✅');
    addLog('7 IAs especializadas cargadas y listas', 'info', 'ℹ️');
  }, [addLog]);

  const runIA = async (id: number) => {
    const ia = ias.find(i => i.id === id);
    if (!ia) return;

    addLog(`Ejecutando ${ia.name}...`, ia.id === 1 ? 'ia1' : ia.id === 2 ? 'ia2' : 'info', '🤖');
    setIas(prev => prev.map(item => item.id === id ? { ...item, status: 'Analizando...' } : item));

    const analysis = await getAIAnalysis(ia.name, ia.description);
    addLog(`${ia.name}: ${analysis}`, `ia${ia.id}` as any);
    
    const newConfidence = Math.min(100, ia.confidence + (Math.random() * 5));
    setIas(prev => prev.map(item => item.id === id ? { ...item, status: 'Validado', confidence: newConfidence } : item));
    setGlobalScore(prev => Math.min(100, prev + 5));
  };

  const runAllValidations = async () => {
    addLog('Iniciando validación masiva del sistema...', 'warning', '🚀');
    for (const ia of ias) {
      await runIA(ia.id);
      await new Promise(r => setTimeout(r, 800));
    }
    addLog('Validación global completada satisfactoriamente.', 'success', '🏆');
  };

  const resetParams = () => {
    setNodeSpeed(1.5);
    setSpeedInput('1.5');
    setNodeDensity(40);
    setDensityInput('40');
    setInteractionDistance(120);
    setDistanceInput('120');
    setInteractionForce(0.5);
    setForceInput('0.5');
    setIsForceEnabled(true);
    setRotX(25);
    setRotY(45);
    setZoom(1);
    addLog('Parámetros de simulación reseteados a valores de fábrica', 'info', '🔄');
  };

  const handleParamChange = (
    val: string, 
    setter: (n: number) => void, 
    inputSetter: (s: string) => void,
    min: number,
    max: number,
    isFloat: boolean = false
  ) => {
    inputSetter(val);
    const num = isFloat ? parseFloat(val) : parseInt(val);
    if (!isNaN(num) && num >= min && num <= max) {
      setter(num);
    }
  };

  const handleParamBlur = (
    val: string,
    setter: (n: number) => void,
    inputSetter: (s: string) => void,
    min: number,
    max: number,
    label: string,
    icon: string
  ) => {
    const num = Math.max(min, Math.min(max, parseFloat(val) || min));
    setter(num);
    inputSetter(num.toString());
    addLog(`${label} ajustado a ${num}.`, 'info', icon);
  };

  const openParticleAnalysis = (particle: ParticleDef) => {
    addLog(`Fijando escáner cuántico en: ${particle.name}.`, 'ia7', '🔬');
    setSelectedParticle(particle);
    setGlobalScore(prev => Math.min(100, prev + 0.5));
  };

  const getStability = (charge: number) => {
    const abs = Math.abs(charge);
    if (abs < 0.1) return { label: 'Estabilidad Extrema', color: 'text-cyan-400', icon: 'shield-alt' };
    if (abs <= 1.1) return { label: 'Coherencia Alta', color: 'text-emerald-400', icon: 'check-circle' };
    return { label: 'Estado Fluctuante', color: 'text-amber-400', icon: 'exclamation-triangle' };
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden p-4 gap-4 bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="flex justify-between items-center bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl shadow-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <i className="fas fa-atom text-white text-xl animate-pulse"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">TEORÍA ABC</h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">Validation Multi-IA System v2.5</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-500">Global Consensus</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${globalScore}%` }}></div>
                </div>
                <span className="text-cyan-400 font-mono text-sm font-bold">{globalScore.toFixed(1)}%</span>
              </div>
           </div>
           <button 
             onClick={runAllValidations}
             className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-red-900/20 active:scale-95 flex items-center gap-2"
           >
             <i className="fas fa-bolt"></i> FULL VALIDATION
           </button>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
        
        {/* LEFT COLUMN: 7 IAs */}
        <section className="col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scroll">
          <div className="flex items-center gap-2 mb-2 px-1">
             <i className="fas fa-robot text-cyan-400"></i>
             <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Expert AI Fleet</h2>
          </div>
          {ias.map(ia => (
            <div key={ia.id} className="bg-slate-900 border border-slate-700/50 p-3 rounded-xl hover:border-slate-500 transition-all group">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ia.color}22`, border: `1px solid ${ia.color}` }}>
                       <i className={`fas fa-${ia.icon}`} style={{ color: ia.color }}></i>
                    </div>
                    <div>
                       <h3 className="text-xs font-bold" style={{ color: ia.color }}>{ia.name}</h3>
                       <p className="text-[9px] text-slate-500">{ia.function}</p>
                    </div>
                 </div>
                 <button onClick={() => runIA(ia.id)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 hover:bg-slate-700 p-1 rounded text-[10px]">
                   <i className="fas fa-play"></i>
                 </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">{ia.description}</p>
              <div className="flex justify-between items-end">
                 <div className="flex-1 mr-4">
                    <div className="flex justify-between text-[8px] mb-1">
                       <span className="text-slate-500">Confidence</span>
                       <span style={{ color: ia.color }}>{ia.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full transition-all duration-700" style={{ width: `${ia.confidence}%`, backgroundColor: ia.color }}></div>
                    </div>
                 </div>
                 <span className="text-[9px] font-mono text-slate-500">{ia.status}</span>
              </div>
            </div>
          ))}
        </section>

        {/* CENTER COLUMN: VIZ & DATA */}
        <section className="col-span-6 flex flex-col gap-4 overflow-hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl flex-1 flex flex-col overflow-hidden p-1 shadow-2xl">
             <div className="p-3 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-3">
                   <span className="flex items-center gap-2 bg-slate-800/50 px-2 py-1 rounded text-[10px] text-slate-400">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     LIVE SIMULATION
                   </span>
                   <select 
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="bg-slate-800 text-[10px] border-none outline-none rounded px-2 py-1 cursor-pointer font-bold text-cyan-400"
                   >
                     <option value="network">Network Grid (2D)</option>
                     <option value="2d">Lattice (2D-Flat)</option>
                     <option value="3d">Quantum Space (3D)</option>
                   </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={resetParams} className="px-3 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all" title="Reset Params">
                    <i className="fas fa-sync-alt"></i>
                  </button>
                  <button onClick={() => setShowConnections(!showConnections)} className={`px-3 py-1 rounded text-[10px] font-bold transition-all border ${showConnections ? 'bg-cyan-900/40 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    <i className={`fas ${showConnections ? 'fa-link' : 'fa-unlink'} mr-1`}></i>
                    Show Connections
                  </button>
                  <button onClick={() => setIsSimulating(!isSimulating)} className={`px-4 py-1 rounded text-xs font-bold transition-all ${isSimulating ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                    {isSimulating ? <><i className="fas fa-pause mr-1"></i> PAUSE</> : <><i className="fas fa-play mr-1"></i> START</>}
                  </button>
                </div>
             </div>
             
             <div className="flex-1 relative overflow-hidden">
                <NetworkCanvas 
                  isSimulating={isSimulating} 
                  viewMode={viewMode} 
                  speed={nodeSpeed}
                  density={nodeDensity}
                  interactionDistance={interactionDistance}
                  interactionForce={interactionForce}
                  showConnections={showConnections}
                  isForceEnabled={isForceEnabled}
                  rotationX={rotX}
                  rotationY={rotY}
                  zoom={zoom}
                />

                {/* SIMULATION PARAMETERS OVERLAY */}
                <div className={`absolute bottom-4 left-4 right-4 bg-slate-950/95 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl grid grid-cols-2 ${viewMode === '3d' ? 'md:grid-cols-6' : 'md:grid-cols-5'} gap-4 items-center`}>
                   
                   <div className="flex flex-col gap-1 items-center justify-center bg-slate-900/60 p-2 rounded-lg border border-emerald-500/30">
                      <label className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter mb-1">Force Interaction</label>
                      <button 
                        onClick={() => setIsForceEnabled(!isForceEnabled)}
                        className={`w-full py-1.5 rounded text-[10px] font-bold transition-all border flex items-center justify-center gap-2 ${isForceEnabled ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                      >
                        <i className={`fas ${isForceEnabled ? 'fa-magnet' : 'fa-slash'}`}></i>
                        {isForceEnabled ? 'ACTIVE' : 'OFF'}
                      </button>
                   </div>

                   <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-amber-500/30">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold text-amber-400 uppercase tracking-tighter">Radius (20-300)</label>
                        <input 
                          type="text" 
                          value={distanceInput} 
                          onChange={(e) => handleParamChange(e.target.value, setInteractionDistance, setDistanceInput, 20, 300)} 
                          onBlur={() => handleParamBlur(distanceInput, setInteractionDistance, setDistanceInput, 20, 300, 'Radius', '📏')}
                          className="bg-slate-800/50 border-none text-[10px] font-mono text-amber-300 w-10 text-center rounded focus:ring-1 focus:ring-amber-500 outline-none h-4 px-1"
                        />
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="300" 
                        step="1" 
                        value={interactionDistance} 
                        onChange={(e) => { 
                          const v = parseInt(e.target.value); 
                          setInteractionDistance(v); 
                          setDistanceInput(v.toString()); 
                        }} 
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                   </div>

                   <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-purple-500/30">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold text-purple-400 uppercase tracking-tighter">Density</label>
                        <input 
                          type="text" 
                          value={densityInput} 
                          onChange={(e) => handleParamChange(e.target.value, setNodeDensity, setDensityInput, 5, 250)} 
                          onBlur={() => handleParamBlur(densityInput, setNodeDensity, setDensityInput, 5, 250, 'Density', '🕸️')}
                          className="bg-slate-800/50 border-none text-[10px] font-mono text-purple-300 w-10 text-center rounded focus:ring-1 focus:ring-purple-500 outline-none h-4 px-1"
                        />
                      </div>
                      <input type="range" min="5" max="250" step="1" value={nodeDensity} onChange={(e) => { const v = parseInt(e.target.value); setNodeDensity(v); setDensityInput(v.toString()); }} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                   </div>

                   {viewMode === '3d' ? (
                     <>
                        <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-blue-500/30">
                          <label className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Yaw (H)</label>
                          <input type="range" min="-180" max="180" value={rotY} onChange={(e) => setRotY(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                        </div>
                        <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-indigo-500/30">
                          <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">Pitch (V)</label>
                          <input type="range" min="-90" max="90" value={rotX} onChange={(e) => setRotX(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                        </div>
                        <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-pink-500/30">
                            <label className="text-[9px] font-bold text-pink-400 uppercase tracking-tighter">Zoom</label>
                            <input type="range" min="0.2" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"/>
                        </div>
                     </>
                   ) : (
                     <>
                        <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-cyan-500/30">
                            <label className="text-[9px] font-bold text-cyan-400 uppercase tracking-tighter">Velocity</label>
                            <input type="range" min="0" max="10" step="0.1" value={nodeSpeed} onChange={(e) => { const v = parseFloat(e.target.value); setNodeSpeed(v); setSpeedInput(v.toString()); }} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                        <div className="flex flex-col gap-1 bg-slate-900/60 p-2 rounded-lg border border-rose-500/30">
                            <label className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">Force Mag</label>
                            <input type="range" min="-5" max="5" step="0.1" value={interactionForce} onChange={(e) => { const v = parseFloat(e.target.value); setInteractionForce(v); setForceInput(v.toString()); }} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"/>
                        </div>
                     </>
                   )}
                </div>
             </div>
          </div>

          <ValidationChart />
        </section>

        {/* RIGHT COLUMN: LOGS & CONCEPTS */}
        <section className="col-span-3 flex flex-col gap-4 overflow-y-auto custom-scroll pr-1">
          {/* BITÁCORA */}
          <div className="h-[200px] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden p-4 shadow-xl shrink-0">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Bitácora Global</h2>
                <button className="text-[10px] text-slate-500 hover:text-white" onClick={() => setLogs([])}><i className="fas fa-trash"></i></button>
             </div>
             <div className="flex-1 overflow-y-auto mono text-[10px] leading-relaxed flex flex-col-reverse gap-2 custom-scroll">
                {logs.length === 0 ? (
                  <p className="text-slate-700 italic text-center mt-6 text-[9px]">En espera de fluctuaciones...</p>
                ) : logs.map(log => (
                  <div key={log.id} className="p-2 rounded bg-slate-800/30 border-l-2" style={{ borderLeftColor: log.type.startsWith('ia') ? COLORS[log.type as keyof typeof COLORS] : '#334155' }}>
                    <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                    {log.icon && <span className="mr-2">{log.icon}</span>}
                    <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-slate-300'}>
                      {log.message}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          {/* DESCUBRIMIENTOS */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Descubrimientos ABC</h2>
            <div className="flex flex-col gap-2">
              {[
                { id: 'abc-nodes', title: 'Nodos ABC', desc: 'Los constituyentes básicos: a, b, c.', icon: 'project-diagram' },
                { id: 'energy-freedom', title: 'Energía Libre', desc: 'Vibraciones de red cuántica.', icon: 'wind' },
                { id: 'triplets', title: 'Tripletes', desc: 'Patrones fundamentales de 3 nodos.', icon: 'cubes' }
              ].map(concept => (
                <button key={concept.id} onClick={() => setActiveConcept(concept.id)} className={`p-3 rounded-xl border text-left transition-all ${activeConcept === concept.id ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                     <i className={`fas fa-${concept.icon} text-cyan-500`}></i>
                     <div>
                        <h4 className="text-[11px] font-bold text-white">{concept.title}</h4>
                        <p className="text-[9px] text-slate-400 leading-tight">{concept.desc}</p>
                     </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* EMERGENT PARTICLES SECTION - CLICKABLE CARDS */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <i className="fas fa-atom text-purple-500"></i> Partículas Emergentes
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(EMERGENT_PARTICLES).map(([key, particle]) => (
                <div 
                  key={key} 
                  onClick={() => openParticleAnalysis(particle)} 
                  className="bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/50 hover:border-purple-500/50 p-3 rounded-xl cursor-pointer transition-all group relative overflow-hidden active:scale-[0.98] shadow-sm hover:shadow-purple-500/10"
                >
                  <div className="absolute -right-2 -bottom-2 opacity-5 text-4xl group-hover:scale-110 transition-transform text-purple-400">
                    <i className="fas fa-certificate"></i>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[11px] font-bold text-white group-hover:text-purple-400 uppercase tracking-wider">{particle.name}</h3>
                    <div className="flex gap-1">
                      {particle.combination.slice(0, 3).map((nodeType, i) => (
                        <div 
                          key={i} 
                          className="w-2.5 h-2.5 rounded-full border border-white/20" 
                          style={{ backgroundColor: ABC_NODES_DEF[nodeType as 'a'|'b'|'c'].color }}
                        />
                      ))}
                      {particle.combination.length > 3 && <span className="text-[8px] text-slate-500">+{particle.combination.length - 3}</span>}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end text-[10px]">
                    <div className="flex flex-col">
                      <span className="text-[7px] text-slate-600 uppercase font-bold">Carga</span>
                      <span className={`font-mono font-bold ${particle.charge === 0 ? 'text-cyan-400' : particle.charge > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {particle.charge > 0 ? '+' : ''}{particle.charge.toFixed(2)}e
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[7px] text-slate-600 uppercase font-bold">Masa</span>
                      <span className="text-slate-500 italic font-mono">{particle.mass.toExponential(1)} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ENHANCED PARTICLE MODAL - DETAILED INFORMATION */}
      {selectedParticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setSelectedParticle(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-[2.5rem] p-8 max-w-2xl w-full shadow-[0_0_120px_rgba(168,85,247,0.2)] animate-in zoom-in duration-300 relative overflow-hidden flex flex-col max-h-[90vh]" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-8 relative shrink-0">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                  <i className="fas fa-fingerprint animate-pulse"></i> Quantum Signature Decoded
                </span>
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  {selectedParticle.name}
                </h2>
                <div className={`mt-2 flex items-center gap-2 text-[10px] font-bold uppercase ${getStability(selectedParticle.charge).color}`}>
                  <i className={`fas fa-${getStability(selectedParticle.charge).icon}`}></i>
                  {getStability(selectedParticle.charge).label}
                </div>
              </div>
              <button 
                onClick={() => setSelectedParticle(null)} 
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all hover:rotate-90"
                title="Cerrar modal"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="overflow-y-auto custom-scroll pr-2 flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* ORBITAL VISUALIZATION - VISUAL NODE COMBINATION */}
                <div className="relative aspect-square bg-slate-950/80 rounded-[3rem] border border-slate-800 flex items-center justify-center overflow-hidden group shadow-inner">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1.5px, transparent 1.5px)', backgroundSize: '15px 15px' }}></div>
                  <div className="w-8 h-8 rounded-full bg-white/10 blur-xl animate-pulse"></div>
                  
                  {/* Dynamic Nodes Orbiting */}
                  {selectedParticle.combination.slice(0, 12).map((node, i) => {
                    const radius = 50 + (i % 3) * 20;
                    const duration = 3 + (i % 4) * 1.2;
                    return (
                      <div 
                        key={i} 
                        className="absolute w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-[8px] font-bold shadow-2xl transition-transform animate-orbit"
                        style={{ 
                          backgroundColor: ABC_NODES_DEF[node as 'a'|'b'|'c'].color,
                          animationDuration: `${duration}s`,
                          ['--orbit-radius' as any]: `${radius}px`,
                          transform: `rotate(${i * (360 / Math.min(selectedParticle.combination.length, 12))}deg) translateX(${radius}px)`
                        } as any}
                      >
                        {node.toUpperCase()}
                      </div>
                    );
                  })}
                </div>

                {/* DETAILS PANEL - EXACT CHARGE AND MASS */}
                <div className="space-y-4">
                  <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50 flex justify-between items-center group/item hover:bg-slate-800/60 transition-all">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">Carga (e)</span>
                      <span className={`text-3xl font-mono font-bold ${selectedParticle.charge === 0 ? 'text-cyan-400' : selectedParticle.charge > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selectedParticle.charge > 0 ? '+' : ''}{selectedParticle.charge.toFixed(3)}
                      </span>
                    </div>
                    <i className="fas fa-bolt text-slate-700 text-2xl group-hover/item:text-purple-500 transition-colors"></i>
                  </div>

                  <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50 flex justify-between items-center group/item hover:bg-slate-800/60 transition-all">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1 font-bold">Masa Relativa</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-white">{selectedParticle.mass.toExponential(2)}</span>
                        <span className="text-[10px] text-slate-500">kg</span>
                      </div>
                    </div>
                    <i className="fas fa-weight-hanging text-slate-700 text-2xl group-hover/item:text-purple-500 transition-colors"></i>
                  </div>

                  {/* FULL COMBINATION DISPLAY */}
                  <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase block mb-3 font-bold">Secuencia de Nodos ({selectedParticle.combination.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedParticle.combination.map((n, i) => (
                        <div key={i} className="px-2 py-0.5 rounded-md text-[9px] font-bold border border-white/5 shadow-sm" style={{ backgroundColor: `${ABC_NODES_DEF[n as 'a'|'b'|'c'].color}33`, color: ABC_NODES_DEF[n as 'a'|'b'|'c'].color }}>
                          {n.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DOSSIER TEÓRICO - SIGNIFICANCE */}
              <div className="bg-slate-800/20 p-8 rounded-[2.5rem] border border-slate-700/30 relative">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-slate-900 border border-slate-700 px-4 py-1 rounded-full text-[9px] font-bold uppercase text-slate-500">
                  Archivo Confidencial ABC
                </div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                  <i className="fas fa-scroll text-purple-400"></i> Dossier de Significado
                </h4>
                <p className="text-base text-slate-200 leading-relaxed italic font-light">
                  "{selectedParticle.description}"
                </p>
                <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center text-[9px] text-slate-600 font-mono">
                  <span>VALIDACIÓN: CONSENSO GLOBAL</span>
                  <span>REF-ID: ABC-{selectedParticle.name.slice(0, 3).toUpperCase()}-{Math.round(selectedParticle.mass * 1e30)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedParticle(null)} 
              className="mt-8 w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-[2rem] font-bold transition-all shadow-lg active:scale-[0.98] uppercase text-xs tracking-[0.4em]"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-[10px] text-slate-500 flex justify-between items-center px-4 shrink-0 pb-2">
        <div className="flex items-center gap-4">
          <span>© 2025 Laboratorio ABC</span>
          <span className="opacity-30">|</span>
          <span className="font-mono">GRAV-REF: 0.9992384</span>
        </div>
        <div className="flex gap-4 items-center">
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> UPLINK ACTIVE</span>
        </div>
      </footer>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(var(--orbit-radius, 60px)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--orbit-radius, 60px)) rotate(-360deg); }
        }
        .animate-orbit {
          animation: orbit linear infinite;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
