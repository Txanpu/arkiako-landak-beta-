
import { GameState } from '../../../types';
import { handleLandingLogic } from '../../movement/landingLogic';
import { getAvailableTransportHops } from '../../board';

export const handleTransportHop = (state: GameState, action: any): GameState => {
    // 1. Check if already used this turn
    if (state.usedTransportHop) return state;
    
    const pIdx = state.currentPlayerIndex;
    const player = state.players[pIdx];
    const currentPos = player.pos;
    const currentTile = state.tiles[currentPos];
    const targetId = action.payload;

    // 2. Validate Origin
    const isTransport = ['rail', 'bus', 'ferry', 'air'].includes(currentTile.subtype || '');
    if (!isTransport) return state;

    const hasAccess = currentTile.owner === player.id || player.role === 'okupa';
    if (!hasAccess) return state;

    // 3. Validate Destination: Re-calculate valid hops using updated logic
    const validHops = getAvailableTransportHops(state.tiles, player, currentPos);
    if (!validHops.includes(targetId)) {
        return state;
    }
    
    // 4. Move Player
    const p = { ...player, pos: targetId };
    const newPs = [...state.players];
    newPs[pIdx] = p;
    
    const targetName = state.tiles[targetId].name;
    const method = player.role === 'okupa' && currentTile.owner !== player.id ? 'se cuela en' : 'viaja a';
    
    // 5. Trigger Landing Logic
    // We pass selectedTileId: null to ensure any open modal is closed upon teleport
    const landState = handleLandingLogic({
        ...state,
        players: newPs,
        usedTransportHop: true,
        transportOptions: [], // Clear options
        selectedTileId: null, // Close Modal
        logs: [`🚆 ${player.name} ${method} ${targetName}`, ...state.logs]
    });
    
    return landState;
};
