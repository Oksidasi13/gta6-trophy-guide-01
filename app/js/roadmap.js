// Roadmap to platinum and the missables page. Both are built from the official
// descriptions in trophies.json — chapter order, named missions, stranger strands,
// collectible counts — and both say plainly that the flags are not verified in-game.
export const ROADMAP_STAGES = [
  {
    title: 'Stage 1 — Story, in order',
    text: 'Play the story straight through: the opening mission Gone Fishing, then Chapters 1 to 4, the named missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. Do the story missions when they are offered and finish each one before moving on.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    title: 'Stage 2 — Strangers, before the finale',
    text: 'Finish every stranger strand before the final mission, while the characters are still available: the final missions for Andy, Kenton, Billy, Randy and Tyrone, Cal\u2019s fishing challenge, Bret\u2019s hunt, and three more strands to reach 8 in total. Stranger finals are the trophies most likely to be left behind.',
    ids: [20, 22, 23, 24, 25, 26, 27, 29],
  },
  {
    title: 'Stage 3 — Collectibles across Leonida',
    text: 'Sweep the map: meditate at all 18 spots, complete 3 card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas, buy all 8 garages and register 10 vehicles to the Scooter Bros app. Do these on shared trips — one drive can cover meditation spots, WAiNK locations and new vehicles at once.',
    ids: [28, 30, 31, 35, 42, 54, 55],
  },
  {
    title: 'Stage 4 — Activities and skill',
    text: 'Grind the repeatable activities: 250 stunts, gold in all 42 Shooting Range challenges, drone races at all 14 locations, 20 different race wins, one arcade game, bowling at Kolt & Associates, 50 challenges and one of each of the 9 activity types. The Shooting Range golds are the hardest skill trophy — leave plenty of time for them.',
    ids: [15, 16, 17, 18, 19, 21, 32, 46],
  },
  {
    title: 'Stage 5 — Combat, heists and money',
    text: 'Finish the combat and heist trophies in free roam: 5 enemies in one Combat Focus, the Rhino encounter, the jewelry store undetected, 5 bank vaults, one armored truck, one illegal operation for each of the 9 gangs, the 4-star escape and the 3-shop streak with your partner, the VCIA departure and the melee drive-by. Launder $250,000 of marked bills and spend $100,000 in shops as you go.',
    ids: [33, 34, 36, 37, 38, 39, 40, 41, 43, 51, 52, 53],
  },
  {
    title: 'Stage 6 — Cleanup and the platinum',
    text: 'Mop up the slow counters — 500 choices, the strange event, a second-try success, the partnership moment and the Ocean Beach cocktail — then check the game\u2019s own 100% completion counter. When it hits 100%, A Long Road (gold) pops, and with every other trophy earned, Vice Got a Price! — the platinum — follows.',
    ids: [1, 14, 44, 45, 47, 48, 49, 50],
  },
];

export function renderRoadmap(viewEl, trophies, progress) {
  viewEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Roadmap to platinum';
  viewEl.appendChild(title);
  const warn = document.createElement('p');
  warn.className = 'warn';
  warn.textContent = 'Built from the official trophy descriptions: chapter order, named missions, stranger strands and collectible counts. Missable flags are built the same way and are NOT yet verified in-game — the game released today, so treat every flag as a caution, not a confirmed fact.';
  viewEl.appendChild(warn);
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const block = document.createElement('div');
    block.className = 'stage';
    const head = document.createElement('h3');
    const done = stage.ids.filter((id) => progress.earned[id]).length;
    head.textContent = stage.title + ' — ' + done + ' of ' + stage.ids.length + ' earned';
    block.appendChild(head);
    const text = document.createElement('p');
    text.textContent = stage.text;
    block.appendChild(text);
    const covers = document.createElement('p');
    covers.className = 'covers';
    covers.textContent = 'Covers: ' + stage.ids.map((id) => {
      const t = byId.get(id);
      return t ? (progress.earned[id] ? '✓ ' : '') + t.name : '#' + id;
    }).join(' · ');
    block.appendChild(covers);
    viewEl.appendChild(block);
  }
}

export function renderMissables(viewEl, trophies, progress) {
  viewEl.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Missable trophies';
  viewEl.appendChild(title);
  const warn = document.createElement('p');
  warn.className = 'warn';
  warn.textContent = 'These 20 trophies are flagged from their official descriptions: story missions, chapters and stranger strands are one-shot moments in most games, so they are treated as missable until replay is confirmed. Free-roam activities, collectibles and combat trophies are not flagged — they stay available after the story. Nothing here is verified in-game yet.';
  viewEl.appendChild(warn);
  const flagged = trophies.filter((t) => t.missable);
  const list = document.createElement('ul');
  list.className = 'trophies';
  for (const trophy of flagged) {
    const earned = Boolean(progress.earned[trophy.id]);
    const item = document.createElement('li');
    item.className = 'trophy' + (earned ? ' earned' : '');
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = (earned ? '✓ ' : '') + trophy.name;
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = trophy.description + ' — earn during its mission or chapter; treat as missable until replay is confirmed.';
    body.appendChild(name);
    body.appendChild(desc);
    item.appendChild(document.createElement('span'));
    item.appendChild(body);
    const grade = document.createElement('span');
    grade.className = 'grade';
    const dot = document.createElement('span');
    dot.className = 'dot ' + trophy.grade;
    grade.appendChild(dot);
    grade.appendChild(document.createTextNode(trophy.grade));
    item.appendChild(grade);
    list.appendChild(item);
  }
  viewEl.appendChild(list);
}
