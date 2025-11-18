"use strict";
import { Transaction } from "./classes/Transaction.js";
import { IdGenerator } from "./classes/IdGenerator.js";

// --- TRANSACTION ---
const tx1 = new Transaction({
  id: "TX-1",
  type: "deposit",
  accountId: "ACC-1",
  amount: 500,
  currency: "EUR",
});

const tx2 = new Transaction({
  id: "TX-2",
  type: "withdrawal",
  accountId: "ACC-1",
  amount: 100,
  currency: "EUR",
});

const tx3 = new Transaction({
  id: "TX-3",
  type: "transfer",
  accountId: "ACC-1",
  amount: 50,
  currency: "EUR",
  meta: {
    fromId: "ACC-1",
    toId: "ACC-2",
    details: { purpose: "test transfer" },
  },
});

// tx1.amount = 999;

console.log("Tr1: ", tx1.toJSON());
console.log("Tr2: ", tx2.toJSON());
console.log("Tr3: ", tx3.toJSON());

// --- ID GENERATOR ---

const gen = new IdGenerator({ startAt: 0 });
console.log(gen.next("ACC"));
console.log(gen.next("ACC"));
console.log(gen.next("ACC"));
console.log(gen.next("TX"));
console.log(gen.next("TX"));
console.log(gen.next());
console.log(gen.getCurrentValue());
