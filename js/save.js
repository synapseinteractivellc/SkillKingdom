// save.js

(function () {
  const SAVE_KEY = "skillKingdomSave";
  const AUTO_SAVE_INTERVAL_MS = 60 * 1000;

  function getStateApi() {
    return window.skillKingdomState;
  }

  function getRenderApi() {
    return window.skillKingdomRender;
  }

  function getMainApi() {
    return window.skillKingdomMain;
  }

  function getState() {
    return getStateApi()?.getState?.() || null;
  }

  function setState(newState) {
    return getStateApi()?.setState?.(newState);
  }

  function resetState() {
    return getStateApi()?.resetState?.();
  }

  function createMergedGameState(parsedSave) {
    return getStateApi()?.createMergedGameState?.(parsedSave);
  }

  function ensureActionState(state) {
    return getStateApi()?.ensureActionState?.(state);
  }

  function renderAll() {
    getRenderApi()?.renderAll?.();
  }

  function renderLog() {
    getRenderApi()?.renderLog?.();
  }

  function updateLastSavedDisplay() {
    getRenderApi()?.updateLastSavedDisplay?.();
  }

  function addLog(message, shouldRender = true) {
    getMainApi()?.addLog?.(message, shouldRender);
  }

  function saveGame({ showLogMessage = true } = {}) {
    try {
      const gameState = getState();
      if (!gameState) {
        if (showLogMessage) {
          addLog("Save failed.");
        }
        return false;
      }

      gameState.meta.lastSavedAt = new Date().toISOString();
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
      updateLastSavedDisplay();

      if (showLogMessage) {
        addLog("Game saved.");
      }

      return true;
    } catch (error) {
      console.error("Save failed:", error);
      addLog("Save failed.");
      return false;
    }
  }

  function loadGame({ showLogMessage = true } = {}) {
    try {
      const rawSave = localStorage.getItem(SAVE_KEY);

      if (!rawSave) {
        if (showLogMessage) {
          addLog("No save file found.");
        }
        return false;
      }

      const parsedSave = JSON.parse(rawSave);
      const mergedState = createMergedGameState(parsedSave);

      if (!mergedState) {
        throw new Error("Merged state could not be created.");
      }

      ensureActionState(mergedState);
      setState(mergedState);

      renderAll();

      if (showLogMessage) {
        addLog("Game loaded.");
      }

      return true;
    } catch (error) {
      console.error("Load failed:", error);
      addLog("Load failed. Save may be corrupted.");
      return false;
    }
  }

  function wipeGame() {
    const confirmed = window.confirm(
      "Are you sure you want to wipe your save? This cannot be undone."
    );

    if (!confirmed) {
      addLog("Wipe canceled.");
      return;
    }

    localStorage.removeItem(SAVE_KEY);
    resetState();
    renderAll();
    addLog("Save wiped. New game started.");
  }

  function setupAutoSave() {
    setInterval(() => {
      saveGame({ showLogMessage: false });
    }, AUTO_SAVE_INTERVAL_MS);

    window.addEventListener("beforeunload", () => {
      saveGame({ showLogMessage: false });
    });
  }

  window.skillKingdomSave = {
    SAVE_KEY,
    AUTO_SAVE_INTERVAL_MS,
    saveGame,
    loadGame,
    wipeGame,
    setupAutoSave
  };
})();