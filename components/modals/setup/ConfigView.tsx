
import React from 'react';

interface HumanConfig {
    name: string;
    gender: 'male'|'female'|'helicoptero'|'marcianito';
}

interface ConfigViewProps {
    setupHumans: number;
    setSetupHumans: (n: number) => void;
    humanConfigs: HumanConfig[];
    setHumanConfigs: (configs: HumanConfig[]) => void;
    numBots: number;
    setNumBots: (n: number) => void;
    onStart: () => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({
    setupHumans, setSetupHumans,
    humanConfigs, setHumanConfigs,
    numBots, setNumBots,
    onStart
}) => {
    const totalPlayers = setupHumans + numBots;
    const canStart = totalPlayers >= 2;

    return (
        <>
            <h2 className="text-3xl font-black mb-6 text-white text-center tracking-tight">CONFIGURACIÓN</h2>
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Human Count */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-gray-300">Nº Humanos</label>
                        <span className="text-sm font-mono text-green-400">{setupHumans}</span>
                    </div>
                    <input type="range" min="0" max="8" step="1" value={setupHumans} onChange={e => setSetupHumans(parseInt(e.target.value))} className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-green-500" />
                </div>

                {/* Player Names/Genders */}
                {setupHumans > 0 && (
                    <div className="space-y-3">
                        {humanConfigs.map((cfg, idx) => (
                            <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-700 hover:border-slate-500 transition-colors">
                                <div className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Jugador {idx + 1}</div>
                                <input 
                                    type="text" 
                                    value={cfg.name} 
                                    onChange={(e) => {
                                        const newCfgs = [...humanConfigs];
                                        newCfgs[idx].name = e.target.value;
                                        setHumanConfigs(newCfgs);
                                    }}
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white mb-2 focus:outline-none focus:border-green-500 transition-colors"
                                    placeholder="Nombre"
                                />
                                <select 
                                    value={cfg.gender}
                                    onChange={(e) => {
                                        const newCfgs = [...humanConfigs];
                                        newCfgs[idx].gender = e.target.value as any;
                                        setHumanConfigs(newCfgs);
                                    }}
                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-xs text-white focus:outline-none focus:border-green-500"
                                >
                                    <option value="male">Masculino</option>
                                    <option value="female">Femenino</option>
                                    <option value="helicoptero">Helicóptero de Combate</option>
                                    <option value="marcianito">Marcianito 100% real no fake</option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bots */}
                <div className="border-t border-slate-700 pt-4">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-bold text-gray-300">Nº Bots</label>
                        <span className="text-sm font-mono text-blue-400">{numBots}</span>
                    </div>
                    <input type="range" min="0" max="8" step="1" value={numBots} onChange={e => setNumBots(parseInt(e.target.value))} className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>

                <div className="mt-4">
                    <button 
                        onClick={onStart} 
                        disabled={!canStart}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all 
                            ${canStart 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white hover:scale-[1.02] active:scale-95' 
                                : 'bg-slate-700 text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        {canStart ? '🎲 SORTEAR TURNOS' : 'MÍNIMO 2 JUGADORES'}
                    </button>
                    {totalPlayers === 0 && <div className="text-center text-xs text-red-400 mt-2">Añade humanos o bots.</div>}
                </div>
            </div>
        </>
    );
};
