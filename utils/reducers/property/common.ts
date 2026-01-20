
import { GameState } from '../../../types';
import { movementReducer } from '../movementReducer';
import { getJailFine, formatMoney } from '../../gameLogic';

export const commonPropertyReducer = (state: GameState, action: any): GameState => {
    switch (action.type) {
        case 'PAY_JAIL': { 
            const jpIdx = state.currentPlayerIndex; 
            const jPlayer = { ...state.players[jpIdx] }; 
            const fine = getJailFine(state.gov);

            if (jPlayer.money >= fine && jPlayer.jail > 0) { 
                jPlayer.money -= fine; 
                jPlayer.jail = 0; 
                const jpPlayers = [...state.players]; 
                jpPlayers[jpIdx] = jPlayer; 
                return { ...state, players: jpPlayers, estadoMoney: state.estadoMoney + fine, logs: [`${jPlayer.name} paga fianza de ${formatMoney(fine)} y queda libre.`, ...state.logs] }; 
            } 
            return state; 
        }
        case 'SELECT_TILE': {
            const id = action.payload;
            if (state.pendingMoves > 0 && state.movementOptions.includes(id)) {
                return movementReducer(state, { type: 'SELECT_MOVE', payload: action.payload });
            }
            return { ...state, selectedTileId: id };
        }
        case 'CLOSE_MODAL': return { ...state, selectedTileId: null };
        default: return state;
    }
};
