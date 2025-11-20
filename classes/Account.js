// classes/Account.js
// @ts-check

import { Transaction } from "./Transaction.js";

/**
 * @abstract
 * Base class for all Account types.
 */
export class Account {
  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.owner
   * @param {string} params.currency
   * @param {number} params.initialBalance
   * @param {import("./IdGenerator.js").IdGenerator} params.transactionIdGen
   * @param {Date}   [params.createdAt]
   */
  constructor({
    id,
    owner,
    currency,
    initialBalance = 0,
    transactionIdGen,
    createdAt = new Date(),
  }) {
    // Abstract class enforcement
    if (new.target === Account) {
      throw new Error("CANNOT_INSTANTIATE_ABSTRACT_CLASS");
    }

    if (!transactionIdGen) {
      throw new Error("ACCOUNT_MISSING_TRANSACTION_ID_GENERATOR");
    }

    this.id = id;
    this.owner = owner;
    this.currency = currency;
    this.createdAt = createdAt;
    this.isClosed = false;

    this._transactionIdGen = transactionIdGen;

    this.#balance = initialBalance;
  }

  // PRIVATE FIELD
  #balance;

  // ------------------------------
  // PUBLIC API
  // ------------------------------

  deposit(amount) {
    this._assertOpen();
    this._assertAmount(amount);

    this.#balance += amount;

    return this._createTransaction("deposit", amount);
  }

  withdraw(amount) {
    this._assertOpen();
    this._assertAmount(amount);

    const currentBalance = this.getBalance();
    const newBalance = currentBalance - amount;

    if (newBalance < 0) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    this._setBalance(newBalance);

    return this._createTransaction("withdrawal", amount);
  }

  getBalance() {
    return this.#balance;
  }

  getSnapshot() {
    return {
      id: this.id,
      owner: this.owner,
      currency: this.currency,
      balance: this.#balance,
      createdAt: this.createdAt.toISOString(),
      isClosed: this.isClosed,
    };
  }

  // ------------------------------
  // PROTECTED VALIDATION HELPERS
  // ------------------------------

  _assertAmount(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("AMOUNT_MUST_BE_POSITIVE_NUMBER");
    }
  }

  _assertOpen() {
    if (this.isClosed) {
      throw new Error("ACCOUNT_IS_CLOSED");
    }
  }

  _assertCurrency(currency) {
    if (currency !== this.currency) {
      throw new Error("CURRENCY_MISMATCH");
    }
  }

  /**
   * Protected helper to update the private balance.
   * Subclasses should use this instead of touching #balance.
   *
   * @protected
   * @param {number} newBalance
   */
  _setBalance(newBalance) {
    this.#balance = newBalance;
  }

  // ------------------------------
  // PROTECTED TRANSACTION FACTORY
  // ------------------------------

  _createTransaction(type, amount, meta = {}) {
    const txId = this._transactionIdGen.next("TX");

    return new Transaction({
      id: txId,
      type,
      accountId: this.id,
      amount,
      currency: this.currency,
      meta,
    });
  }
}
