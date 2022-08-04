let startBalance = 1000;
let history = [];
let balance;
let counter = 0;

const coins = [{
  heads: -29,
  tails: +40,
}, {
  heads: -41,
  tails: +70,
}, {
  heads: -67,
  tails: +200,
}];

function initState() {
  balance = startBalance;
  counter = 0;
  history = [];
  history.push({
    round: counter,
    balance: balance,
    diff: 0,
    modifier: 0,
    win: false,
    lose: false,
  });
}

initState();

function flipCoin() {
  const coin = findSelectedCoin();
  const headsOrTails = (Math.random() >= 0.5)? 'heads' : 'tails';
  const modifier = coin[headsOrTails];
  const diff = (Math.abs(balance) * modifier / 100);
  balance += diff;
  counter++;
  logHistory(counter, headsOrTails, modifier, diff, balance);
  redraw();
  addTableRow(counter, headsOrTails, modifier, diff, balance);
}

function findSelectedCoin() {
  const coinInput = document.querySelector('input[name="coin"]:checked').value;
  return coins[coinInput];
}

function redraw() {
  const balanceOutput = document.getElementById("balance");
  balanceOutput.innerHTML = "BALANCE: $" + balance.toFixed(2);
  const counterOutput = document.getElementById("counter");
  counterOutput.innerHTML = "ROUND #" + (counter + 1);
  console.log(balance);

  const summary = calculateSummary(counter, history);
  const totalFlips = document.getElementById("total-flips");
  totalFlips.innerHTML = summary.totalFlips;
  const totalWins = document.getElementById("total-wins");
  totalWins.innerHTML = summary.totalWins;
  const totalLosses = document.getElementById("total-losses");
  totalLosses.innerHTML = summary.totalLosses;
  const winPercentage = document.getElementById("win-percentage");
  winPercentage.innerHTML = summary.winPercentage.toFixed(0) + '%';
  const totalAmountWon = document.getElementById("total-amount-won");
  totalAmountWon.innerHTML = '$' + summary.totalAmountWon.toFixed(2);
  const totalAmountLost = document.getElementById("total-amount-lost");
  totalAmountLost.innerHTML = '$' + Math.abs(summary.totalAmountLost).toFixed(2);
  const averageBalance = document.getElementById("average-balance");
  averageBalance.innerHTML = '$' + summary.averageBalance.toFixed(2);
}

function reset() {
  initState();
  redraw();
  const body = document.querySelector("#transactions tbody");
  for (let i = body.children.length - 1; i > 0; i--) {
    body.children[i].remove();
  }
}

function addTableRow(counter, headsOrTails, modifier, diff, balance) {
  const body = document.querySelector("#transactions tbody");
  const newRow = body.insertRow();
  newRow.className = headsOrTails === 'heads' ? 'lose-row' : 'win-row';
  insertCell(newRow, counter);
  insertCell(newRow, headsOrTails === 'heads' ? 'LOSE' : 'WIN');
  insertCell(newRow, (diff > 0 ? '+' : '') + diff.toFixed(2) + '$');
  insertCell(newRow, (modifier > 0 ? '+' : '') + modifier + '%');
  insertCell(newRow, '$' + balance.toFixed(2));
}

function insertCell(row, text) {
  const newCell = row.insertCell();
  const newText = document.createTextNode(text);
  newCell.appendChild(newText);
  return newCell;
}

function logHistory(counter, headsOrTails, modifier, diff, balance) {
  history.push({
    round: counter,
    balance: balance,
    diff: diff,
    modifier: modifier,
    win: headsOrTails !== 'heads',
    lose: headsOrTails === 'heads',
  });
}

function calculateSummary(counter, history) {
  let allWins = history.filter(e => e.win);
  let allLosses = history.filter(e => e.lose);
  return {
    totalFlips: counter,
    totalWins: allWins.length,
    totalLosses: allLosses.length,
    winPercentage: allWins.length / (allLosses.length + allWins.length) * 100,
    totalAmountWon: allWins.reduce((acc, e) => acc + e.diff, 0),
    totalAmountLost: allLosses.reduce((acc, e) => acc + e.diff, 0),
    averageBalance: history.reduce((acc, e) => acc + e.balance, 0) / history.length,
  }
}
