export function sortCompatibilityByScoreDesc(items = []) {
  return [...items].sort((left, right) => right.score - left.score)
}
