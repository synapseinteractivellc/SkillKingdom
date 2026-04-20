document.addEventListener("DOMContentLoaded", () => {
  const SAVE_KEY = "skillKingdomSave";
  const AUTO_SAVE_INTERVAL_MS = 60 * 1000;

  function createDefaultCharacter() {
    return {
      id: "char_1",
      name: "Player Name",
      titles: {
        prefix: "",
        postfix: ""
      },
      resources: {
        copper: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
        leather: 0,
        cotton: 0,
        iron: 0,
        wood: 0
      },
      pools: {
        health: {
          current: 10,
          max: 10
        },
        stamina: {
          current: 10,
          max: 10
        },
        mana: {
          current: 0,
          max: 0
        }
      },
      stats: {
        toHit: 0,
        evasion: 0,
        block: 0,
        defense: 0,
        attackPower: 0,
        resistPhysical: {
          blunt: 0,
          pierce: 0,
          slash: 0
        },
        resistElemental: {
          earth: 0,
          water: 0,
          wind: 0,
          fire: 0,
          light: 0,
          dark: 0,
          life: 0,
          death: 0
        },
        potencyPhysical: {
          blunt: 0,
          pierce: 0,
          slash: 0
        },
        potencyElemental: {
          earth: 0,
          water: 0,
          wind: 0,
          fire: 0,
          light: 0,
          dark: 0,
          life: 0,
          death: 0
        }
      }
    };
  }

  function createDefaultGameState() {
    const defaultCharacter = createDefaultCharacter();

    return {
      activeCharacterId: defaultCharacter.id,
      characters: {
        [defaultCharacter.id]: defaultCharacter
      },
      ui: {
        activeTab: "actions"
      },
      log: [
        "Welcome to Skill Kingdom.",
        "Your journey will begin soon.",
        "Switch tabs to explore the layout."
      ],
      meta: {
        lastSavedAt: null
      }
    };
  }

  let gameState = createDefaultGameState();

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const actionLog = document.getElementById("action-log");

  const saveButton = document.getElementById("save-btn");
  const loadButton = document.getElementById("load-btn");
  const wipeButton = document.getElementById("wipe-btn");

  const playerNameDisplay = document.getElementById("player-name-display");
  const lastSavedDisplay = document.getElementById("last-saved-display");

  const resourceList = document.getElementById("resource-list");

  const healthDisplay = document.getElementById("health-display");
  const staminaDisplay = document.getElementById("stamina-display");
  const manaDisplay = document.getElementById("mana-display");

  const healthFill = document.getElementById("health-fill");
  const staminaFill = document.getElementById("stamina-fill");
  const manaFill = document.getElementById("mana-fill");

  const characterNameInput = document.getElementById("character-name-input");
  const setCharacterNameButton = document.getElementById("set-character-name-btn");

  const titlePrefixSelect = document.getElementById("title-prefix-select");
  const titlePostfixSelect = document.getElementById("title-postfix-select");

  const statToHit = document.getElementById("stat-to-hit");
  const statEvasion = document.getElementById("stat-evasion");
  const statBlock = document.getElementById("stat-block");
  const statDefense = document.getElementById("stat-defense");
  const statAttackPower = document.getElementById("stat-attack-power");

  const resistPhysicalBlunt = document.getElementById("resist-physical-blunt");
  const resistPhysicalPierce = document.getElementById("resist-physical-pierce");
  const resistPhysicalSlash = document.getElementById("resist-physical-slash");

  const resistElementalEarth = document.getElementById("resist-elemental-earth");
  const resistElementalWater = document.getElementById("resist-elemental-water");
  const resistElementalWind = document.getElementById("resist-elemental-wind");
  const resistElementalFire = document.getElementById("resist-elemental-fire");
  const resistElementalLight = document.getElementById("resist-elemental-light");
  const resistElementalDark = document.getElementById("resist-elemental-dark");
  const resistElementalLife = document.getElementById("resist-elemental-life");
  const resistElementalDeath = document.getElementById("resist-elemental-death");

  const potencyPhysicalBlunt = document.getElementById("potency-physical-blunt");
  const potencyPhysicalPierce = document.getElementById("potency-physical-pierce");
  const potencyPhysicalSlash = document.getElementById("potency-physical-slash");

  const potencyElementalEarth = document.getElementById("potency-elemental-earth");
  const potencyElementalWater = document.getElementById("potency-elemental-water");
  const potencyElementalWind = document.getElementById("potency-elemental-wind");
  const potencyElementalFire = document.getElementById("potency-elemental-fire");
  const potencyElementalLight = document.getElementById("potency-elemental-light");
  const potencyElementalDark = document.getElementById("potency-elemental-dark");
  const potencyElementalLife = document.getElementById("potency-elemental-life");
  const potencyElementalDeath = document.getElementById("potency-elemental-death");

  function getActiveCharacter() {
    return gameState.characters[gameState.activeCharacterId];
  }

  function getResourceEntries() {
    return [
      { key: "copper", label: "Copper" },
      { key: "silver", label: "Silver" },
      { key: "gold", label: "Gold" },
      { key: "platinum", label: "Platinum" },
      { key: "leather", label: "Leather" },
      { key: "cotton", label: "Cotton" },
      { key: "iron", label: "Iron" },
      { key: "wood", label: "Wood" }
    ];
  }

  function clampPercent(current, max) {
    if (max <= 0) return 0;
    return Math.max(0, Math.min(100, (current / max) * 100));
  }

  function formatTabName(tabName) {
    return tabName.charAt(0).toUpperCase() + tabName.slice(1);
  }

  function addLog(message, shouldRender = true) {
    gameState.log.unshift(message);

    if (gameState.log.length > 100) {
      gameState.log.length = 100;
    }

    if (shouldRender) {
      renderLog();
    }
  }

  function renderLog() {
    if (!actionLog) return;

    actionLog.innerHTML = "";

    gameState.log.forEach((message) => {
      const entry = document.createElement("div");
      entry.className = "log-entry";
      entry.textContent = message;
      actionLog.appendChild(entry);
    });
  }

  function renderPlayer() {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter || !playerNameDisplay) return;

    const prefix = activeCharacter.titles?.prefix?.trim() || "";
    const postfix = activeCharacter.titles?.postfix?.trim() || "";
    const name = activeCharacter.name || "Player Name";

    let displayName = name;

    if (prefix) {
      displayName = `${prefix} ${displayName}`;
    }

    if (postfix) {
      displayName = `${displayName} ${postfix}`;
    }

    playerNameDisplay.textContent = displayName;

    if (characterNameInput) {
      characterNameInput.value = activeCharacter.name || "";
    }

    if (titlePrefixSelect) {
      titlePrefixSelect.value = activeCharacter.titles?.prefix || "";
    }

    if (titlePostfixSelect) {
      titlePostfixSelect.value = activeCharacter.titles?.postfix || "";
    }
  }

  function renderResources() {
    if (!resourceList) return;

    const activeCharacter = getActiveCharacter();
    if (!activeCharacter) return;

    const entries = getResourceEntries();
    resourceList.innerHTML = "";

    entries.forEach((resource) => {
      const li = document.createElement("li");
      li.className = "resource-item";

      const name = document.createElement("span");
      name.className = "resource-name";
      name.textContent = resource.label;

      const value = document.createElement("span");
      value.className = "resource-value";
      value.textContent = activeCharacter.resources[resource.key] ?? 0;

      li.appendChild(name);
      li.appendChild(value);
      resourceList.appendChild(li);
    });
  }

  function renderPools() {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter) return;

    const health = activeCharacter.pools.health;
    const stamina = activeCharacter.pools.stamina;
    const mana = activeCharacter.pools.mana;

    if (healthDisplay) {
      healthDisplay.textContent = `${health.current} / ${health.max}`;
    }
    if (staminaDisplay) {
      staminaDisplay.textContent = `${stamina.current} / ${stamina.max}`;
    }
    if (manaDisplay) {
      manaDisplay.textContent = `${mana.current} / ${mana.max}`;
    }

    if (healthFill) {
      healthFill.style.width = `${clampPercent(health.current, health.max)}%`;
    }
    if (staminaFill) {
      staminaFill.style.width = `${clampPercent(stamina.current, stamina.max)}%`;
    }
    if (manaFill) {
      manaFill.style.width = `${clampPercent(mana.current, mana.max)}%`;
    }
  }

  function renderTabs() {
    const activeTab = gameState.ui.activeTab;

    tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === activeTab);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === activeTab);
    });
  }

  function renderStats() {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter || !activeCharacter.stats) return;

    const stats = activeCharacter.stats;

    if (statToHit) statToHit.textContent = stats.toHit;
    if (statEvasion) statEvasion.textContent = stats.evasion;
    if (statBlock) statBlock.textContent = stats.block;
    if (statDefense) statDefense.textContent = stats.defense;
    if (statAttackPower) statAttackPower.textContent = stats.attackPower;

    if (resistPhysicalBlunt) resistPhysicalBlunt.textContent = stats.resistPhysical.blunt;
    if (resistPhysicalPierce) resistPhysicalPierce.textContent = stats.resistPhysical.pierce;
    if (resistPhysicalSlash) resistPhysicalSlash.textContent = stats.resistPhysical.slash;

    if (resistElementalEarth) resistElementalEarth.textContent = stats.resistElemental.earth;
    if (resistElementalWater) resistElementalWater.textContent = stats.resistElemental.water;
    if (resistElementalWind) resistElementalWind.textContent = stats.resistElemental.wind;
    if (resistElementalFire) resistElementalFire.textContent = stats.resistElemental.fire;
    if (resistElementalLight) resistElementalLight.textContent = stats.resistElemental.light;
    if (resistElementalDark) resistElementalDark.textContent = stats.resistElemental.dark;
    if (resistElementalLife) resistElementalLife.textContent = stats.resistElemental.life;
    if (resistElementalDeath) resistElementalDeath.textContent = stats.resistElemental.death;

    if (potencyPhysicalBlunt) potencyPhysicalBlunt.textContent = stats.potencyPhysical.blunt;
    if (potencyPhysicalPierce) potencyPhysicalPierce.textContent = stats.potencyPhysical.pierce;
    if (potencyPhysicalSlash) potencyPhysicalSlash.textContent = stats.potencyPhysical.slash;

    if (potencyElementalEarth) potencyElementalEarth.textContent = stats.potencyElemental.earth;
    if (potencyElementalWater) potencyElementalWater.textContent = stats.potencyElemental.water;
    if (potencyElementalWind) potencyElementalWind.textContent = stats.potencyElemental.wind;
    if (potencyElementalFire) potencyElementalFire.textContent = stats.potencyElemental.fire;
    if (potencyElementalLight) potencyElementalLight.textContent = stats.potencyElemental.light;
    if (potencyElementalDark) potencyElementalDark.textContent = stats.potencyElemental.dark;
    if (potencyElementalLife) potencyElementalLife.textContent = stats.potencyElemental.life;
    if (potencyElementalDeath) potencyElementalDeath.textContent = stats.potencyElemental.death;
  }

  function updateLastSavedDisplay() {
    if (!lastSavedDisplay) return;

    const lastSaved = gameState.meta.lastSavedAt;

    if (!lastSaved) {
      lastSavedDisplay.textContent = "Last Saved: Never";
      return;
    }

    const date = new Date(lastSaved);
    const formatted = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    lastSavedDisplay.textContent = `Last Saved: ${formatted}`;
  }

  function renderAll() {
    renderPlayer();
    renderResources();
    renderPools();
    renderTabs();
    renderStats();
    renderLog();
    updateLastSavedDisplay();
  }

  function setActiveTab(tabName) {
    gameState.ui.activeTab = tabName;
    renderTabs();
    addLog(`Opened ${formatTabName(tabName)} tab.`);
  }

  function setCharacterName() {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter || !characterNameInput) return;

    const trimmedName = characterNameInput.value.trim();

    if (!trimmedName) {
      addLog("Character name cannot be empty.");
      characterNameInput.value = activeCharacter.name || "";
      return;
    }

    const oldName = activeCharacter.name;
    activeCharacter.name = trimmedName;

    renderPlayer();

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
    renderPlayer();
    addLog(activeCharacter.titles.prefix ? `Prefix title set to ${activeCharacter.titles.prefix}.` : "Prefix title cleared.");
  }

  function setCharacterTitlePostfix(postfixValue) {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter) return;

    activeCharacter.titles.postfix = postfixValue || "";
    renderPlayer();
    addLog(activeCharacter.titles.postfix ? `Post title set to ${activeCharacter.titles.postfix}.` : "Post title cleared.");
  }

  function saveGame({ showLogMessage = true } = {}) {
    try {
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
      const freshState = createDefaultGameState();
      const defaultCharacter = createDefaultCharacter();

      const loadedCharacters = {};
      const parsedCharacters = parsedSave.characters || {};

      Object.keys(parsedCharacters).forEach((characterId) => {
        const parsedCharacter = parsedCharacters[characterId] || {};

        loadedCharacters[characterId] = {
          ...defaultCharacter,
          ...parsedCharacter,
          titles: {
            ...defaultCharacter.titles,
            ...(parsedCharacter.titles || {})
          },
          resources: {
            ...defaultCharacter.resources,
            ...(parsedCharacter.resources || {})
          },
          pools: {
            health: {
              ...defaultCharacter.pools.health,
              ...(parsedCharacter.pools?.health || {})
            },
            stamina: {
              ...defaultCharacter.pools.stamina,
              ...(parsedCharacter.pools?.stamina || {})
            },
            mana: {
              ...defaultCharacter.pools.mana,
              ...(parsedCharacter.pools?.mana || {})
            }
          },
          stats: {
            ...defaultCharacter.stats,
            ...(parsedCharacter.stats || {}),
            resistPhysical: {
              ...defaultCharacter.stats.resistPhysical,
              ...(parsedCharacter.stats?.resistPhysical || {})
            },
            resistElemental: {
              ...defaultCharacter.stats.resistElemental,
              ...(parsedCharacter.stats?.resistElemental || {})
            },
            potencyPhysical: {
              ...defaultCharacter.stats.potencyPhysical,
              ...(parsedCharacter.stats?.potencyPhysical || {})
            },
            potencyElemental: {
              ...defaultCharacter.stats.potencyElemental,
              ...(parsedCharacter.stats?.potencyElemental || {})
            }
          }
        };
      });

      if (Object.keys(loadedCharacters).length === 0) {
        loadedCharacters[defaultCharacter.id] = defaultCharacter;
      }

      const proposedActiveCharacterId = parsedSave.activeCharacterId || defaultCharacter.id;
      const activeCharacterId = loadedCharacters[proposedActiveCharacterId]
        ? proposedActiveCharacterId
        : Object.keys(loadedCharacters)[0];

      gameState = {
        ...freshState,
        ...parsedSave,
        activeCharacterId,
        characters: loadedCharacters,
        ui: {
          ...freshState.ui,
          ...(parsedSave.ui || {})
        },
        log: Array.isArray(parsedSave.log) ? parsedSave.log : freshState.log,
        meta: {
          ...freshState.meta,
          ...(parsedSave.meta || {})
        }
      };

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
    gameState = createDefaultGameState();
    renderAll();
    addLog("Save wiped. New game started.");
  }

  function setupTabs() {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.dataset.tab;
        setActiveTab(tabName);
      });
    });
  }

  function setupButtons() {
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        saveGame();
      });
    }

    if (loadButton) {
      loadButton.addEventListener("click", () => {
        loadGame();
      });
    }

    if (wipeButton) {
      wipeButton.addEventListener("click", () => {
        wipeGame();
      });
    }

    if (setCharacterNameButton) {
      setCharacterNameButton.addEventListener("click", () => {
        setCharacterName();
      });
    }

    if (characterNameInput) {
      characterNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          setCharacterName();
        }
      });
    }

    if (titlePrefixSelect) {
      titlePrefixSelect.addEventListener("change", (event) => {
        setCharacterTitlePrefix(event.target.value);
      });
    }

    if (titlePostfixSelect) {
      titlePostfixSelect.addEventListener("change", (event) => {
        setCharacterTitlePostfix(event.target.value);
      });
    }
  }

  function setupAutoSave() {
    setInterval(() => {
      saveGame({ showLogMessage: false });
    }, AUTO_SAVE_INTERVAL_MS);

    window.addEventListener("beforeunload", () => {
      saveGame({ showLogMessage: false });
    });
  }

  function init() {
    setupTabs();
    setupButtons();
    setupAutoSave();

    const loadedExistingSave = loadGame({ showLogMessage: false });

    if (!loadedExistingSave) {
      renderAll();
      addLog("Started new game.");
      saveGame({ showLogMessage: false });
    } else {
      addLog("Save detected and loaded.");
      renderLog();
    }
  }

  init();

  window.skillKingdom = {
    getState: () => gameState,
    getActiveCharacter,
    saveGame,
    loadGame,
    wipeGame,
    setActiveTab,
    setCharacterNameByValue(name) {
      const activeCharacter = getActiveCharacter();
      if (!activeCharacter) return;

      activeCharacter.name = name;
      renderPlayer();
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
      renderResources();
      addLog(`Gained ${amount} ${resourceKey}.`);
    }
  };
});