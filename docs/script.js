"use strict";

const translations = {
  en: {
    title: "Game408 | 2D Game Reasoning Arena",
    progress: (count, total) => `${count} of ${total} objects inspected`,
    empty: "Select an object in the room to start investigating.",
    separator: ": ",
    incorrect: "The cabinet stays locked. Check the order in the shift note.",
    solved: "The cabinet opens. You recovered the missing inspection file.",
    clues: {
      note: ["Shift note", "Enter the room numbers in the order they were inspected today, from first to last."],
      ledger: ["Ledger", "08:10 West Room · 08:25 North Room · 08:40 East Room"],
      lock: ["Cabinet", "The labels read North 4, East 8, West 2. The lock takes three digits."],
    },
  },
  "zh-CN": {
    title: "Game408 | 二维游戏推理竞技台",
    progress: (count, total) => `已检查 ${count} / ${total} 个物件`,
    empty: "选择场景中的物件开始调查。",
    separator: "：",
    incorrect: "档案柜仍锁着。再确认一下值班便签上写的顺序。",
    solved: "档案柜打开了。你找到了遗失的巡检文件。",
    clues: {
      note: ["值班便签", "按今天巡检的先后顺序输入房间编号。"],
      ledger: ["巡检台账", "08:10 西室 · 08:25 北室 · 08:40 东室"],
      lock: ["档案柜", "标签写着北室 4、东室 8、西室 2。密码锁需要三个数字。"],
    },
  },
};

const languageButton = document.querySelector("#language");
const clueButtons = [...document.querySelectorAll("[data-clue]")];
const progress = document.querySelector("#clue-progress");
const notes = document.querySelector("#notes");
const puzzle = document.querySelector("#puzzle");
const code = document.querySelector("#code");
const unlock = document.querySelector("#unlock");
const feedback = document.querySelector("#feedback");
const reset = document.querySelector("#reset");

const translatedFields = [
  ["data-zh", "textContent"],
  ["data-zh-alt", "alt"],
  ["data-zh-aria", "ariaLabel"],
].flatMap(([attribute, field]) =>
  [...document.querySelectorAll(`[${attribute}]`)].map((element) => ({
    element,
    field,
    en: element[field],
    "zh-CN": element.getAttribute(attribute),
  }))
);

const inspected = new Set();
let result = null;
let language = "en";
try {
  if (localStorage.getItem("game408-language") === "zh-CN") language = "zh-CN";
} catch {
  // The language switch remains available when storage is blocked.
}

function renderEvidence() {
  const copy = translations[language];
  progress.textContent = copy.progress(inspected.size, clueButtons.length);
  const entries = [...inspected].map((clue) => {
    const [title, description] = copy.clues[clue];
    const entry = document.createElement("li");
    const label = document.createElement("strong");
    label.textContent = title + copy.separator;
    entry.append(label, description);
    return entry;
  });
  if (!entries.length) {
    const entry = document.createElement("li");
    entry.textContent = copy.empty;
    entries.push(entry);
  }
  notes.replaceChildren(...entries);
}

function renderControls() {
  const solved = result === "solved";
  code.disabled = solved;
  unlock.disabled = solved;
  reset.disabled = inspected.size === 0 && result === null && code.value === "";
  feedback.textContent = result ? translations[language][result] : "";
  feedback.dataset.state = solved ? "success" : "";
}

function renderLanguage() {
  const english = language === "en";
  document.documentElement.lang = language;
  document.title = translations[language].title;
  for (const translation of translatedFields) {
    translation.element[translation.field] = translation[language];
  }
  languageButton.textContent = english ? "中文" : "English";
  languageButton.lang = english ? "zh-CN" : "en";
  languageButton.setAttribute("aria-label", english ? "切换为中文" : "Switch to English");
  renderEvidence();
  renderControls();
}

for (const button of clueButtons) {
  button.disabled = false;
  button.addEventListener("click", () => {
    if (inspected.has(button.dataset.clue)) return;
    inspected.add(button.dataset.clue);
    button.setAttribute("aria-pressed", "true");
    renderEvidence();
    renderControls();
  });
}

puzzle.addEventListener("submit", (event) => {
  event.preventDefault();
  result = code.value === "248" ? "solved" : "incorrect";
  renderControls();
  if (result === "solved") {
    reset.focus();
  } else {
    code.focus();
    code.select();
  }
});

code.addEventListener("input", () => {
  code.value = code.value.replace(/[^0-9]/g, "");
  result = null;
  renderControls();
});

reset.addEventListener("click", () => {
  inspected.clear();
  puzzle.reset();
  result = null;
  for (const button of clueButtons) button.setAttribute("aria-pressed", "false");
  renderEvidence();
  renderControls();
  clueButtons[0].focus();
});

languageButton.addEventListener("click", () => {
  language = language === "en" ? "zh-CN" : "en";
  try {
    localStorage.setItem("game408-language", language);
  } catch {
    // A storage failure does not prevent changing languages.
  }
  renderLanguage();
});

renderLanguage();
languageButton.hidden = false;
