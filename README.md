# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Oksidasi13/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Oksidasi13/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI — 1 platinum, 2 gold, 6 silver, 46 bronze — with a guide in our own words for every trophy, a roadmap to platinum, missable flags, and saved progress.

## What it does

- **Checklist** — all 55 trophies with their official name, description and grade, a tick box to mark each earned, and a progress bar with a per-grade count.
- **Guide pane** — click any trophy to read its guide (what to do, where, when it can be missed) and its sources, plus a personal note field.
- **Filters** — by kind (story, stranger, collectibles, activities, combat & heists, misc), grade, earned/unearned, missable-only, and free-text search.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to Platinum** — six ordered stages: story, strangers, collectibles, activities, combat & heists, then cleanup and the platinum.
- **Missables** — all 20 flagged trophies and when each can be missed.
- **Save & Export** — progress saves automatically in the browser (localStorage), exports to a JSON file, imports back, and resets.

## Honesty note

The game released today, so nothing in the guides has been verified in-game yet. Guides are built from the official trophy descriptions, cite their sources beside each trophy, and say so where a place or step is not pinned down. Missable flags are built from the official descriptions and are not yet verified in-game. No Rockstar logo or official artwork is used anywhere.

## How to run

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. The app is plain static files under `app/` and works with the network off.

## How to build the entry

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) validates `app/data/trophies.json` (55 trophies, every guide non-blank, grades 1/2/6/46), copies `app/` and `screenshots/` to the output directory, and writes `dossier.json` with the kit's vendored library.

## Screenshots

- `1-checklist.jpg` — checklist with a guide open, filters and progress (cover)
- `2-roadmap.jpg` — roadmap to platinum
- `3-missables.jpg` — missable trophies
- `4-spoiler.jpg` — checklist with the spoiler setting on

## Sources

- Official trophy list — Exophase: https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles trophy list: https://psnprofiles.com/trophies/43531-grand-theft-auto-vi

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
