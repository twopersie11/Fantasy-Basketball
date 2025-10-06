"""Breakout probability estimator backed by an XGBoost-inspired heuristic."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List
import json


@dataclass
class PlayerDevelopmentSample:
    player_id: str
    age: float
    efficiency_delta: float
    usage_delta: float
    minutes_trend: float


class BreakoutModel:
    """Small utility that mirrors the structure of the XGBoost model."""

    def predict(self, sample: PlayerDevelopmentSample) -> float:
        baseline = 0.12
        efficiency_component = 0.35 * max(sample.efficiency_delta, -0.1)
        usage_component = 0.25 * max(sample.usage_delta, -0.05)
        minutes_component = 0.2 * sample.minutes_trend
        age_component = 0.15 * (1 - min(sample.age, 32) / 32)

        score = baseline + efficiency_component + usage_component + minutes_component + age_component
        return float(max(0.0, min(score, 1.0)))


def generate_breakout_probabilities(
    samples: Iterable[PlayerDevelopmentSample], output_path: Path
) -> List[dict]:
    model = BreakoutModel()
    results = []
    for sample in samples:
        prob = model.predict(sample)
        results.append({"id": sample.player_id, "breakout_probability": round(prob, 4)})

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open('w', encoding='utf-8') as handle:
        json.dump(results, handle, ensure_ascii=False, indent=2)

    return results


__all__ = [
    "BreakoutModel",
    "PlayerDevelopmentSample",
    "generate_breakout_probabilities",
]
