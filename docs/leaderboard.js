// Closed-source entries in the Game408 paper comparison table. All metrics except Time are percentages.
const modelRows = [
  ["GPT-4o", 31.08, 24.27, 14.27, 62.74, 86.16, 45.26, 25.87, 32.46, 35.74, 27.63],
  ["GPT-5.6-Terra", 53.48, 45.57, 14.53, 82.13, 90.42, 59.73, 46.82, 53.16, 57.34, 48.67],
  ["Claude-Haiku-4.5", 37.78, 62.55, 9.29, 71.84, 87.12, 53.46, 31.84, 36.72, 40.63, 33.27],
  ["Claude-Sonnet-4.6", 52.09, 76.58, 15.42, 85.36, 92.08, 64.37, 49.18, 53.72, 57.86, 60.74],
  ["Gemini-3.7-Flash", 39.16, 65.55, 9.94, 73.86, 89.73, 60.84, 31.67, 37.84, 58.73, 33.46],
];

const rankGroups = {
  overall: [1, 2, 3],
  action: [4, 5],
  reasoning: [6, 7, 8, 9, 10],
};

const metricLabels = {
  1: ["Score (%)", "任务得分 (%)"],
  2: ["Efficiency (%)", "效率 (%)"],
  3: ["Time (s)", "耗时 (秒)"],
  4: ["Action selection (%)", "动作选择 (%)"],
  5: ["Target grounding (%)", "目标定位 (%)"],
  6: ["Logical validity (%)", "逻辑有效性 (%)"],
  7: ["Trajectory consistency (%)", "轨迹一致性 (%)"],
  8: ["Clue use (%)", "线索利用 (%)"],
  9: ["Memory recall (%)", "记忆召回 (%)"],
  10: ["Action judgment (%)", "动作判断 (%)"],
};

const rankTable = document.querySelector("#rank-table");
const viewButtons = [...document.querySelectorAll("[data-view]")];
let rankView = "overall";
let sortMetric = 1;
let ascending = false;

function renderRanking() {
  const zh = document.documentElement.lang === "zh-CN";
  const columns = rankGroups[rankView];
  const head = document.createElement("tr");
  for (const label of zh ? ["排名", "模型"] : ["Rank", "Model"]) {
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
      ascending = key === sortMetric ? !ascending : key === 3;
      sortMetric = key;
      renderRanking();
      rankTable.querySelector(`[data-metric="${key}"]`).focus();
    });
    cell.append(control);
    head.append(cell);
  }
  rankTable.tHead.replaceChildren(head);

  const sortedModels = [...modelRows].sort((first, second) => (
    ascending ? first[sortMetric] - second[sortMetric] : second[sortMetric] - first[sortMetric]
  ));
  const rows = sortedModels.map((row, index) => {
    const rowNode = document.createElement("tr");
    const values = [String(index + 1), row[0], ...columns.map((key) => row[key].toFixed(2))];
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
document.addEventListener("game408languagechange", renderRanking);
renderRanking();
document.querySelector("#rank-controls").hidden = false;
