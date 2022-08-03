let startBalance = 1000;
let history = [];

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

let selectedCoin = coins[0];
let balance = startBalance;
history.push(balance);
let counter = 0;

function flipCoin() {
  findSelectedCoin();
  const headsOrTails = (Math.random() >= 0.5)? 'heads' : 'tails';
  const modifier = selectedCoin[headsOrTails];
  const diff = (Math.abs(balance) * modifier / 100);
  balance += diff;
  history.push(balance);
  counter++;
  redraw();
  addTableRow(counter, headsOrTails, modifier, diff, balance);
}

function findSelectedCoin() {
  const coinInput = document.querySelector('input[name="coin"]:checked').value;
  selectedCoin = coins[coinInput];
}

function redraw() {
  const balanceOutput = document.getElementById("balance");
  balanceOutput.innerHTML = "BALANCE: $" + balance.toFixed(2);
  const counterOutput = document.getElementById("counter");
  counterOutput.innerHTML = "FLIPS: " + counter;
  console.log(balance);
}

function reset() {
  balance = startBalance;
  history = [];
  counter = 0;
  redraw();
  const body = document.querySelector("#transactions tbody");
  for (let i = body.children.length - 1; i > 0; i--) {
    body.children[i].remove();
  }
}

function addTableRow(counter, headsOrTails, modifier, diff, balance) {
  const body = document.querySelector("#transactions tbody");
  const newRow = body.insertRow();
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
