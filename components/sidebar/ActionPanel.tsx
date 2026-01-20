
import React from 'react';
import { GameState, TileType, Player } from '../../types';

interface Props {
    state: GameState;
    player: Player;
    onRoll: () => void;
    isRolling: boolean;
    dispatch: React.Dispatch<any>;
}

export const ActionPanel: React.FC<Props> = ({ state, player, onRoll, isRolling, dispatch }) => {
    const currentTile = state.tiles[player.pos];
    const isOwnerless = currentTile?.type === TileType.PROP && currentTile.owner === null;
    const mustPayRent = currentTile?.type === TileType.PROP && currentTile.owner !== null && currentTile.owner !== player.id && currentTile.owner !== 'E';
    
    const canBuy = isOwnerless && player.money >= (currentTile.price || 0) && state.gov === 'authoritarian';
    const canAuction = isOwnerless && ['right', 'libertarian', 'anarchy'].includes(state.gov);
    const isBlocked = isOwnerless && state.gov === 'left';
    
    // Hacker Logic
    const isHacker = player.role === 'hacker';

    // --- FARLOPA LOGIC ---
    const isNight = state.world.isNight;
    const isOzollo = currentTile.name.includes('Ozollo');
    const isMarko = currentTile.name.includes('Marko Pollo');
    const isFerry = currentTile.subtype === 'ferry';
    
    // Buy Logic
    const canBuyFarlopa = isNight && (isMarko || isFerry);
    const canGetFreeFarlopa = isNight && isOzollo;
    
    // Use Logic
    const hasStash = (player.farlopa || 0) > 0;
    const isHigh = (player.highTurns || 0) > 0;

    return (
        <div className="p-4 grid grid-cols-2 gap-2">
            {!state.rolled && state.pendingMoves === 0 && !isRolling ? (
                <>
                    {/* DRUG TOGGLE */}
                    {hasStash && !isHigh && (
                        <button 
                            onClick={() => dispatch({type: 'CONSUME_FARLOPA'})} 
                            className="col-span-2 bg-slate-200 hover:bg-white text-slate-900 font-bold py-2 rounded-lg mb-2 shadow flex items-center justify-center gap-2 border-2 border-slate-400"
                        >
                            <span>SNIFF (Activar 3º Dado)</span>
                            <span className="text-xl">👃❄️</span>
                        </button>
                    )}
                    
                    <button onClick={onRoll} disabled={isRolling} className={`col-span-2 ${isHigh ? 'bg-pink-600 hover:bg-pink-500 animate-pulse border-pink-800' : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800'} text-white font-black py-3 rounded-lg shadow-lg border-b-4 active:scale-95 transition-all`}>
                        {isHigh ? 'TIRAR 3 DADOS!!!' : 'TIRAR DADOS'}
                    </button>
                </>
            ) : (
                <>
                    {state.pendingMoves > 0 ? <div className="col-span-2 text-center text-yellow-500 font-bold py-2 animate-bounce">MOVIENDO...</div> : (
                        <>
                            {/* Buying Actions (Only show if allowed) */}
                            {canBuyFarlopa && (
                                <button onClick={() => dispatch({type: 'GET_FARLOPA', payload: {cost: 100}})} disabled={player.money < 100} className="col-span-2 bg-indigo-900 hover:bg-indigo-800 text-white py-2 rounded border border-indigo-500 text-xs font-bold uppercase disabled:opacity-50">
                                    Comprar "Oilasko Erdi" ($100)
                                </button>
                            )}
                            {canGetFreeFarlopa && (
                                <button onClick={() => dispatch({type: 'GET_FARLOPA', payload: {cost: 0}})} className="col-span-2 bg-green-800 hover:bg-green-700 text-white py-2 rounded border border-green-500 text-xs font-bold uppercase animate-pulse">
                                    Pillar Farlopa Gratis
                                </button>
                            )}

                            {canBuy && <button onClick={() => dispatch({type: 'BUY_PROP'})} className="bg-blue-600 hover:bg-blue-500 py-2 rounded text-[10px] font-black uppercase text-white shadow-lg border-b-4 border-blue-800">Comprar</button>}
                            {canAuction && <button onClick={() => dispatch({type: 'START_AUCTION', payload: currentTile.id})} className="bg-purple-600 hover:bg-purple-500 py-2 rounded text-[10px] font-black uppercase text-white shadow-lg border-b-4 border-purple-800">Subastar</button>}
                            {isBlocked && <div className="col-span-2 bg-red-900/50 p-1 text-center text-[10px] text-red-300 font-bold rounded">Bloqueado p. Gov</div>}
                            {mustPayRent && <button onClick={() => dispatch({type: 'PAY_RENT'})} className="col-span-2 bg-red-600 hover:bg-red-500 py-2 rounded font-black uppercase text-white border-b-4 border-red-800">Pagar Renta</button>}
                            <button onClick={() => dispatch({type: 'END_TURN'})} className="col-span-2 bg-slate-600 hover:bg-slate-500 py-2 rounded font-black uppercase text-white border-b-4 border-slate-800">Fin Turno</button>
                        </>
                    )}
                </>
            )}
            <div className="col-span-2 grid grid-cols-5 gap-1 mt-1">
                <button onClick={() => dispatch({type: 'PROPOSE_TRADE'})} className="bg-slate-700 py-1 rounded text-[9px] font-bold">🤝</button>
                <button onClick={() => dispatch({type: 'TOGGLE_BANK_MODAL'})} className="bg-slate-700 py-1 rounded text-[9px] font-bold">🏦</button>
                <button onClick={() => dispatch({type: 'TOGGLE_BALANCE_MODAL'})} className="bg-slate-700 py-1 rounded text-[9px] font-bold">📈</button>
                
                {/* Dark Web - Only for Hacker */}
                <button 
                    onClick={() => dispatch({type: 'TOGGLE_DARK_WEB'})} 
                    disabled={!isHacker}
                    className={`col-span-2 py-1 rounded text-[9px] font-bold border ${isHacker ? 'bg-slate-700 border-green-500/30 hover:text-green-400' : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50'}`}
                    title={isHacker ? "Acceso Dark Web" : "Encriptado: Requiere rol Hacker"}
                >
                    {isHacker ? '🕸️ DARK WEB' : '🔒 DARK WEB'}
                </button>
            </div>
        </div>
    );
};
