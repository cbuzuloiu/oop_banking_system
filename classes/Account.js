// classes/Account.js
// @ts-check

import { Transaction } from "./Transaction.js";

/**
 * @abstract
 * Base class for all Account types.
 * Cannot be instantiated directly.
 */
export class Account {
  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.owner
   * @param {string} params.currency
   * @param {number} params.initialBalance
   * @param {Date}   [params.createdAt]
   */
  constructor({
    id,
    owner,
    currency,
    initialBalance = 0,
    createdAt = new Date(),
  }) {
    // 🛑 STRICT ABSTRACT CLASS CHECK
    if (new.target === Account) {
      throw new Error("CANNOT_INSTANTIATE_ABSTRACT_CLASS");
    }

    /** @private */
    this.id = id;
    this.owner = owner;
    this.currency = currency;
    this.createdAt = createdAt;
    this.isClosed = false;

    /** @private @type {number} */
    this.#balance = initialBalance;
  }

  // ---------------------------
  // PRIVATE FIELD
  // ---------------------------
  #balance;

  // ---------------------------
  // PUBLIC API
  // ---------------------------

  /**
   * Deposit money into the account.
   * @param {number} amount
   * @returns {Transaction}
   */
  deposit(amount) {
    this._assertOpen();
    this._assertAmount(amount);

    this.#balance += amount;

    return this._createTransaction("deposit", amount);
  }

  /**
   * Withdraw money from the account.
   * Default logic: NO OVERDRAFT ALLOWED.
   * Subclasses like CurrentAccount may override this.
   *
   * @param {number} amount
   * @returns {Transaction}
   */
  withdraw(amount) {
    this._assertOpen();
    this._assertAmount(amount);

    const newBalance = this.#balance - amount;

    if (newBalance < 0) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    this.#balance = newBalance;

    return this._createTransaction("withdrawal", amount);
  }

  /**
   * Read-only balance.
   * @returns {number}
   */
  getBalance() {
    return this.#balance;
  }

  /**
   * Return a public snapshot of the account info.
   * @returns {Object} DTO
   */
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

  // ---------------------------
  // PROTECTED (simulated) HELPERS
  // ---------------------------

  /**
   * Ensure amount is valid.
   * @protected
   * @param {number} amount
   */
  _assertAmount(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("AMOUNT_MUST_BE_POSITIVE_NUMBER");
    }
  }

  /**
   * Ensure the account is open.
   * @protected
   */
  _assertOpen() {
    if (this.isClosed) {
      throw new Error("ACCOUNT_IS_CLOSED");
    }
  }

  /**
   * Ensure currency matches account currency.
   * (Useful later for multi-currency transfers)
   *
   * @protected
   * @param {string} currency
   */
  _assertCurrency(currency) {
    if (currency !== this.currency) {
      throw new Error("CURRENCY_MISMATCH");
    }
  }

  /**
   * Create a Transaction object.
   * This centralizes transaction creation logic.
   *
   * @protected
   * @param {"deposit"|"withdrawal"|"transfer"|"interest"} type
   * @param {number} amount
   * @param {Object} [meta]
   */
  _createTransaction(type, amount, meta = {}) {
    return new Transaction({
      id: crypto.randomUUID(), // temporary, replaced later with IdGenerator
      type,
      accountId: this.id,
      amount,
      currency: this.currency,
      meta,
    });
  }
}
