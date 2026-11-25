"""Aggregate recorded objective completion and action metrics."""

from collections import defaultdict
from math import isfinite
from statistics import fmean


def score_decision(evidence, action, rubric):
    """Score an action and its reasoning using the evidence available to the agent."""
    raise NotImplementedError("Game408 decision scoring is a placeholder.")


def summarize_runs(traces):
    """Return mean game completion, pooled action efficiency, and mean latency."""
    objectives_by_game = defaultdict(list)
    effective_actions = 0
    latencies = []

    for trace in traces:
        objectives = trace["objectives"]
        if not objectives or any(type(completed) is not bool for completed in objectives):
            raise ValueError("Each run must contain boolean objective results.")
        objectives_by_game[trace["game"]].extend(objectives)
        for action in trace["actions"]:
            effective = action["effective"]
            latency = action["latency_seconds"]
            if type(effective) is not bool or not isfinite(latency) or latency < 0:
                raise ValueError("Actions require a boolean effective flag and finite, nonnegative latency.")
            effective_actions += effective
            latencies.append(latency)

    game_rates = [fmean(objectives) for objectives in objectives_by_game.values()]
    return {
        "games": len(game_rates),
        "actions": len(latencies),
        "score_percent": 100 * fmean(game_rates) if game_rates else None,
        "efficiency_percent": 100 * effective_actions / len(latencies) if latencies else None,
        "mean_latency_seconds": fmean(latencies) if latencies else None,
    }
