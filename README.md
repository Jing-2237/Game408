# Game408

**Deep Reasoning from Clues to Actions in Long-Horizon Narrative Game Worlds**

[Project page](https://jing-2237.github.io/Game408/) · [Evaluation protocol](#evaluation-protocol) · [Task browser](https://jing-2237.github.io/Game408/#arena) · [Code layout](#repository-layout) · [简体中文](README.zh-CN.md)

![Game408 paper teaser](docs/assets/game408-cover.webp)

Can an agent use a clue found several scenes ago to choose its next move? Game408 studies this question in 2D narrative and puzzle games. Each run starts from a story checkpoint with a defined goal. The evaluation tracks whether the agent reaches that goal and whether its individual decisions use the evidence it had at the time.

## Dataset

| Games | Story checkpoints | Human gameplay | Reasoning and action annotations |
| ---: | ---: | ---: | ---: |
| 54 | 408 | 260+ hours | 24,000+ |

Experienced volunteers mapped main and side storylines to place checkpoints at meaningful stage boundaries. Novice players then checked the clarity of the objectives and starting information. The game-level split uses **42 titles for training** and **12 held-out titles with 83 checkpoints for evaluation** in **Game408-Val**.

- **Game408-CoT** documents individual semantic actions. Each record connects a pre-action observation with earlier clues, the player's intent, the operation, and its recorded feedback.
- **Game408-CoA** organizes sequences of actions by story stage. It includes successful play, genuine mistakes, and recovery steps such as retrying, switching tools, or repositioning.
- **Reasoning horizons D0–D3** describe how far back the necessary evidence comes from. D0 uses the current screen. D1 adds recent actions or clues from the same scene. D2 combines multiple clues or prerequisites within a story segment. D3 draws on evidence, branch states, or goals across scenes or stages.

[Browse the 54-game catalog and Steam cover sources](GAME_CATALOG.md)

![A mosaic of official Steam covers for all 54 Game408 games](docs/assets/game408-steam-mosaic.webp)

## GameHunter

GameHunter is the vision-language agent introduced in the paper. The student is fine-tuned from **Qwen3.5-9B**, and the teacher models are fine-tuned from **Qwen3.5-4B**. Training proceeds in three stages.

1. **Supervised fine-tuning (SFT)** learns to generate reasoning and semantic actions from human-verified Game408 annotations.
2. **Action execution training** supplies the teacher's intent and compares student actions under that fixed intent. Correctness-constrained GRPO encourages valid implementations of the intended operation.
3. **Local on-policy distillation (OPD)** lets the student act in the game. When the quality of recent decisions falls below the sliding-window threshold, a stage-specific teacher jointly supervises reasoning and actions on the student's own trajectory.

![GameHunter pipeline, from supervised fine-tuning to execution training and local joint distillation](docs/assets/gamehunter-pipeline.webp)

## Evaluation protocol

Agents start from a Game408-Val checkpoint and interact with the game to reach the corresponding objectives. Game-level measures and decision-level scores answer different questions.

| Game-level metric | How it is measured |
| --- | --- |
| **Score** | Compute the completion rate for each game's checkpoint-stage and achievement goals, then average the rates equally across games. |
| **Efficiency** | Effective actions divided by all actions. Necessary navigation, evidence collection, and tests supported by available evidence count as effective. |
| **Time** | Mean latency from model input to action completion. |

For each decision, an LLM judge examines the frame, task state, available action history, and retrieved memories **as they were before the action**. It grades the model's reasoning and semantic tool call on the seven criteria below. Each applicable, assessable criterion receives an integer from **0 to 5** with supporting evidence.

| Group | Criterion | What earns full credit |
| --- | --- | --- |
| Action | Action Selection | The operation fits the subgoal and known constraints and can advance the task or test a hypothesis. |
| Action | Target Grounding | The call identifies the right object or equivalent control, including both endpoints of a drag when needed. |
| Reasoning | Logical Validity | The key inference follows from available facts and justified assumptions. |
| Reasoning | Trajectory Consistency | The reasoning matches the current branch, prior outcomes, and remaining prerequisites. |
| Reasoning | Clue Use | The reasoning explains how the available clues support the choice or rule out alternatives. |
| Reasoning | Memory Recall | The reasoning recalls an earlier relevant fact accurately and connects it to the decision. |
| Reasoning | Action Judgment | The reasoning identifies the operation's prerequisites and treats unverified effects as expectations. |

When all seven criteria can be scored, the normalized step score is the raw total divided by **35**. For the overall report, each criterion is averaged over the applicable and assessable steps and converted to a percentage. **Action** averages its two criterion percentages, and **Reasoning** averages its five.

**Worked example from Lamplight City.** Amélie remembers a book the color of her stew spices. After checking the reddish and orange spices, the player inspects the matching copy of *Choice and Consequence*. The earlier testimony and kitchen observation support the action. Inspecting the correct volume grounds the choice, and Miles's subsequent remark provides feedback.

| Before the action | Recorded outcome |
| --- | --- |
| ![The red-orange book among darker volumes](docs/assets/cases/lamplight-414.webp) | ![Miles identifies the possible match to Amélie's description](docs/assets/cases/lamplight-414-after.webp) |

## Leaderboard, tasks, and releases

The leaderboard reproduces the paper's Game408-Val comparison table. Overall, action, and reasoning views can be sorted independently. Human play is shown as a reference.

The task browser contains 30 decisions from 14 recorded games. Inspect the pre-action frame and earlier clues, then compare your choice with the reference action, its reasoning, and the recorded outcome. The [playtest review](PLAYTEST.md) lists the records and frame alignments.

| Resource | Status |
| --- | --- |
| Project site and playtest | Available |
| Evaluation, training, and data preparation | Placeholder interfaces and example configs |
| GameHunter model weights | Planned |
| Game408 dataset and annotations | Planned |
| Public submissions | Planned |

## Repository layout

| Path | Planned implementation |
| --- | --- |
| [`evaluation/`](evaluation/) | Benchmark runner, checkpoint rollouts, environment adapter, and scoring. |
| [`training/`](training/) | Training entry point and dataset loading. |
| [`models/`](models/) | GameHunter model and agent loader. |
| [`data/`](data/) | Dataset and checkpoint manifest preparation. |
| [`configs/`](configs/) | Example evaluation and training settings with blank paths. |
| [`docs/`](docs/) | Published website and reviewed task excerpts. |

The Python files are replacement points. Their stubs raise `NotImplementedError` until the project implementation is added.

To preview the website locally, run `python -m http.server 8000 --directory docs` from the repository root and open [localhost:8000](http://localhost:8000).

The website code is released under the [MIT License](LICENSE). See the [figure, recording, and Steam artwork credits](docs/assets/NOTICE.md).
