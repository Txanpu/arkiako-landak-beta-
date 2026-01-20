
import React from 'react';
import { GameState } from '../../types';

interface Props {
    state: GameState;
    onReset: () => void;
    onUndo: () => void;
    canUndo: boolean;
}

export const SidebarHeader: React.FC<Props> = ({ state, onReset, onUndo, canUndo }) => {
    const weatherIcon = state.world.weather === 'rain' ? '🌧️' : state.world.weather === 'heatwave' ? '🔥' : '☀️';
    const dayIcon = state.world.isNight ? '🌙' : '☀️';

    return (
        <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-black text-white tracking-wider leading-none">ARTI LANDAK</h1>
                <div className="flex flex-col gap-1 text-xs font-mono text-gray-400 mt-1">
                    <div className="flex gap-2"><span>T: {state.turnCount}</span><span className="uppercase text-yellow-500 font-bold">{state.gov}</span></div>
                    <div className="text-emerald-400 font-bold">Arcas: ${state.estadoMoney}</div>
                    <div className="flex gap-2 mt-1 bg-slate-900 px-1 py-0.5 rounded text-[10px]">
                        <span>{dayIcon} D{state.world.dayCount}</span>
                        <span className="border-l border-gray-600 pl-2 uppercase">{weatherIcon} {state.world.weather}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <button onClick={onUndo} disabled={!canUndo} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded hover:bg-slate-600 disabled:opacity-30">Undo</button>
                <button onClick={onReset} className="text-[10px] bg-red-900/40 text-red-200 px-2 py-0.5 rounded hover:bg-red-800">Reset</button>
            </div>
        </div>
    );
};
