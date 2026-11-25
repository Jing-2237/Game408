// Model comparison table in the Game408 paper. All metrics except Time are percentages.
const modelRows = [
  ["Qwen2.5-VL", "7B", "generalist", 2.49, 7.98, 7.47, 19.82, 62.47, 6.83, 4.67, 3.84, 5.29, 7.16],
  ["Qwen3-VL-Instruct", "32B", "generalist", 19.07, 16.11, 12.11, 32.68, 79.63, 19.42, 16.87, 15.63, 18.74, 21.36],
  ["Qwen3.5", "9B", "generalist", 14.62, 13.76, 14.11, 25.68, 69.65, 9.45, 6.49, 7.71, 13.43, 12.62],
  ["GPT-4o", null, "generalist", 31.08, 24.27, 14.27, 62.74, 86.16, 45.26, 25.87, 32.46, 35.74, 27.63],
  ["GPT-5.6-Terra", null, "generalist", 53.48, 45.57, 14.53, 82.13, 90.42, 59.73, 46.82, 53.16, 57.34, 48.67],
  ["Claude-Haiku-4.5", null, "generalist", 37.78, 62.55, 9.29, 71.84, 87.12, 53.46, 31.84, 36.72, 40.63, 33.27],
  ["Claude-Sonnet-4.6", null, "generalist", 52.09, 76.58, 15.42, 85.36, 92.08, 64.37, 49.18, 53.72, 57.86, 60.74],
  ["Gemini-3.7-Flash", null, "generalist", 39.16, 65.55, 9.94, 73.86, 89.73, 60.84, 31.67, 37.84, 58.73, 33.46],
  ["GameScaling-S3", "9B", "game", 6.85, 18.63, 4.37, 38.76, null, null, null, null, null, null],
  ["GameScaling-S3", "27B", "game", 14.55, 29.1, 5.88, 45.82, null, null, null, null, null, null],
  ["Game2Player", "9B", "game", 8.27, 7.29, 21.4, 42.38, 76.91, 13.48, 10.62, 8.37, null, 11.94],
  ["Open Pixel2Play", "1.2B", "game", 2.07, 27.93, 3.35, null, null, null, null, null, null, null],
  ["UI-TARS-1.5", "7B", "game", 10.58, 25.96, 11.07, 48.73, 78.46, 15.83, 12.46, 9.72, null, 13.28],
  ["Human Players", null, "reference", 64.07, 84.72, 26.45, 97.55, 98.0, 81.46, 76.39, 69.0, 81.0, 93.46],
  ["GameHunter-GRPO", "9B", "game", 32.01, 39.86, 12.27, 74.79, 85.73, 29.62, 32.52, 33.65, 29.57, 34.49],
  ["GameHunter", "9B", "game", 60.93, 80.49, 14.68, 92.37, 94.18, 69.42, 55.27, 69.38, 70.14, 64.26],
];

const rankGroups = {
  overall: [3, 4, 5],
  action: [6, 7],
  reasoning: [8, 9, 10, 11, 12],
};

const metricLabels = {
  3: ["Score (%)", "任务得分 (%)"],
  4: ["Efficiency (%)", "效率 (%)"],
  5: ["Time (s)", "耗时 (秒)"],
  6: ["Action selection (%)", "动作选择 (%)"],
  7: ["Target grounding (%)", "目标定位 (%)"],
  8: ["Logical validity (%)", "逻辑有效性 (%)"],
  9: ["Trajectory consistency (%)", "轨迹一致性 (%)"],
  10: ["Clue use (%)", "线索利用 (%)"],
  11: ["Memory recall (%)", "记忆召回 (%)"],
  12: ["Action judgment (%)", "动作判断 (%)"],
};

const rankTable = document.querySelector("#rank-table");
const rankFilter = document.querySelector("#rank-filter");
const viewButtons = [...document.querySelectorAll("[data-view]")];
let rankView = "overall";
let sortMetric = 3;
let ascending = false;

function renderRanking() {
  const zh = document.documentElement.lang === "zh-CN";
  const columns = rankGroups[rankView];
  const head = document.createElement("tr");
  for (const label of zh ? ["排名", "模型", "规模"] : ["Rank", "Model", "Size"]) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;
    head.append(cell);
  }
  for (const key of columns) {
    const cell = document.createElement("th");
    cell.scope = "col";
    const control = document.createElement("button");
    control.type = "button";
    control.dataset.metric = String(key);
    control.textContent = metricLabels[key][Number(zh)];
    if (key === sortMetric) cell.setAttribute("aria-sort", ascending ? "ascending" : "descending");
    control.addEventListener("click", () => {
      ascending = key === sortMetric ? !ascending : key === 5;
      sortMetric = key;
      renderRanking();
      rankTable.querySelector(`[data-metric="${key}"]`).focus();
    });
    cell.append(control);
    head.append(cell);
  }
  rankTable.tHead.replaceChildren(head);

  const filter = rankFilter.value;
  const visibleModels = modelRows.filter((row) => row[2] !== "reference" && (filter === "all" || row[2] === filter));
  visibleModels.sort((first, second) => {
    const a = first[sortMetric];
    const b = second[sortMetric];
    if (a === null || b === null) return Number(a === null) - Number(b === null);
    return ascending ? a - b : b - a;
  });
  const data = filter === "all" ? [...visibleModels, modelRows.find((row) => row[2] === "reference")] : visibleModels;
  const rows = data.map((row, index) => {
    const [name, size, category] = row;
    const reference = category === "reference";
    const rowNode = document.createElement("tr");
    if (name === "GameHunter") rowNode.classList.add("project-row");
    if (reference) rowNode.classList.add("reference-row");
    const label = reference ? (zh ? "人类参考" : "Human reference") : name;
    const values = [
      reference || row[sortMetric] === null ? "—" : String(index + 1),
      label,
      size ?? "—",
      ...columns.map((key) => row[key] === null ? "—" : row[key].toFixed(2)),
    ];
    values.forEach((value, columnIndex) => {
      const cell = document.createElement(columnIndex === 1 ? "th" : "td");
      if (columnIndex === 1) cell.scope = "row";
      cell.textContent = value;
      rowNode.append(cell);
    });
    return rowNode;
  });
  rankTable.tBodies[0].replaceChildren(...rows);
}

for (const button of viewButtons) {
  button.addEventListener("click", () => {
    if (rankView === button.dataset.view) return;
    rankView = button.dataset.view;
    sortMetric = rankGroups[rankView][0];
    ascending = false;
    for (const item of viewButtons) item.setAttribute("aria-pressed", String(item === button));
    renderRanking();
  });
}
rankFilter.addEventListener("change", renderRanking);
document.addEventListener("game408languagechange", renderRanking);
renderRanking();
document.querySelector("#rank-controls").hidden = false;
