"use strict";

const translations = [
  {
    title: "Game408 · From clues to actions",
    count: (scenes, decisions) => `${scenes} games · ${decisions} decisions`,
    step: (number, total) => `Decision ${number} of ${total}`,
    current: (id) => `Before the action · Record ${id}`,
    corrected: (time) => `Before the action · ${time}`,
    following: (time) => `After the action · ${time}`,
    showBefore: "Before",
    showAfter: "Follow-up",
    correct: "Same move as the recording.",
    wrong: "The recording took a different action. Review the scene or try another move.",
    revealed: "Recorded action",
  },
  {
    title: "Game408 · 从线索到行动",
    count: (scenes, decisions) => `${scenes} 款游戏 · ${decisions} 个决策`,
    step: (number, total) => `决策 ${number} / ${total}`,
    current: (id) => `动作前 · 记录 ${id}`,
    corrected: (time) => `动作前 · ${time}`,
    following: (time) => `动作后 · ${time}`,
    showBefore: "看动作前",
    showAfter: "看后续画面",
    correct: "和录屏里的动作一致。",
    wrong: "录屏里采取了另一步。可以再看看画面和线索，或试试其他动作。",
    revealed: "录屏动作",
  },
];

const element = (id) => document.getElementById(id);
const picker = element("case-picker");
const caseCount = element("case-count");
const player = element("player");
const caseGame = element("case-game");
const caseSteam = element("case-steam");
const caseSource = element("case-source");
const caseTitle = element("case-title");
const caseGoal = element("case-goal");
const stepPicker = element("step-picker");
const frame = element("frame");
const frameLabel = element("frame-label");
const frameLink = element("frame-link");
const toggleFrame = element("toggle-frame");
const observation = element("observation");
const memory = element("memory");
const memoryText = element("memory-text");
const question = element("question");
const choices = element("choices");
const feedback = element("feedback");
const explanation = element("case-explanation");
const caseReason = element("case-reason");
const caseResult = element("case-result");
const reveal = element("reveal");
const next = element("next");
const replay = element("replay");
const languageButton = element("language");

const translatable = [
  ["data-zh", "textContent"],
  ["data-zh-alt", "alt"],
  ["data-zh-aria", "ariaLabel"],
  ["data-zh-href", "href"],
].flatMap(([attribute, field]) =>
  [...document.querySelectorAll(`[${attribute}]`)].map((node) => ({
    node,
    field,
    values: [node[field], node.getAttribute(attribute)],
  }))
);

let language = 0;
let caseIndex = 0;
let displayAfter = false;
const progress = gameCases.map(() => ({ stepIndex: 0, attempts: new Map() }));
const totalDecisions = gameCases.reduce((count, gameCase) => count + gameCase.steps.length, 0);

try {
  if (localStorage.getItem("game408-language") === "zh-CN") language = 1;
} catch {
  // The language switch also works without local storage.
}

function active() {
  const gameCase = gameCases[caseIndex];
  const state = progress[caseIndex];
  return { gameCase, state, step: gameCase.steps[state.stepIndex], attempt: state.attempts.get(state.stepIndex) };
}

function framePath(gameId, record) {
  return `assets/cases/${gameId}-${record}.webp`;
}

function videoTime(seconds) {
  const tenths = Math.round(seconds * 10);
  const minutes = Math.floor(tenths / 600);
  const remainder = ((tenths % 600) / 10).toFixed(1).padStart(4, "0");
  return `${minutes}:${remainder}`;
}

