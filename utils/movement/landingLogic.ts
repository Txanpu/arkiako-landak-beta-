
import { GameState, TileType } from '../../types';
import { trackTileLanding, drawEvent } from '../gameLogic';
import { getAvailableTransportHops } from '../board';

// Sub-modules
import { applyRoleLandingEffects } from './landing/roleEffects';
import { processSpecialLocations } from './landing/specialLocations';
import { processTaxTile, processJailTile, processFbiTheft } from './landing/coreActions';

export const handleLandingLogic = (state: GameState): GameState => {
    let pIdx = state.currentPlayerIndex;
    let player = { ...state.players[pIdx] };
    let newPos = player.pos;
    let tile = state.tiles[newPos];

    // --- 1. ROLE EFFECTS (Okupa, Fentanyl, Abilities) ---
    const roleRes = applyRoleLandingEffects(state, player, tile, state.tiles);
    player = roleRes.updatedPlayer;
    let tileUpdates = roleRes.updatedTiles;
    const currentLogs = [...roleRes.logs];

    // Update Houses Bank if Okupa destroyed something (Simple diff check or assume 1 house max per turn logic from helper)
    // The helper modified tiles but not state.housesAvail directly. We need to sync.
    // If a house was removed in roleRes, we should increment housesAvail.
    const prevHouseCount = state.tiles[newPos].houses || 0;
    const newHouseCount = tileUpdates[newPos].houses || 0;
    let newHousesAvail = state.housesAvail;
    if (newHouseCount < prevHouseCount) {
        newHousesAvail += (prevHouseCount - newHouseCount);
    }

    // --- 2. SPECIAL LOCATIONS (Kanala Bitch, Fiesta) ---
    const specialRes = processSpecialLocations(state, tileUpdates, player, tile);
    tileUpdates = specialRes.updatedTiles;
    currentLogs.push(...specialRes.logs);

    // Handle Recursive Fiesta Movement
    if (specialRes.fiestaDest) {
        const destTile = state.tiles.find(t => t.name === specialRes.fiestaDest);
        if (destTile) {
            player.pos = destTile.id;
            const newPlayers = [...state.players];
            newPlayers[pIdx] = player;
            
            // Recursive Call for new location
            return handleLandingLogic({
                ...state,
                tiles: tileUpdates,
                players: newPlayers,
                housesAvail: newHousesAvail,
                logs: [...currentLogs, ...state.logs]
            });
        }
    }

    // --- 3. HEATMAP & METADATA ---
    const newHeatmap = trackTileLanding(state, newPos);
    
    // Casino Flags
    let showCasino = false;
    let casinoGame: 'blackjack' | 'roulette' | null = null;
    if (tile.subtype === 'casino_bj') { showCasino = true; casinoGame = 'blackjack'; }
    if (tile.subtype === 'casino_roulette') { showCasino = true; casinoGame = 'roulette'; }
    if (tile.type === TileType.SLOTS) { showCasino = true; casinoGame = null; }
    if (player.isBot) { showCasino = false; }

    // QUIZ FLAG
    let startQuiz = false;
    if (tile.type === TileType.QUIZ) startQuiz = true;

    // Transport Options
    let transportOptions: number[] = [];
    const isTransport = tile.type === TileType.PROP && ['rail', 'bus', 'ferry', 'air'].includes(tile.subtype || '');
    const hasTransportAccess = isTransport && (tile.owner === player.id || player.role === 'okupa');

    if (!state.usedTransportHop && hasTransportAccess) {
        transportOptions = getAvailableTransportHops(state.tiles, player, newPos);
    }

    // --- 4. CORE TILE ACTIONS (Tax, Jail, FBI) ---
    let newEstadoMoney = state.estadoMoney;
    let newFbiPot = state.fbiPot || 0;
    let rolled = state.rolled;

    // A. TAX
    if (tile.type === TileType.TAX) {
        const taxRes = processTaxTile(state, player);
        player = taxRes.updatedPlayer;
        newEstadoMoney = taxRes.updatedStateMoney;
        newFbiPot = taxRes.updatedFbiPot;
        if (taxRes.log) currentLogs.push(taxRes.log);
    }

    // B. FBI STEAL (If landing on Tax)
    if (tile.type === TileType.TAX) {
        const fbiRes = processFbiTheft(player, newFbiPot);
        player = fbiRes.updatedPlayer;
        newFbiPot = fbiRes.newPot;
        if (fbiRes.log) currentLogs.push(fbiRes.log);
    }

    // C. GO TO JAIL
    if (tile.type === TileType.GOTOJAIL) {
        const jailRes = processJailTile(player, state.tiles);
        player = jailRes.updatedPlayer;
        currentLogs.push(jailRes.log);
        transportOptions = []; // Cancel hops
        rolled = true; // End turn effectively
    }

    // --- 5. EVENT CARDS ---
    let finalState: GameState = {
        ...state,
        tiles: tileUpdates,
        players: [...state.players], // Will update index below
        heatmap: newHeatmap,
        showCasinoModal: showCasino,
        casinoGame: casinoGame,
        transportOptions,
        logs: [...currentLogs, ...state.logs],
        estadoMoney: newEstadoMoney,
        fbiPot: newFbiPot,
        housesAvail: newHousesAvail,
        rolled: rolled,
        // Reset movement flags
        isMoving: false,
        pendingMoves: 0,
        movementOptions: [],
        lastMovementPos: null
    };

    // Update player in array
    finalState.players[pIdx] = player;

    // Draw Event if needed
    if (tile.type === TileType.EVENT) {
        const evtRes = drawEvent(finalState, pIdx);
        finalState = { ...finalState, ...evtRes };
    }

    // START QUIZ LOGIC (Deferred dispatch simulation by setting state prop that UI reacts to, or better, specialized initial state)
    // We'll rely on the UI/App to see the 'quiz' object is null, so we need to set it up here via Reducer-like logic? 
    // No, handleLandingLogic returns state. We should trigger the quiz INIT here if landing.
    if (startQuiz) {
        // We reuse the logic from quizReducer's START_QUIZ here or let the user click "Start" in a modal?
        // Since it's an automatic event usually, let's init it.
        // Importing logic from reducer is messy. 
        // Best approach: Add a flag or rely on `quiz: { isOpen: false ... }` to trigger a useEffect?
        // Actually, we can just return a state where we call the quiz init logic manually or 
        // simpler: The Modal opens if TileType is Quiz, and the modal has a "Start" button which dispatches START_QUIZ.
        // But we need to ensure the modal opens.
        finalState.selectedTileId = newPos; // This ensures TileModal opens. 
        // But wait, Quiz is special. We want a specific QuizModal, not TileModal.
        // Let's modify App.tsx to render QuizModal if state.quiz.isOpen is true.
        // So we need to set quiz.isOpen = true here?
        // Let's assume we dispatch START_QUIZ immediately? No, we are in a helper function.
        // Solution: The TileModal for QUIZ type will have a "EMPEZAR QUIZ" button that dispatches START_QUIZ.
        // See SpecialTileModal changes below/previously.
        // Actually, I'll update `SpecialTileModal` to handle `TileType.QUIZ` specifically to show the start button.
        // WAIT, I implemented `QuizModal` as a separate global modal. 
        // So I should trigger `START_QUIZ` action. 
        // Since I cannot dispatch here, I will set a flag in `finalState` or rely on the `selectedTileId` opening `TileModal`,
        // and inside `TileModal` (SpecialView), there is a button to `dispatch(START_QUIZ)`.
    }

    return finalState;
};
