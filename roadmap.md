# SkillKingdom Roadmap

## 🧱 Phase 1 — Foundation (Current Focus)

### Core Systems

* [ ] Game state structure (player, stats, resources)
* [ ] Save / Load system
* [ ] Basic UI layout

  * [ ] Header (name, class, level)
  * [ ] Main content area
  * [ ] Side panels (resources, vitals)

---

### Character Creation

* [ ] Name input field
* [ ] Class selection (Warrior, Mage, Hunter)
* [ ] Profession selection
* [ ] Initialize player at Level 0

---

## ⚔️ Phase 2 — Combat System

* [ ] Basic encounter system
* [ ] Enemy templates
* [ ] Combat loop (auto + optional interaction)
* [ ] Health / damage calculations
* [ ] Win / loss conditions

---

## 🛠️ Phase 3 — Profession System

* [ ] Profession leveling system
* [ ] Resource gathering actions
* [ ] Crafting system (basic recipes)
* [ ] Resource tracking & display

---

## 🌲 Phase 4 — World Interaction

* [ ] Exploration system
* [ ] Random events
* [ ] Resource discovery
* [ ] Unlockable areas

---

## 📈 Phase 5 — Progression Expansion

* [ ] Skill unlocks per class
* [ ] Profession upgrades
* [ ] Efficiency scaling
* [ ] Level-based bonuses

---

## 🔄 Phase 6 — Idle Systems

* [ ] Background resource generation
* [ ] Automated actions
* [ ] Time-based rewards

---

## 🧠 Phase 7 — Advanced Systems

* [ ] Class evolution paths

  * Warrior → Knight / Berserker
  * Mage → Elementalist / Sorcerer
  * Hunter → Ranger / Assassin

* [ ] Profession specialization

  * Smith → Weaponsmith / Armorsmith
  * Alchemist → Potion Master / Toxicologist

---

## 💰 Phase 8 — Economy & Crafting Depth

* [ ] Multi-resource crafting chains
* [ ] Item rarity tiers
* [ ] Trade system / vendors
* [ ] Gear enhancements (Runes vs Enchantments)

---

## 🧩 Phase 9 — UI/UX Improvements

* [ ] Dynamic resource display
* [ ] Better layout scaling
* [ ] Tooltips and info panels
* [ ] Visual feedback for actions

---

## 🚀 Phase 10 — Polish & Expansion

* [ ] Balance pass
* [ ] Content expansion (new areas, enemies)
* [ ] Additional professions
* [ ] Performance optimization

---

## 🧭 Long-Term Vision

* Fully idle-compatible gameplay
* Deep progression systems
* Modular expansion (easy to add content)
* Hybrid active + idle playstyle

---

## 📝 Notes

* Keep systems modular (state.js, actions.js, combat.js, etc.)
* Avoid mixing UI with logic
* Build scalable systems early to prevent refactoring later

---

## 🔥 Next Immediate Step

👉 Implement **Character Creation Screen**

* Name input
* Class selection
* Profession selection
* Confirm → Initialize game state
