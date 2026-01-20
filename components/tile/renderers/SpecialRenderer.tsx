
import React from 'react';
import { TileData, TileType } from '../../../types';
import { TileConfig } from '../../../utils/boardLayout';

interface Props {
    tile: TileData;
    config: TileConfig;
    textRot: string;
}

export const SpecialRenderer: React.FC<Props> = ({ tile, config, textRot }) => {
    
    if (tile.type === TileType.QUIZ) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden border-2 border-yellow-500 bg-slate-900 ${config.isDiagonal ? '' : textRot}`}>
                {/* TV Studio Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800 via-indigo-950 to-black"></div>
                {/* Scanlines Effect */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,#000_1px,#000_3px)] opacity-20 pointer-events-none"></div>
                
                {/* "LIVE" Badge */}
                <div className="z-10 absolute top-1 right-1 bg-red-600 text-white text-[5px] font-black px-1 rounded animate-pulse shadow-[0_0_5px_red]">
                    EN VIVO
                </div>

                <div className="text-3xl z-10 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">📺</div>
                
                <div className="z-10 text-center mt-1">
                    <div className="text-[6px] text-yellow-400 font-bold uppercase tracking-widest leading-none">MALDINI</div>
                    <div className="text-[9px] font-black text-white uppercase tracking-tight leading-none drop-shadow-md">QUIZ</div>
                </div>
                
                {/* Stage Lights */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
            </div>
        );
    }

    // --- CASINO TILES ---
    if (tile.subtype === 'casino_bj' || tile.subtype === 'casino_roulette') {
        const isRoulette = tile.subtype === 'casino_roulette';
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden border-4 border-yellow-700 bg-green-900 ${config.isDiagonal ? '' : textRot}`}>
                {/* Felt Texture Pattern */}
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle, #22543d 1px, transparent 1px)', backgroundSize: '4px 4px'}}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40"></div>
                
                <div className="z-10 text-[7px] font-black text-yellow-400 uppercase tracking-widest bg-black/60 px-2 rounded-full border border-yellow-600 mb-1 shadow-lg">
                    CASINO
                </div>
                
                <div className="z-10 text-3xl filter drop-shadow-lg transform hover:scale-110 transition-transform">
                    {isRoulette ? '🎡' : '♠️'}
                </div>
                
                <div className="z-10 text-[8px] font-black text-white text-center leading-tight mt-1 px-1 drop-shadow-md uppercase font-serif tracking-wide">
                    {isRoulette ? 'RULETA' : 'BLACKJACK'}
                </div>
                
                {/* Gold Trim Corner */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-500 rounded-tr-sm"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-500 rounded-bl-sm"></div>
            </div>
        );
    }

    if (tile.type === TileType.GOTOJAIL) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${config.isDiagonal ? '' : textRot}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-transparent to-red-900/50 animate-pulse"></div>
                <div className="text-4xl z-10 drop-shadow-lg">👮‍♂️</div>
                <div className="text-[9px] font-black text-white uppercase tracking-wider bg-black/50 px-1 rounded mt-1 z-10 border border-blue-500/30">ARRESTO</div>
            </div>
        );
    }
    
    if (tile.type === TileType.JAIL) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${config.isDiagonal ? '' : textRot}`}>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#000_10px,#000_12px)] opacity-30"></div>
                <div className="text-4xl z-10 drop-shadow-lg grayscale contrast-150">⛓️</div>
                <div className="text-[9px] font-bold text-orange-200 uppercase mt-1 z-10 bg-black/60 px-1 rounded backdrop-blur-[1px]">Cárcel</div>
            </div>
        );
    }

    if (tile.type === TileType.BANK) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden ${config.isDiagonal ? '' : textRot}`}>
                <div className="absolute inset-0 bg-slate-900"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 to-black"></div>
                <div className="text-4xl z-10 text-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🏦</div>
                <div className="text-[8px] font-black text-yellow-500 uppercase tracking-widest mt-1 z-10 border-b border-yellow-700">BANCA</div>
            </div>
        );
    }

    if (tile.type === TileType.SLOTS) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden ${config.isDiagonal ? '' : textRot}`}>
                <div className="absolute inset-0 bg-purple-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/40 via-purple-900 to-black"></div>
                <div className="text-4xl z-10 animate-pulse drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">🎰</div>
                <div className="text-[8px] font-black text-fuchsia-300 uppercase tracking-widest mt-1 z-10 border-b border-fuchsia-500/50">SLOTS</div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-300"></div>
            </div>
        );
    }

    if (tile.subtype === 'greyhound') {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden ${config.isDiagonal ? '' : textRot} bg-[#3d2b1f]`}>
                {/* Dirt Track Texture */}
                <div className="absolute inset-0 opacity-40" 
                     style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/dirt-road.png")'}}></div>
                
                {/* Finish Line Checkers */}
                <div className="absolute top-0 right-0 w-3 h-full bg-[repeating-linear-gradient(45deg,#fff,#fff_5px,#000_5px,#000_10px)] opacity-50"></div>
                
                <div className="text-4xl z-10 drop-shadow-md transform -scale-x-100">🐕</div>
                
                <div className="text-[7px] font-black text-yellow-100 uppercase tracking-tighter mt-1 z-10 bg-yellow-900/80 px-2 py-0.5 rounded-full border border-yellow-500 shadow-sm whitespace-nowrap">
                    🏁 CANÓDROMO
                </div>
            </div>
        );
    }

    if (tile.type === TileType.PARK) {
        return (
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${config.isDiagonal ? '' : textRot}`}>
                <div className="text-3xl z-10 opacity-90">🌳</div>
                <div className="text-[10px] font-bold text-emerald-100 mt-1 uppercase tracking-wide">Parkie</div>
            </div>
        );
    }
    
    if (tile.name === 'Suerte') {
        return (
            <div className={`absolute inset-0 flex items-center justify-center ${config.isDiagonal ? '' : textRot}`}>
                <div className="text-5xl font-serif text-orange-200/20 font-black absolute">?</div>
                <div className="text-orange-100 font-bold text-[10px] uppercase border-2 border-orange-300/50 px-1 py-0.5 rounded z-10">Suerte</div>
            </div>
        );
    }
    
    if (tile.name === 'Caja de Comunidad' || tile.name.includes('Comunidad')) {
        return (
            <div className={`absolute inset-0 flex items-center justify-center ${config.isDiagonal ? '' : textRot}`}>
                <div className="text-4xl absolute opacity-20">📦</div>
                <div className="text-center z-10">
                    <div className="text-[8px] text-blue-200 uppercase tracking-tighter leading-none mb-0.5">Caja de</div>
                    <div className="text-[9px] font-bold text-white uppercase border-b border-blue-400 leading-none">Comunidad</div>
                </div>
            </div>
        );
    }

    return null;
};
