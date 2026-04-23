// main.js

document.addEventListener("DOMContentLoaded", () => {
  const {
    createDefaultGameState,
    getState,
    setState,
    getActiveCharacter
  } = window.skillKingdomState;

  setState(createDefaultGameState());

  function renderAll() {
    window.skillKingdomRender?.renderAll?.();
  }

  function addLog(message, shouldRender = true) {
    const gameState = getState();

    if (!gameState) return;

    gameState.log.unshift(message);

    if (gameState.log.length > 100) {
      gameState.log.length = 100;
    }

    if (shouldRender) {
      window.skillKingdomRender?.renderLog?.();
    }
  }

  function setActiveTab(tabName) {
    const gameState = getState();
    if (!gameState) return;

    gameState.ui.activeTab = tabName;

    window.skillKingdomRender?.renderTabs?.();

    const formattedTabName = window.skillKingdomRender?.formatTabName?.(tabName) || tabName;
    addLog(`Opened ${formattedTabName} tab.`);
  }

  function setCharacterNameFromInput() {
    const activeCharacter = getActiveCharacter();
    const elements = window.skillKingdomRender?.getElements?.();

    if (!activeCharacter || !elements?.characterNameInput) return;

    const trimmedName = elements.characterNameInput.value.trim();

    if (!trimmedName) {
      addLog("Character name cannot be empty.");
      elements.characterNameInput.value = activeCharacter.name || "";
      return;
    }

    const oldName = activeCharacter.name;
    activeCharacter.name = trimmedName;

    window.skillKingdomRender?.renderPlayer?.();

    if (oldName === trimmedName) {
      addLog(`Character name remains ${trimmedName}.`);
    } else {
      addLog(`Character name set to ${trimmedName}.`);
    }
  }

  function setCharacterTitlePrefix(prefixValue) {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter) return;

    activeCharacter.titles.prefix = prefixValue || "";
    window.skillKingdomRender?.renderPlayer?.();

    addLog(
      activeCharacter.titles.prefix
        ? `Prefix title set to ${activeCharacter.titles.prefix}.`
        : "Prefix title cleared."
    );
  }

  function setCharacterTitlePostfix(postfixValue) {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter) return;

    activeCharacter.titles.postfix = postfixValue || "";
    window.skillKingdomRender?.renderPlayer?.();

    addLog(
      activeCharacter.titles.postfix
        ? `Post title set to ${activeCharacter.titles.postfix}.`
        : "Post title cleared."
    );
  }

  function setupHeaderButtons() {
    const saveButton = document.getElementById("save-btn");
    const loadButton = document.getElementById("load-btn");
    const wipeButton = document.getElementById("wipe-btn");

    if (saveButton && saveButton.dataset.wired !== "true") {
      saveButton.addEventListener("click", () => {
        window.skillKingdomSave?.saveGame?.();
      });
      saveButton.dataset.wired = "true";
    }

    if (loadButton && loadButton.dataset.wired !== "true") {
      loadButton.addEventListener("click", () => {
        window.skillKingdomSave?.loadGame?.();
      });
      loadButton.dataset.wired = "true";
    }

    if (wipeButton && wipeButton.dataset.wired !== "true") {
      wipeButton.addEventListener("click", () => {
        window.skillKingdomSave?.wipeGame?.();
      });
      wipeButton.dataset.wired = "true";
    }
  }

  function setupContinuousActionLoop() {
    setInterval(() => {
      window.skillKingdomActions?.updateContinuousAction?.();
    }, 100);
  }

  window.skillKingdomMain = {
    addLog,
    renderAll,
    setActiveTab,
    setCharacterNameFromInput,
    setCharacterTitlePrefix,
    setCharacterTitlePostfix
  };

  function init() {
    window.skillKingdomRender?.initUI?.();
    setupHeaderButtons();
    window.skillKingdomSave?.setupAutoSave?.();
    setupContinuousActionLoop();

    lucide.createIcons();

    const loadedExistingSave = window.skillKingdomSave?.loadGame?.({ showLogMessage: false });

    if (!loadedExistingSave) {
      renderAll();
      addLog("Started new game.");
      window.skillKingdomSave?.saveGame?.({ showLogMessage: false });
    } else {
      addLog("Save detected and loaded.");
      window.skillKingdomRender?.renderLog?.();
    }
  }

  init();

  window.skillKingdom = {
    getState,
    setState,
    getActiveCharacter,
    saveGame: (...args) => window.skillKingdomSave?.saveGame?.(...args),
    loadGame: (...args) => window.skillKingdomSave?.loadGame?.(...args),
    wipeGame: (...args) => window.skillKingdomSave?.wipeGame?.(...args),
    setActiveTab,
    renderAll,
    addLog,

    setCharacterNameByValue(name) {
      const activeCharacter = getActiveCharacter();
      if (!activeCharacter) return;

      activeCharacter.name = name;
      window.skillKingdomRender?.renderPlayer?.();
      addLog(`Character name set to ${name}.`);
    },

    setPrefixTitle(value) {
      setCharacterTitlePrefix(value);
    },

    setPostfixTitle(value) {
      setCharacterTitlePostfix(value);
    },

    addResource(resourceKey, amount = 1) {
      const activeCharacter = getActiveCharacter();
      if (!activeCharacter) return;
      if (!(resourceKey in activeCharacter.resources)) return;

      activeCharacter.resources[resourceKey] += amount;
      window.skillKingdomRender?.renderResources?.();
      addLog(`Gained ${amount} ${resourceKey}.`);
    }
  };
});