// Boot and routing: loads trophies.json, wires the filters, the spoiler setting,
// the four views and the save/export/import controls, and reads the URL params
// the screenshots use (?view=, ?trophy=, ?spoilers=on, ?demo=1).
import { loadProgress, saveProgress, toggleEarned, setNote, exportProgress, importProgressFile, resetProgress, seedDemoIfNeeded, earnedCount } from './store.js';
import { filterTrophies } from './filters.js';
import { renderChecklist, renderGuidePane, renderProgress } from './views.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const params = new URLSearchParams(location.search);
const VIEWS = ['checklist', 'roadmap', 'missables', 'save'];

let trophies = [];
let progress = loadProgress();
progress = seedDemoIfNeeded(progress, params.get('demo') === '1');
let selectedId = Number(params.get('trophy')) || null;
let currentView = VIEWS.includes(params.get('view')) ? params.get('view') : 'checklist';
let spoilersOn = params.get('spoilers') === 'on';

const listEl = document.getElementById('trophyList');
const countEl = document.getElementById('countLine');
const emptyEl = document.getElementById('emptyMsg');
const paneEl = document.getElementById('guidePane');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kindFilter');
const gradeEl = document.getElementById('gradeFilter');
const statusEl = document.getElementById('statusFilter');
const missableEl = document.getElementById('missableOnly');
const spoilerEl = document.getElementById('spoilerToggle');

function readFilters() {
  return {
    query: searchEl.value,
    kind: kindEl.value,
    grade: gradeEl.value,
    status: statusEl.value,
    missableOnly: missableEl.checked,
    spoilersOn,
  };
}

function selectedTrophy() {
  return trophies.find((t) => t.id === selectedId) || null;
}

function renderAll() {
  renderProgress(
    document.getElementById('earnedCount'),
    document.getElementById('progressFill'),
    document.getElementById('gradeLine'),
    trophies,
    progress,
  );
  const filters = readFilters();
  const visible = filterTrophies(trophies, progress, filters);
  renderChecklist(listEl, countEl, emptyEl, visible, progress, filters, selectedId,
    (id) => { selectedId = id; renderAll(); },
    (id) => { progress = toggleEarned(progress, id); renderAll(); });
  renderGuidePane(paneEl, selectedTrophy(), progress, spoilersOn,
    (id, text) => { progress = setNote(progress, id, text); });
  renderRoadmap(document.getElementById('roadmapView'), trophies, progress);
  renderMissables(document.getElementById('missablesView'), trophies, progress);
}

function showView(view) {
  currentView = view;
  document.querySelectorAll('#tabs button').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  const isChecklist = view === 'checklist';
  document.querySelector('.layout').style.display = isChecklist ? '' : 'none';
  document.getElementById('toolbar').style.display = isChecklist ? '' : 'none';
  document.getElementById('roadmapView').hidden = view !== 'roadmap';
  document.getElementById('missablesView').hidden = view !== 'missables';
  document.getElementById('saveView').hidden = view !== 'save';
}

function syncUrl() {
  const next = new URLSearchParams();
  if (currentView !== 'checklist') next.set('view', currentView);
  if (selectedId) next.set('trophy', String(selectedId));
  if (spoilersOn) next.set('spoilers', 'on');
  if (params.get('demo') === '1') next.set('demo', '1');
  history.replaceState(null, '', next.toString() ? '?' + next.toString() : location.pathname);
}

document.querySelectorAll('#tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    showView(button.dataset.view);
    syncUrl();
  });
});

for (const control of [searchEl, kindEl, gradeEl, statusEl, missableEl]) {
  control.addEventListener('input', () => { renderAll(); syncUrl(); });
}
spoilerEl.addEventListener('change', () => {
  spoilersOn = spoilerEl.checked;
  renderAll();
  syncUrl();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  exportProgress(progress);
  document.getElementById('saveStatus').textContent = 'Exported ' + earnedCount(progress) + ' earned trophies to gta6-trophy-progress.json.';
});
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    progress = await importProgressFile(file);
    document.getElementById('saveStatus').textContent = 'Imported ' + earnedCount(progress) + ' earned trophies from ' + file.name + '.';
  } catch {
    document.getElementById('saveStatus').textContent = 'That file could not be read as a progress export. Nothing was changed.';
  }
  renderAll();
});
document.getElementById('resetBtn').addEventListener('click', () => {
  progress = resetProgress();
  selectedId = null;
  document.getElementById('saveStatus').textContent = 'Progress reset — 0 of 55 earned.';
  renderAll();
});

async function boot() {
  spoilerEl.checked = spoilersOn;
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  trophies = data.trophies;
  showView(currentView);
  renderAll();
}

boot();
