"""Team synergy scoring utilities."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List
import json


@dataclass
class TeamSynergySample:
    team_id: str
    spacing: float
    defensive_rating_delta: float
    assist_rate: float
    pace: float
    turnover_rate: float


DEFAULT_WEIGHTS: Dict[str, float] = {
    "spacing": 0.25,
    "defensive_rating_delta": 0.25,
    "assist_rate": 0.2,
    "pace": 0.15,
    "turnover_rate": 0.15,
}


class SynergyScorer:
    def __init__(self, weights: Dict[str, float] | None = None) -> None:
        self.weights = weights or DEFAULT_WEIGHTS

    def score(self, sample: TeamSynergySample) -> float:
        score = 0.0
        score += self.weights["spacing"] * sample.spacing
        score += self.weights["defensive_rating_delta"] * (1 - sample.defensive_rating_delta)
        score += self.weights["assist_rate"] * sample.assist_rate
        score += self.weights["pace"] * sample.pace
        score += self.weights["turnover_rate"] * (1 - sample.turnover_rate)
        return float(max(0.0, min(score, 1.0)))


def generate_team_synergy(
    samples: Iterable[TeamSynergySample], output_path: Path, weights: Dict[str, float] | None = None
) -> List[dict]:
    scorer = SynergyScorer(weights)
    results: List[dict] = []
    for sample in samples:
        value = scorer.score(sample)
        results.append({"team_id": sample.team_id, "synergy_score": round(value, 4)})

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open('w', encoding='utf-8') as handle:
        json.dump(results, handle, ensure_ascii=False, indent=2)

    return results


__all__ = [
    "SynergyScorer",
    "TeamSynergySample",
    "generate_team_synergy",
]
