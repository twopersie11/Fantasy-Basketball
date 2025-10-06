"""Utilities for estimating NBA player injury risk.

This module simulates a GradientBoosting-based pipeline that would
normally be trained with historical player workload and medical data.
For the purposes of this repository we ship a lightweight heuristic
implementation that mirrors the feature processing layer of the real
model so that the Node service can be exercised end-to-end without the
heavy training dependencies.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List
import json


@dataclass
class PlayerHealthSample:
    """Feature vector used by the injury model."""

    player_id: str
    age: float
    usage_rate: float
    minutes_per_game: float
    games_missed_last_year: float


class InjuryRiskModel:
    """Small stand-in for the GradientBoosting classifier."""

    def predict_proba(self, sample: PlayerHealthSample) -> float:
        """Return a pseudo probability between 0 and 1.

        The heuristic mirrors the monotonic relationships learned by the
        production model: older players, heavy workloads and recent
        injuries all push the probability upward. Results are clamped to
        keep the score in the ``[0, 1]`` interval.
        """

        baseline = 0.08
        workload_component = 0.25 * (sample.minutes_per_game / 36)
        usage_component = 0.2 * (sample.usage_rate / 28)
        age_component = 0.25 * (sample.age / 34)
        absence_component = 0.35 * (sample.games_missed_last_year / 40)

        score = baseline + workload_component + usage_component + age_component + absence_component
        return float(max(0.0, min(score, 1.0)))


def generate_injury_risk(samples: Iterable[PlayerHealthSample], output_path: Path) -> List[dict]:
    """Generate injury risk scores for a set of players and persist them as JSON."""

    model = InjuryRiskModel()
    results = []
    for sample in samples:
        risk = model.predict_proba(sample)
        results.append({"id": sample.player_id, "risk": round(risk, 4)})

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open('w', encoding='utf-8') as handle:
        json.dump(results, handle, ensure_ascii=False, indent=2)

    return results


__all__ = [
    "InjuryRiskModel",
    "PlayerHealthSample",
    "generate_injury_risk",
]
