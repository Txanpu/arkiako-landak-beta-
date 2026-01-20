
import React, { useState, useEffect } from 'react';
import { Player, GameState } from '../../types';
import { formatMoney } from '../../utils/gameLogic';

interface Props {
    player: Player;
    isRolling: boolean;
    displayDice: number[];
    onRoll: () => void;
    dispatch: React.Dispatch<any>;
}

export const PlayerActionCard: React.FC<Props> = ({ player, isRolling, displayDice, onRoll, dispatch }) => {
    const [revealRole, setRevealRole] = useState(false);
    useEffect(() => setRevealRole(false), [player.id]);

    const isHigh = (player.highTurns || 0) > 0;
    
    // Ensure displayDice has 3 elements if needed, or fallback
    const d1 = displayDice[0] ?? 1;
    const d2 = displayDice[1] ?? 1;
    const d3 = displayDice[2] ?? 1;

    return (
        <div className={`p-4 border-b border-slate-700 space-y-3 relative overflow-hidden transition-colors ${isHigh ? 'bg-pink-900/20' : 'bg-slate-800/50'}`}>
            {isHigh && <div className="absolute top-0 right-0 text-[50px] opacity-10 pointer-events-none">😵‍💫</div>}
            
            <div className="flex justify-between items-center relative z-10">
                <div className="font-bold text-lg flex items-center gap-2 overflow-hidden">
                    <span className="shrink-0 w-3 h-3 rounded-full border border-white" style={{backgroundColor: player.color}}></span>
                    <span className="truncate">{player.name}</span>
                    {player.role && (
                        <button onClick={() => setRevealRole(!revealRole)} className={`shrink-0 text-[8px] px-1.5 py-0.5 rounded uppercase font-black border transition-all ${revealRole ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-white'}`}>
                            {revealRole ? player.role : 'ROL ?'}
                        </button>
                    )}
                </div>
                <div className="font-mono text-emerald-400 text-xl font-black">{formatMoney(player.money)}</div>
            </div>

            {player.jail > 0 && <div className="bg-red-900/30 border border-red-500/50 p-1.5 rounded text-center text-[10px] text-red-300 font-bold uppercase tracking-widest">⛓️ PRESO: {player.jail}T</div>}
            
            {/* Inventory Tags */}
            {(player.farlopa > 0) && (
                <div className="flex gap-2 justify-center">
                    <div className="bg-slate-900 border border-slate-600 px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                        <span>❄️</span> <span className="font-bold">{player.farlopa}</span>
                    </div>
                </div>
            )}

            <div className={`grid ${isHigh || displayDice.length > 2 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 relative z-10`}>
                <div className={`bg-slate-950 rounded p-1.5 text-center border ${isRolling ? 'border-yellow-500 animate-pulse' : 'border-slate-700'}`}>
                    <span className="text-xl font-black">{d1}</span>
                </div>
                <div className={`bg-slate-950 rounded p-1.5 text-center border ${isRolling ? 'border-yellow-500 animate-pulse' : 'border-slate-700'}`}>
                    <span className="text-xl font-black">{d2}</span>
                </div>
                {(isHigh || displayDice.length > 2) && (
                    <div className={`bg-pink-900 rounded p-1.5 text-center border ${isRolling ? 'border-pink-500 animate-pulse' : 'border-pink-700'} animate-in zoom-in`}>
                        <span className="text-xl font-black text-pink-200">{d3}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