function buttonWithLabel(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

const caseButtons = gameCases.map((gameCase, index) => {
  const button = buttonWithLabel("case-option", "");
  const image = document.createElement("img");
  image.src = `assets/steam/${gameCase.id}.webp`;
  image.alt = "";
  image.width = 600;
  image.height = 900;
  image.loading = "lazy";
  button.append(image, document.createElement("span"));
  button.addEventListener("click", () => {
    if (caseIndex === index) {
      caseTitle.focus();
      return;
    }
    caseIndex = index;
    changeDecision(progress[index].stepIndex, caseTitle);
  });
  return button;
});
picker.append(...caseButtons);

function renderFrame() {
  const { gameCase, step } = active();
  const copy = translations[language];
  const record = displayAfter ? `${step.id}-after` : step.id;
  const beforeLabel = step.beforeTime ? copy.corrected(videoTime(step.beforeTime)) : copy.current(step.id);
  const stateLabel = displayAfter ? copy.following(videoTime(step.afterTime)) : beforeLabel;
  const path = framePath(gameCase.id, record);
  if (frame.getAttribute("src") !== path) frame.src = path;
  frame.alt = `${gameCase.game[language]} · ${stateLabel}`;
  frameLink.href = path;
  frameLabel.textContent = stateLabel;
  toggleFrame.textContent = displayAfter ? copy.showBefore : copy.showAfter;
}

function renderOutcome() {
  const { state, step, gameCase, attempt } = active();
  const copy = translations[language];
  const matched = attempt?.selected === step.answer;
  const shown = matched || attempt?.revealed;
  const incorrect = Boolean(attempt && !shown);
  for (const [index, button] of [...choices.children].entries()) {
    button.setAttribute("aria-pressed", String(shown ? index === step.answer : index === attempt?.selected));
    button.dataset.state = shown && index === step.answer ? "right" : incorrect && index === attempt.selected ? "wrong" : "";
    button.setAttribute("aria-disabled", String(Boolean(shown)));
  }
  if (shown) {
    const prefix = matched ? copy.correct : `${copy.revealed}${language ? "：" : ": "}${step.options[step.answer][language]}${language ? "。" : "."}`;
    feedback.textContent = prefix;
  } else {
    feedback.textContent = incorrect ? copy.wrong : "";
  }
  feedback.dataset.state = shown ? "right" : incorrect ? "wrong" : "";
  explanation.hidden = !shown;
  caseReason.textContent = shown ? step.reason[language] : "";
  caseResult.textContent = shown ? step.result[language] : "";
  reveal.hidden = Boolean(shown);
  toggleFrame.hidden = !shown;
  const last = state.stepIndex === gameCase.steps.length - 1;
  next.hidden = !shown || last;
  replay.hidden = !shown || !last;
  renderFrame();
}

function choose(index) {
  const { step, state, attempt } = active();
  if (attempt?.selected === step.answer || attempt?.revealed) return;
  state.attempts.set(state.stepIndex, { selected: index });
  displayAfter = index === step.answer;
  renderOutcome();
}

function renderDecision() {
  const { gameCase, state, step } = active();
  const copy = translations[language];
  caseTitle.textContent = gameCase.title[language];
  caseGame.textContent = gameCase.game[language];
  caseSteam.href = `https://store.steampowered.com/app/${gameCase.steamAppId}/`;
  caseSource.hidden = !gameCase.source;
  if (gameCase.source) caseSource.href = gameCase.source;
  caseGoal.textContent = gameCase.goal[language];
  observation.textContent = step.observation[language];
  memoryText.textContent = step.memory[language];
  const steps = gameCase.steps.map((_, index) => {
    const button = buttonWithLabel("step-button", String(index + 1));
    button.setAttribute("aria-label", copy.step(index + 1, gameCase.steps.length));
    button.setAttribute("aria-pressed", String(index === state.stepIndex));
    button.addEventListener("click", () => changeDecision(index, question));
    return button;
  });
  stepPicker.replaceChildren(...steps);
  const options = step.options.map((label, index) => {
    const button = buttonWithLabel("choice", "");
    const key = document.createElement("span");
    const description = document.createElement("span");
    key.textContent = "ABC"[index];
    key.setAttribute("aria-hidden", "true");
    description.textContent = label[language];
    button.append(key, description);
    button.addEventListener("click", () => choose(index));
    return button;
  });
  choices.replaceChildren(...options);
  for (const [index, button] of caseButtons.entries()) {
    button.lastElementChild.textContent = gameCases[index].game[language];
    button.setAttribute("aria-pressed", String(index === caseIndex));
  }
  renderOutcome();
}

function changeDecision(index, focusTarget) {
  progress[caseIndex].stepIndex = index;
  const { step, attempt } = active();
  displayAfter = Boolean(attempt?.revealed || attempt?.selected === step.answer);
  memory.open = false;
  renderDecision();
  focusTarget.focus();
}

function renderLanguage() {
  document.documentElement.lang = language ? "zh-CN" : "en";
  document.title = translations[language].title;
  for (const { node, field, values } of translatable) node[field] = values[language];
  languageButton.textContent = language ? "English" : "中文";
  languageButton.lang = language ? "en" : "zh-CN";
  languageButton.setAttribute("aria-label", language ? "Switch to English" : "切换为中文");
  caseCount.textContent = translations[language].count(gameCases.length, totalDecisions);
  renderDecision();
}

reveal.addEventListener("click", () => {
  const { state, gameCase } = active();
  state.attempts.set(state.stepIndex, { revealed: true });
  displayAfter = true;
  renderOutcome();
  const last = state.stepIndex === gameCase.steps.length - 1;
  (last ? replay : next).focus();
});

toggleFrame.addEventListener("click", () => {
  displayAfter = !displayAfter;
  renderFrame();
});

next.addEventListener("click", () => changeDecision(progress[caseIndex].stepIndex + 1, question));
replay.addEventListener("click", () => {
  progress[caseIndex].attempts.clear();
  changeDecision(0, question);
});

languageButton.addEventListener("click", () => {
  language = 1 - language;
  try {
    localStorage.setItem("game408-language", language ? "zh-CN" : "en");
  } catch {
    // Keep the current preference for the rest of this visit.
  }
  renderLanguage();
});

renderLanguage();
languageButton.hidden = false;
caseCount.hidden = false;
player.hidden = false;
