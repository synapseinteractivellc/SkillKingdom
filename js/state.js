// state.js

(function () {
  function createDefaultActionState() {
    return {
      currentActionId: null,
      startedAt: null,
      endsAt: null,
      isRunning: false
    };
  }

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
      },
      actionState: createDefaultActionState()
    };
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

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  let gameState = createDefaultGameState();

  function getState() {
    return gameState;
  }

  function setState(newState) {
    gameState = newState;
    return gameState;
  }

  function resetState() {
    gameState = createDefaultGameState();
    return gameState;
  }

  function getActiveCharacter(state = gameState) {
    if (!state || !state.characters) return null;
    return state.characters[state.activeCharacterId] || null;
  }

  function ensureActionState(state = gameState) {
    if (!state.actionState) {
      state.actionState = createDefaultActionState();
    }

    return state.actionState;
  }

  function createMergedCharacter(parsedCharacter = {}) {
    const defaultCharacter = createDefaultCharacter();

    return {
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
  }

  function createMergedGameState(parsedSave = {}) {
    const freshState = createDefaultGameState();
    const defaultCharacter = createDefaultCharacter();

    const loadedCharacters = {};
    const parsedCharacters = parsedSave.characters || {};

    Object.keys(parsedCharacters).forEach((characterId) => {
      loadedCharacters[characterId] = createMergedCharacter(parsedCharacters[characterId]);
    });

    if (Object.keys(loadedCharacters).length === 0) {
      loadedCharacters[defaultCharacter.id] = defaultCharacter;
    }

    const proposedActiveCharacterId = parsedSave.activeCharacterId || defaultCharacter.id;
    const activeCharacterId = loadedCharacters[proposedActiveCharacterId]
      ? proposedActiveCharacterId
      : Object.keys(loadedCharacters)[0];

    return {
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
      },
      actionState: {
        ...freshState.actionState,
        ...(parsedSave.actionState || {})
      }
    };
  }

  window.skillKingdomState = {
    createDefaultActionState,
    createDefaultCharacter,
    createDefaultGameState,
    createMergedCharacter,
    createMergedGameState,
    getResourceEntries,
    clampPercent,
    deepClone,
    getState,
    setState,
    resetState,
    getActiveCharacter,
    ensureActionState
  };
})();