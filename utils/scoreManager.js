
const fs = require('fs');
const path = './data/scores.json';

function loadScores() {
  if (!fs.existsSync(path)) return {};
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function saveScores(scores) {
  fs.writeFileSync(path, JSON.stringify(scores, null, 2));
}

function addPoints(username, amount) {
  const scores = loadScores();
  scores[username] = (scores[username] || 0) + amount;
  saveScores(scores);
}

function removePoints(username, amount) {
  const scores = loadScores();
  scores[username] = Math.max((scores[username] || 0) - amount, 0);
  saveScores(scores);
}

function resetScores() {
  saveScores({});
}

function getLeaderboard() {
  const scores = loadScores();
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
}

module.exports = {
  addPoints,
  removePoints,
  resetScores,
  getLeaderboard,
  loadScores
};
