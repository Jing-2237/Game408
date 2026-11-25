"""Interfaces for decision scoring and benchmark aggregation."""


def score_decision(evidence, action, rubric):
    """Score an action and its reasoning using the evidence available to the agent."""
    raise NotImplementedError("Game408 decision scoring is a placeholder.")


def summarize_runs(traces):
    """Produce the reported completion, efficiency, latency, and step metrics."""
    raise NotImplementedError("Game408 score aggregation is a placeholder.")
