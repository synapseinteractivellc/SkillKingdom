// render.js

(function () {
  let elements = null;

  function getStateApi() {
    return window.skillKingdomState;
  }

  function getMainApi() {
    return window.skillKingdomMain;
  }

  function getState() {
    return getStateApi()?.getState?.() || null;
  }

  function getActiveCharacter() {
    return getStateApi()?.getActiveCharacter?.() || null;
  }

  function getResourceEntries() {
    return getStateApi()?.getResourceEntries?.() || [];
  }

  function clampPercent(current, max) {
    return getStateApi()?.clampPercent?.(current, max) ?? 0;
  }

  function cacheDomElements() {
    elements = {
      tabButtons: document.querySelectorAll(".tab-btn"),
      tabPanels: document.querySelectorAll(".tab-panel"),
      actionLog: document.getElementById("action-log"),

      playerNameDisplay: document.getElementById("player-name-display"),
      lastSavedDisplay: document.getElementById("last-saved-display"),

      resourceList: document.getElementById("resource-list"),

      healthDisplay: document.getElementById("health-display"),
      staminaDisplay: document.getElementById("stamina-display"),
      manaDisplay: document.getElementById("mana-display"),

      healthFill: document.getElementById("health-fill"),
      staminaFill: document.getElementById("stamina-fill"),
      manaFill: document.getElementById("mana-fill"),

      characterNameInput: document.getElementById("character-name-input"),
      setCharacterNameButton: document.getElementById("set-character-name-btn"),

      titlePrefixSelect: document.getElementById("title-prefix-select"),
      titlePostfixSelect: document.getElementById("title-postfix-select"),

      statToHit: document.getElementById("stat-to-hit"),
      statEvasion: document.getElementById("stat-evasion"),
      statBlock: document.getElementById("stat-block"),
      statDefense: document.getElementById("stat-defense"),
      statAttackPower: document.getElementById("stat-attack-power"),

      resistPhysicalBlunt: document.getElementById("resist-physical-blunt"),
      resistPhysicalPierce: document.getElementById("resist-physical-pierce"),
      resistPhysicalSlash: document.getElementById("resist-physical-slash"),

      resistElementalEarth: document.getElementById("resist-elemental-earth"),
      resistElementalWater: document.getElementById("resist-elemental-water"),
      resistElementalWind: document.getElementById("resist-elemental-wind"),
      resistElementalFire: document.getElementById("resist-elemental-fire"),
      resistElementalLight: document.getElementById("resist-elemental-light"),
      resistElementalDark: document.getElementById("resist-elemental-dark"),
      resistElementalLife: document.getElementById("resist-elemental-life"),
      resistElementalDeath: document.getElementById("resist-elemental-death"),

      potencyPhysicalBlunt: document.getElementById("potency-physical-blunt"),
      potencyPhysicalPierce: document.getElementById("potency-physical-pierce"),
      potencyPhysicalSlash: document.getElementById("potency-physical-slash"),

      potencyElementalEarth: document.getElementById("potency-elemental-earth"),
      potencyElementalWater: document.getElementById("potency-elemental-water"),
      potencyElementalWind: document.getElementById("potency-elemental-wind"),
      potencyElementalFire: document.getElementById("potency-elemental-fire"),
      potencyElementalLight: document.getElementById("potency-elemental-light"),
      potencyElementalDark: document.getElementById("potency-elemental-dark"),
      potencyElementalLife: document.getElementById("potency-elemental-life"),
      potencyElementalDeath: document.getElementById("potency-elemental-death"),

      actionStatusPanel: document.getElementById("action-status-panel"),
      restButton: document.getElementById("rest-btn"),
      gatherWoodButton: document.getElementById("gather-wood-btn"),
      mineCopperButton: document.getElementById("mine-copper-btn"),
      stopActionButton: document.getElementById("stop-action-btn")
    };

    return elements;
  }

  function getElements() {
    return elements || cacheDomElements();
  }

  function formatTabName(tabName) {
    if (!tabName) return "";
    return tabName.charAt(0).toUpperCase() + tabName.slice(1);
  }

  function formatSeconds(ms) {
    return (Math.max(0, ms) / 1000).toFixed(1);
  }

  function getActionState() {
    const state = getState();
    return state?.actionState || null;
  }

  function getActiveAction() {
    return window.skillKingdomActions?.getActiveAction?.() || null;
  }

  function getActionProgressPercent() {
    const actionState = getActionState();

    if (!actionState?.isRunning || !actionState.startedAt || !actionState.endsAt) {
      return 0;
    }

    const total = actionState.endsAt - actionState.startedAt;
    const elapsed = Date.now() - actionState.startedAt;

    if (total <= 0) return 0;

    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  }

  function renderLog() {
    const { actionLog } = getElements();
    const state = getState();

    if (!actionLog || !state) return;

    actionLog.innerHTML = "";

    state.log.forEach((message) => {
      const entry = document.createElement("div");
      entry.className = "log-entry";
      entry.textContent = message;
      actionLog.appendChild(entry);
    });
  }

  function renderPlayer() {
    const { playerNameDisplay, characterNameInput, titlePrefixSelect, titlePostfixSelect } = getElements();
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
    const { resourceList } = getElements();
    const activeCharacter = getActiveCharacter();

    if (!resourceList || !activeCharacter) return;

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
    const {
      healthDisplay,
      staminaDisplay,
      manaDisplay,
      healthFill,
      staminaFill,
      manaFill
    } = getElements();

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
    const { tabButtons, tabPanels } = getElements();
    const state = getState();

    if (!state) return;

    const activeTab = state.ui.activeTab;

    tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === activeTab);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === activeTab);
    });
  }

  function renderStats() {
    const activeCharacter = getActiveCharacter();
    if (!activeCharacter?.stats) return;

    const stats = activeCharacter.stats;
    const el = getElements();

    if (el.statToHit) el.statToHit.textContent = stats.toHit;
    if (el.statEvasion) el.statEvasion.textContent = stats.evasion;
    if (el.statBlock) el.statBlock.textContent = stats.block;
    if (el.statDefense) el.statDefense.textContent = stats.defense;
    if (el.statAttackPower) el.statAttackPower.textContent = stats.attackPower;

    if (el.resistPhysicalBlunt) el.resistPhysicalBlunt.textContent = stats.resistPhysical.blunt;
    if (el.resistPhysicalPierce) el.resistPhysicalPierce.textContent = stats.resistPhysical.pierce;
    if (el.resistPhysicalSlash) el.resistPhysicalSlash.textContent = stats.resistPhysical.slash;

    if (el.resistElementalEarth) el.resistElementalEarth.textContent = stats.resistElemental.earth;
    if (el.resistElementalWater) el.resistElementalWater.textContent = stats.resistElemental.water;
    if (el.resistElementalWind) el.resistElementalWind.textContent = stats.resistElemental.wind;
    if (el.resistElementalFire) el.resistElementalFire.textContent = stats.resistElemental.fire;
    if (el.resistElementalLight) el.resistElementalLight.textContent = stats.resistElemental.light;
    if (el.resistElementalDark) el.resistElementalDark.textContent = stats.resistElemental.dark;
    if (el.resistElementalLife) el.resistElementalLife.textContent = stats.resistElemental.life;
    if (el.resistElementalDeath) el.resistElementalDeath.textContent = stats.resistElemental.death;

    if (el.potencyPhysicalBlunt) el.potencyPhysicalBlunt.textContent = stats.potencyPhysical.blunt;
    if (el.potencyPhysicalPierce) el.potencyPhysicalPierce.textContent = stats.potencyPhysical.pierce;
    if (el.potencyPhysicalSlash) el.potencyPhysicalSlash.textContent = stats.potencyPhysical.slash;

    if (el.potencyElementalEarth) el.potencyElementalEarth.textContent = stats.potencyElemental.earth;
    if (el.potencyElementalWater) el.potencyElementalWater.textContent = stats.potencyElemental.water;
    if (el.potencyElementalWind) el.potencyElementalWind.textContent = stats.potencyElemental.wind;
    if (el.potencyElementalFire) el.potencyElementalFire.textContent = stats.potencyElemental.fire;
    if (el.potencyElementalLight) el.potencyElementalLight.textContent = stats.potencyElemental.light;
    if (el.potencyElementalDark) el.potencyElementalDark.textContent = stats.potencyElemental.dark;
    if (el.potencyElementalLife) el.potencyElementalLife.textContent = stats.potencyElemental.life;
    if (el.potencyElementalDeath) el.potencyElementalDeath.textContent = stats.potencyElemental.death;
  }

  function updateLastSavedDisplay() {
    const { lastSavedDisplay } = getElements();
    const state = getState();

    if (!lastSavedDisplay || !state) return;

    const lastSaved = state.meta.lastSavedAt;

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

  function renderActionStatusPanel() {
    const { actionStatusPanel } = getElements();

    if (!actionStatusPanel) return;

    const actionState = getActionState();
    const activeAction = getActiveAction();

    if (!actionState?.isRunning || !activeAction) {
      actionStatusPanel.innerHTML = `
        <div class="action-status-card">
          <div class="action-status-row">
            <span class="action-status-label">Current Action</span>
            <span class="action-status-value">None</span>
          </div>
        </div>
      `;
      return;
    }

    const remainingMs = actionState.endsAt - Date.now();
    const progressPercent = getActionProgressPercent();

    let detailText = "No effect";
    let rewardLabel = "Effect";

    if (activeAction.handler === "resourceGain" && activeAction.rewards) {
      rewardLabel = "Reward";
      detailText = Object.entries(activeAction.rewards)
        .map(([key, value]) => `+${value} ${key}`)
        .join(", ");
    } else if (activeAction.handler === "rest") {
      rewardLabel = "Effect";
      detailText = "+1 Health, +1 Stamina, +1 Mana";
    }

    actionStatusPanel.innerHTML = `
      <div class="action-status-card">
        <div class="action-status-row">
          <span class="action-status-label">Current Action</span>
          <span class="action-status-value">${activeAction.label}</span>
        </div>

        <div class="action-status-row">
          <span class="action-status-label">Time Remaining</span>
          <span class="action-status-value">${formatSeconds(remainingMs)}s</span>
        </div>

        <div class="action-progress-bar">
          <div class="action-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="action-status-meta">
          Cost: ${activeAction.staminaCost} Stamina
          <span class="action-status-separator">|</span>
          ${rewardLabel}: ${detailText}
        </div>
      </div>
    `;
  }

  function updateActionButtonStates() {
    const {
      gatherWoodButton,
      mineCopperButton,
      restButton,
      stopActionButton
    } = getElements();

    const activeCharacter = getActiveCharacter();
    const actionState = getActionState();

    const isRunning = !!actionState?.isRunning;
    const stamina = activeCharacter?.pools?.stamina?.current ?? 0;

    const health = activeCharacter?.pools?.health;
    const staminaPool = activeCharacter?.pools?.stamina;
    const mana = activeCharacter?.pools?.mana;

    const canRest = !!(
      health &&
      staminaPool &&
      mana &&
      (
        health.current < health.max ||
        staminaPool.current < staminaPool.max ||
        mana.current < mana.max
      )
    );

    if (gatherWoodButton) {
      gatherWoodButton.disabled = isRunning || stamina < 1;
    }

    if (mineCopperButton) {
      mineCopperButton.disabled = isRunning || stamina < 2;
    }

    if (restButton) {
      restButton.disabled = isRunning || !canRest;
    }

    if (stopActionButton) {
      stopActionButton.disabled = !isRunning;
    }
  }

  function renderActionUI() {
    renderActionStatusPanel();
    updateActionButtonStates();
  }

  function renderAll() {
    renderPlayer();
    renderResources();
    renderPools();
    renderTabs();
    renderStats();
    renderLog();
    updateLastSavedDisplay();
    renderActionUI();

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function wireTabs() {
    const { tabButtons } = getElements();

    tabButtons.forEach((button) => {
      if (button.dataset.wired === "true") return;

      button.addEventListener("click", () => {
        getMainApi()?.setActiveTab?.(button.dataset.tab);
      });

      button.dataset.wired = "true";
    });
  }

  function wireCharacterInputs() {
    const {
      characterNameInput,
      setCharacterNameButton,
      titlePrefixSelect,
      titlePostfixSelect
    } = getElements();

    if (setCharacterNameButton && setCharacterNameButton.dataset.wired !== "true") {
      setCharacterNameButton.addEventListener("click", () => {
        getMainApi()?.setCharacterNameFromInput?.();
      });
      setCharacterNameButton.dataset.wired = "true";
    }

    if (characterNameInput && characterNameInput.dataset.wired !== "true") {
      characterNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          getMainApi()?.setCharacterNameFromInput?.();
        }
      });
      characterNameInput.dataset.wired = "true";
    }

    if (titlePrefixSelect && titlePrefixSelect.dataset.wired !== "true") {
      titlePrefixSelect.addEventListener("change", (event) => {
        getMainApi()?.setCharacterTitlePrefix?.(event.target.value);
      });
      titlePrefixSelect.dataset.wired = "true";
    }

    if (titlePostfixSelect && titlePostfixSelect.dataset.wired !== "true") {
      titlePostfixSelect.addEventListener("change", (event) => {
        getMainApi()?.setCharacterTitlePostfix?.(event.target.value);
      });
      titlePostfixSelect.dataset.wired = "true";
    }
  }

  function wireActionButtons() {
    const {
      gatherWoodButton,
      mineCopperButton,
      restButton,
      stopActionButton
    } = getElements();

    if (gatherWoodButton && gatherWoodButton.dataset.wired !== "true") {
      gatherWoodButton.addEventListener("click", () => {
        window.skillKingdomActions?.startContinuousAction?.("gatherWood");
      });
      gatherWoodButton.dataset.wired = "true";
    }

    if (mineCopperButton && mineCopperButton.dataset.wired !== "true") {
      mineCopperButton.addEventListener("click", () => {
        window.skillKingdomActions?.startContinuousAction?.("mineCopper");
      });
      mineCopperButton.dataset.wired = "true";
    }

    if (restButton && restButton.dataset.wired !== "true") {
      restButton.addEventListener("click", () => {
        window.skillKingdomActions?.startContinuousAction?.("rest");
      });
      restButton.dataset.wired = "true";
    }

    if (stopActionButton && stopActionButton.dataset.wired !== "true") {
      stopActionButton.addEventListener("click", () => {
        window.skillKingdomActions?.stopContinuousAction?.();
      });
      stopActionButton.dataset.wired = "true";
    }
  }

  function initUI() {
    cacheDomElements();
    wireTabs();
    wireCharacterInputs();
    wireActionButtons();
  }

  window.skillKingdomRender = {
    initUI,
    renderAll,
    renderLog,
    renderPlayer,
    renderResources,
    renderPools,
    renderTabs,
    renderStats,
    updateLastSavedDisplay,
    renderActionUI,
    formatTabName,
    getElements
  };
})();