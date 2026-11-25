# Game408

[Project website and arena demo](https://jing-2237.github.io/Game408/)

**Game408: Deep Reasoning from Clues to Actions in Long-Horizon Narrative Game Worlds**

Game408 is a research benchmark for long-horizon reasoning in narrative and puzzle games, primarily with 2D interfaces. Agents can pause to review evidence, connect clues across scenes, and take discrete actions to advance the story. The dataset described in the paper contains 54 games, 408 checkpoints, and over 24,000 human reasoning and action annotations.

GameHunter is the agent proposed in the paper. Its training combines supervised learning on Game408, execution training under teacher-provided intent, and joint distillation on autonomous trajectories.

## Release status

| Resource | Status |
| --- | --- |
| Project website and interactive demo | Available |
| Evaluation and training code | Planned |
| GameHunter model weights | Planned |
| Game408 dataset and annotations | Planned |
| Public model leaderboard and submissions | Planned |

## Preview and deploy

From the repository root, run `python -m http.server 8000 --directory docs` and open [localhost:8000](http://localhost:8000). The website is plain HTML, CSS, and JavaScript. GitHub Pages publishes `main:/docs`.

## License and figure credits

The website code and original interaction demo are provided under the [MIT License](LICENSE). The Game408 overview and game catalog and the GameHunter training diagram reproduce figures from the project paper. See [figure credits](docs/assets/NOTICE.md) for the scope of the license.
