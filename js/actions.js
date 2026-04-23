// actions.js

const CONTINUOUS_ACTIONS = {
  rest: {
    id: "rest",
    label: "Rest",
    durationMs: 1000,
    staminaCost: 0,
    handler: "rest"
  },

  gatherWood: {
    id: "gatherWood",
    label: "Gather Wood",
    durationMs: 2000,
    staminaCost: 1,
    handler: "resourceGain",
    rewards: {
      wood: 1
    },
    completionLog: "You gather 1 Wood."
  },

  mineCopper: {
    id: "mineCopper",
    label: "Mine Copper Ore",
    durationMs: 4000,
    staminaCost: 2,
    handler: "resourceGain",
    rewards: {
      copper: 2
    },
    completionLog: "You mine 2 Copper Ore."
  }
};

function getGameState() {
  return window.skillKingdom?.getState?.() || null;
}

function getActiveCharacter() {
  return window.skillKingdom?.getActiveCharacter?.() || null;
}

function renderAll() {
  window.skillKingdom?.renderAll?.();
}

function addLog(message) {
  window.skillKingdom?.addLog?.(message);
}

function ensureActionState() {
  const gameState = getGameState();
  if (!gameState) return null;

  if (!gameState.actionState && window.skillKingdomState?.ensureActionState) {
    window.skillKingdomState.ensureActionState(gameState);
  }

  return gameState.actionState || null;
}

function getActionById(actionId) {
  return CONTINUOUS_ACTIONS[actionId] || null;
}

function hasEnoughStamina(character, action) {
  if (!character || !action) return false;
  return character.pools.stamina.current >= action.staminaCost;
}

function giveRewards(character, rewards) {
  if (!character || !rewards) return;

  Object.entries(rewards).forEach(([resourceKey, amount]) => {
    if (!(resourceKey in character.resources)) {
      character.resources[resourceKey] = 0;
    }

    character.resources[resourceKey] += amount;
  });
}

function spendStamina(character, amount) {
  if (!character) return;
  character.pools.stamina.current = Math.max(0, character.pools.stamina.current - amount);
}

const ACTION_HANDLERS = {
  resourceGain(activeCharacter, action) {
    if (!action.rewards) {
      return {
        shouldContinue: false,
        log: `No rewards are configured for ${action.label.toLowerCase()}.`
      };
    }

    spendStamina(activeCharacter, action.staminaCost);
    giveRewards(activeCharacter, action.rewards);

    return {
      shouldContinue: hasEnoughStamina(activeCharacter, action),
      log: action.completionLog || null
    };
  },

  rest(activeCharacter) {
    const health = activeCharacter.pools.health;
    const stamina = activeCharacter.pools.stamina;
    const mana = activeCharacter.pools.mana;

    let gainedSomething = false;

    if (health.current < health.max) {
      health.current = Math.min(health.max, health.current + 1);
      gainedSomething = true;
    }

    if (stamina.current < stamina.max) {
      stamina.current = Math.min(stamina.max, stamina.current + 1);
      gainedSomething = true;
    }

    if (mana.current < mana.max) {
      mana.current = Math.min(mana.max, mana.current + 1);
      gainedSomething = true;
    }

    if (!gainedSomething) {
      return {
        shouldContinue: false,
        log: "You are fully rested."
      };
    }

    const allFull =
      health.current >= health.max &&
      stamina.current >= stamina.max &&
      mana.current >= mana.max;

    return {
      shouldContinue: !allFull,
      log: allFull ? "You finish resting feeling refreshed." : null
    };
  }
};

function startContinuousAction(actionId) {
  const gameState = getGameState();
  const activeCharacter = getActiveCharacter();
  const actionState = ensureActionState();
  const action = getActionById(actionId);

  if (!gameState || !activeCharacter || !actionState || !action) return;

  if (actionState.isRunning) {
    addLog(`Already performing ${getActionById(actionState.currentActionId)?.label || "an action"}.`);
    return;
  }

  if (action.staminaCost > 0 && !hasEnoughStamina(activeCharacter, action)) {
    addLog(`Not enough stamina to ${action.label.toLowerCase()}.`);
    return;
  }

  const now = Date.now();

  actionState.currentActionId = action.id;
  actionState.startedAt = now;
  actionState.endsAt = now + action.durationMs;
  actionState.isRunning = true;

  addLog(`${action.label} started.`);
  renderAll();
}

function stopContinuousAction(showLog = true) {
  const actionState = ensureActionState();
  if (!actionState) return;

  const currentAction = getActionById(actionState.currentActionId);

  actionState.currentActionId = null;
  actionState.startedAt = null;
  actionState.endsAt = null;
  actionState.isRunning = false;

  if (showLog && currentAction) {
    addLog(`${currentAction.label} stopped.`);
  }

  renderAll();
}

function restartContinuousAction(action) {
  const actionState = ensureActionState();
  if (!actionState || !action) return;

  const now = Date.now();

  actionState.currentActionId = action.id;
  actionState.startedAt = now;
  actionState.endsAt = now + action.durationMs;
  actionState.isRunning = true;
}

function resolveContinuousAction() {
  const activeCharacter = getActiveCharacter();
  const actionState = ensureActionState();

  if (!activeCharacter || !actionState || !actionState.isRunning) {
    return;
  }

  const action = getActionById(actionState.currentActionId);

  if (!action) {
    stopContinuousAction(false);
    return;
  }

  if (action.staminaCost > 0 && !hasEnoughStamina(activeCharacter, action)) {
    addLog(`You are too tired to continue ${action.label.toLowerCase()}.`);
    stopContinuousAction(false);
    return;
  }

  const handler = ACTION_HANDLERS[action.handler];

  if (!handler) {
    addLog(`No handler found for ${action.label.toLowerCase()}.`);
    stopContinuousAction(false);
    return;
  }

  const result = handler(activeCharacter, action);

  if (result?.log) {
    addLog(result.log);
  }

  if (result?.shouldContinue) {
    restartContinuousAction(action);
  } else {
    stopContinuousAction(false);
  }

  renderAll();
}

function updateContinuousAction() {
  const actionState = ensureActionState();
  if (!actionState || !actionState.isRunning) return;

  if (Date.now() >= actionState.endsAt) {
    resolveContinuousAction();
  } else {
    const activeTab = window.skillKingdom?.getState?.()?.ui?.activeTab;
    if (activeTab === "actions") {
      renderAll();
    }
  }
}

function getActiveAction() {
  const actionState = ensureActionState();
  if (!actionState || !actionState.isRunning || !actionState.currentActionId) {
    return null;
  }

  return getActionById(actionState.currentActionId);
}

window.skillKingdomActions = {
  CONTINUOUS_ACTIONS,
  startContinuousAction,
  stopContinuousAction,
  updateContinuousAction,
  getActiveAction
};