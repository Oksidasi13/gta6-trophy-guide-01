// Trophy filtering: kind, grade, earned status, missable-only and free text search.
// One small pure function, so the checklist view and the counts stay in agreement.
export function filterTrophies(trophies, progress, filters) {
  const query = (filters.query || '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    const earned = Boolean(progress.earned[trophy.id]);
    if (filters.status === 'earned' && !earned) return false;
    if (filters.status === 'unearned' && earned) return false;
    if (filters.missableOnly && !trophy.missable) return false;
    if (query) {
      const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind, trophy.grade].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function countByGrade(trophies, progress) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    if (progress.earned[trophy.id]) counts[trophy.grade] += 1;
  }
  return counts;
}

export function countMissable(trophies) {
  return trophies.filter((trophy) => trophy.missable);
}
