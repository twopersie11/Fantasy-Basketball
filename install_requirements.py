#!/usr/bin/env python3
"""Install project dependencies listed in requirements.txt.

This script reads the consolidated dependency list that was added for the
client and server applications and runs the appropriate package manager
commands so the dependencies become available for local development.

Usage examples
--------------
$ python install_requirements.py
    Installs client and server packages with npm (default).

$ python install_requirements.py --package-manager yarn
    Installs client and server packages with yarn add.

$ python install_requirements.py --dry-run
    Prints the commands without executing them.
"""
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path
from typing import Dict, List

ROOT_DIR = Path(__file__).resolve().parent
DEFAULT_REQUIREMENTS_FILE = ROOT_DIR / "requirements.txt"
SUPPORTED_SCOPES = ("client", "server")


def parse_requirements(file_path: Path) -> Dict[str, List[str]]:
    """Parse scoped dependencies from the consolidated requirements file."""
    dependencies: Dict[str, List[str]] = {scope: [] for scope in SUPPORTED_SCOPES}

    with file_path.open("r", encoding="utf-8") as requirements_file:
        for line in requirements_file:
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue

            try:
                scope, package = stripped.split(":", maxsplit=1)
            except ValueError as exc:  # pragma: no cover - defensive branch
                raise ValueError(
                    f"Malformed requirement line: '{stripped}'. Expected '<scope>:<package>'"
                ) from exc

            scope = scope.strip()
            package = package.strip()

            if scope not in SUPPORTED_SCOPES:
                raise ValueError(
                    f"Unsupported scope '{scope}'. Supported scopes: {', '.join(SUPPORTED_SCOPES)}."
                )

            if not package:
                raise ValueError(f"Missing package specification in line: '{stripped}'")

            dependencies[scope].append(package)

    return dependencies


def build_install_command(package_manager: str, packages: List[str]) -> List[str]:
    """Return the command used to install the provided packages."""
    if package_manager == "npm":
        return ["npm", "install", *packages]
    if package_manager == "yarn":
        return ["yarn", "add", *packages]
    if package_manager == "pnpm":
        return ["pnpm", "add", *packages]
    raise ValueError(f"Unsupported package manager '{package_manager}'.")


def install_scoped_dependencies(
    scope: str, packages: List[str], package_manager: str, dry_run: bool
) -> None:
    """Install dependencies for a given scope if any packages are listed."""
    if not packages:
        return

    project_dir = ROOT_DIR / scope
    if not project_dir.exists():
        raise FileNotFoundError(f"The directory for scope '{scope}' was not found at {project_dir}.")

    command = build_install_command(package_manager, packages)
    command_display = " ".join(command)
    print(f"Installing {scope} dependencies with '{command_display}' (cwd={project_dir})")

    if dry_run:
        return

    subprocess.run(command, cwd=project_dir, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--requirements",
        type=Path,
        default=DEFAULT_REQUIREMENTS_FILE,
        help="Path to the consolidated requirements file.",
    )
    parser.add_argument(
        "--package-manager",
        choices=["npm", "yarn", "pnpm"],
        default="npm",
        help="JavaScript package manager to use when installing dependencies.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the commands without executing them.",
    )

    args = parser.parse_args()
    requirements_path = args.requirements.resolve()

    if not requirements_path.exists():
        raise FileNotFoundError(f"Requirements file not found: {requirements_path}")

    dependencies = parse_requirements(requirements_path)

    for scope in SUPPORTED_SCOPES:
        install_scoped_dependencies(scope, dependencies[scope], args.package_manager, args.dry_run)

    print("Done.")


if __name__ == "__main__":
    main()
