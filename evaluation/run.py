"""Summarize a JSON file of recorded checkpoint outcomes."""

import argparse
import json
from pathlib import Path

from evaluation.metrics import summarize_runs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("traces", type=Path, help="JSON array of checkpoint outcomes")
    args = parser.parse_args()
    with args.traces.open(encoding="utf-8") as source:
        traces = json.load(source)
    print(json.dumps(summarize_runs(traces), indent=2))


if __name__ == "__main__":
    main()
