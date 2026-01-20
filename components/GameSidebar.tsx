import React from 'react';
import { GameState } from '../types';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { PlayerActionCard } from './sidebar/PlayerActionCard';
import { ActionPanel } from './sidebar/ActionPanel';

interface GameSidebarProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
    isRolling: boolean;
    displayDice: number[];
    onRoll: () => void;
    onReset: () => void;
    onUndo: () => void;
    canUndo: boolean;
}

export const GameSidebar: React.FC<GameSidebarProps> = ({ 
    state, dispatch, isRolling, displayDice, onRoll, onReset, onUndo, canUndo 
}) => {
    const currentPlayer = state.players[state.currentPlayerIndex];

    return (
        <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col shadow-2xl z-20 h-full overflow-hidden">
            <SidebarHeader state={state} onReset={onReset} onUndo={onUndo} canUndo={canUndo} />
            
            {currentPlayer ? (
                <>
                    <PlayerActionCard player={currentPlayer} isRolling={isRolling} displayDice={displayDice} onRoll={onRoll} dispatch={dispatch} />
                    <ActionPanel state={state} player={currentPlayer} onRoll={onRoll} isRolling={isRolling} dispatch={dispatch} />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm">Configurando...</div>
            )}

            {/* Mini Player List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 bg-slate-950 border-y border-slate-800 custom-scrollbar">
                {state.players.map(p => (
                    <div key={p.id} className={`flex items-center justify-between p-1.5 rounded border transition-all ${p.id === state.currentPlayerIndex ? 'border-yellow-500 bg-slate-800' : 'border-slate-800 opacity-60'}`}>
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor: p.color}}></div>
                            <span className="text-[10px] font-bold truncate text-white">{p.name}</span>
                        </div>
                        <div className="font-mono font-bold text-emerald-400 text-[10px]">${p.money}</div>
                    </div>
                ))}
            </div>

            {/* Logs Area */}
            <div className="h-40 bg-black/90 p-2 font-mono text-[9px] overflow-y-auto text-gray-500 custom-scrollbar">
                {state.logs.map((l, i) => <div key={i} className="mb-1 border-b border-white/5 pb-0.5 last:border-0 hover:text-white transition-colors">{l}</div>)}
            </div>
        </div>
    );
};