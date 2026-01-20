
import { GameState, WeatherType } from '../types';

export const tickWorld = (state: GameState): Partial<GameState> => {
    // Every 5 turns, toggle Day/Night
    const isNight = Math.floor(state.turnCount / 5) % 2 === 1;
    
    // Weather Logic
    let weather: WeatherType = state.world.weather;
    
    // Change weather with probability
    if (Math.random() < 0.10) {
        const roll = Math.random();
        if (roll < 0.6) weather = 'sunny';
        else if (roll < 0.9) weather = 'rain';
        else weather = 'heatwave';
    }

    const prevNight = state.world.isNight;
    const logs: string[] = [];

    if (isNight && !prevNight) logs.push('🌙 Cae la NOCHE en Artia. El crimen sube, las Utilidades bajan.');
    if (!isNight && prevNight) logs.push('☀️ Amanece en Artia.');
    
    if (weather !== state.world.weather) {
        if (weather === 'rain') logs.push('🌧️ Empieza a llover (Movimiento -1).');
        if (weather === 'heatwave') logs.push('🔥 ¡OLA DE CALOR! Nadie paga alquiler en las calles.');
        if (weather === 'sunny' && state.world.weather === 'rain') logs.push('🌤️ Escampa. Sale el sol.');
    }

    return {
        world: {
            isNight,
            weather,
            dayCount: state.world.dayCount + (isNight && !prevNight ? 1 : 0)
        },
        logs: [...logs, ...state.logs] // Prepend new logs
    };
};
