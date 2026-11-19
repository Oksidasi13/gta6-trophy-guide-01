// Checklist and guide-pane rendering: the trophy rows and the detail pane
// that opens when a trophy is clicked. Spoiler mode hides story trophies'
// names and descriptions until they are earned.
import { isEarned } from './store.js';

const KIND_LABELS = {
  story: 'Story',
  stranger: 'Stranger',
  collectibles: 'Collectibles',
  activities: 'Activities',
  combat: 'Combat & heists',
  misc: 'Misc',
};

function spoilerHidden(trophy, progress, spoilersOn) {
  return spoilersOn && trophy.kind === 'story' && !isEarned(progress, trophy.id);
}

function formatCount(trophy) {
  if (trophy.count == null) return null;
  if (trophy.count >= 1000) return 'Target: $' + trophy.count.toLocaleString('en-US');
  return 'Target: ' + trophy.count;
}

export function renderChecklist(listEl, countEl, emptyEl, trophies, progress, filters, selectedId, onSelect, onToggle) {
  listEl.innerHTML = '';
  for (const trophy of trophies) {
    const earned = isEarned(progress, trophy.id);
    const hidden = spoilerHidden(trophy, progress, filters.spoilersOn);
    const li = document.createElement('li');
    li.className = 'trophy' + (earned ? ' earned' : '') + (trophy.id === selectedId ? ' selected' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = earned;
    checkbox.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
    checkbox.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = hidden ? 'Hidden trophy — earn it to reveal' : trophy.name;
    if (hidden) name.classList.add('hidden-name');
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Story trophy hidden by the spoiler setting.' : trophy.description;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const grade = document.createElement('span');
    grade.className = 'grade';
    const dot = document.createElement('span');
    dot.className = 'dot ' + trophy.grade;
    grade.appendChild(dot);
    grade.appendChild(document.createTextNode(trophy.grade));
    meta.appendChild(grade);
    const kind = document.createElement('span');
    kind.className = 'tag';
    kind.textContent = KIND_LABELS[trophy.kind] || trophy.kind;
    meta.appendChild(kind);
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'tag missable';
      flag.textContent = 'Missable';
      meta.appendChild(flag);
    }
    const target = formatCount(trophy);
    if (target) {
      const tag = document.createElement('span');
      tag.className = 'tag count';
      tag.textContent = target;
      meta.appendChild(tag);
    }
    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(meta);
    const side = document.createElement('div');
    side.textContent = earned ? 'Earned ✓' : '';
    li.appendChild(checkbox);
    li.appendChild(body);
    li.appendChild(side);
    li.addEventListener('click', () => onSelect(trophy.id));
    // Keyboard users get the same guide pane: focus a row and press Enter or Space.
    li.tabIndex = 0;
    li.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(trophy.id);
      }
    });
    listEl.appendChild(li);
  }
  countEl.textContent = 'Showing ' + trophies.length + ' of 55 trophies';
  emptyEl.hidden = trophies.length > 0;
}

export function renderGuidePane(paneEl, trophy, progress, spoilersOn, onNote) {
  paneEl.innerHTML = '';
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'guide-hint';
    hint.textContent = 'Click a trophy to open its guide here — what to do, when it can be missed, and its sources.';
    paneEl.appendChild(hint);
    return;
  }
  const hidden = spoilerHidden(trophy, progress, spoilersOn);
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden trophy' : trophy.name;
  paneEl.appendChild(title);
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden
    ? 'This story trophy is hidden by the spoiler setting. Earn it in the game (or tick it earned) to reveal its name and guide.'
    : trophy.description + ' — ' + trophy.grade + ' trophy.';
  paneEl.appendChild(official);
  if (!hidden) {
    const guideHead = document.createElement('h3');
    guideHead.textContent = 'Guide';
    paneEl.appendChild(guideHead);
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    paneEl.appendChild(guide);
    if (trophy.missable) {
      const miss = document.createElement('p');
      miss.textContent = 'Missable: earn this during its mission or chapter — treat it as missable until replay is confirmed.';
      paneEl.appendChild(miss);
    }
    const srcHead = document.createElement('h3');
    srcHead.textContent = 'Sources';
    paneEl.appendChild(srcHead);
    const list = document.createElement('ul');
    for (const source of trophy.sources || []) {
      const item = document.createElement('li');
      const match = source.match(/(https?:\/\/\S+)/);
      if (match) {
        item.appendChild(document.createTextNode(source.slice(0, match.index)));
        const link = document.createElement('a');
        link.href = match[1];
        link.textContent = match[1];
        link.rel = 'noopener';
        item.appendChild(link);
      } else {
        item.textContent = source;
      }
      list.appendChild(item);
    }
    paneEl.appendChild(list);
    const noteHead = document.createElement('h3');
    noteHead.textContent = 'Your note';
    paneEl.appendChild(noteHead);
    const area = document.createElement('textarea');
    area.value = progress.notes[trophy.id] || '';
    area.placeholder = 'e.g. 31 of 42 gold medals so far…';
    area.setAttribute('aria-label', 'Note for ' + trophy.name);
    area.addEventListener('change', () => onNote(trophy.id, area.value));
    paneEl.appendChild(area);
    const saved = document.createElement('p');
    saved.className = 'note-saved';
    saved.textContent = 'Notes save automatically with your progress.';
    paneEl.appendChild(saved);
  }
}

export function renderProgress(earnedEl, fillEl, gradeEl, trophies, progress) {
  const earned = Object.values(progress.earned).filter(Boolean).length;
  earnedEl.textContent = String(earned);
  fillEl.style.width = Math.round((earned / trophies.length) * 100) + '%';
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    if (progress.earned[trophy.id]) counts[trophy.grade] += 1;
  }
  gradeEl.textContent = counts.platinum + ' platinum · ' + counts.gold + ' gold · ' + counts.silver + ' silver · ' + counts.bronze + ' bronze';
}
