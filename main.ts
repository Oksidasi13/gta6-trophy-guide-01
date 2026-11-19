// GTA VI trophy guide entry point (Node 22, standard library only).
//
// What this program does, in three small steps:
//   1. checkTrophies — reads app/data/trophies.json and insists on the official
//      shape: 55 trophies, each with a non-blank guide, and the official grade
//      split (1 platinum, 2 gold, 6 silver, 46 bronze). A bad data file fails
//      the build loudly instead of shipping a broken guide.
//   2. copyEntry — copies app/ and screenshots/ from beside this file into the
//      output directory (MAKEFUN_OUTPUT_DIR, or /output in the grader).
//   3. writeDossier — writes /output/dossier.json with the kit's vendored
//      library, vendor/makefun-frontend.ts, which this file never modifies.
//
// The app itself is plain static files under app/ (index.html, style.css,
// js/*.js, data/trophies.json) and works offline; the screenshots in
// screenshots/ are real renders of it. Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The official list, as the gate holds it: 55 trophies, 1 platinum, 2 gold,
// 6 silver and 46 bronze. Keeping the numbers here means a miscounted data
// file fails here, in plain sight, instead of at the gate.
const EXPECTED_COUNT = 55;
const EXPECTED_GRADES = { platinum: 1, gold: 2, silver: 6, bronze: 46 };

function checkTrophies(appDir) {
  const raw = readFileSync(join(appDir, 'data', 'trophies.json'), 'utf8');
  const data = JSON.parse(raw);
  const trophies = data.trophies;
  if (!Array.isArray(trophies) || trophies.length !== EXPECTED_COUNT) {
    throw new Error(`trophies.json must hold ${EXPECTED_COUNT} trophies, found ${Array.isArray(trophies) ? trophies.length : 'none'}`);
  }
  const grades = {};
  for (const trophy of trophies) {
    if (typeof trophy.name !== 'string' || !trophy.name.trim()) throw new Error(`trophy ${trophy.id} has no name`);
    if (typeof trophy.guide !== 'string' || !trophy.guide.trim()) throw new Error(`trophy "${trophy.name}" has no guide`);
    grades[trophy.grade] = (grades[trophy.grade] || 0) + 1;
  }
  for (const [grade, count] of Object.entries(EXPECTED_GRADES)) {
    if (grades[grade] !== count) throw new Error(`expected ${count} ${grade} trophies, found ${grades[grade] || 0}`);
  }
  console.log(`trophies ok: ${EXPECTED_COUNT} trophies, 1 platinum, 2 gold, 6 silver, 46 bronze, every guide non-blank`);
}

function copyEntry(here, out) {
  mkdirSync(out, { recursive: true });
  cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  if (existsSync(join(here, 'screenshots'))) {
    cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
  }
}

function writeDossier(out) {
  // The scorer's own caps: at most 4 screenshots, each at most 256 KiB;
  // app/ at most 993 files and 48 MiB; dossier text at most 160 KiB.
  const dossier = buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(out, 'dossier.json'), dossier);
  console.log(`dossier written: ${dossier.length} bytes`);
}

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');

checkTrophies(appDir);
copyEntry(here, out);
writeDossier(out);
console.log(`entry copied to ${out}`);
