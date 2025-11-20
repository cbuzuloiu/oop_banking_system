// classes/CurrentAccount.js
// @ts-check

import { Account } from "./Account.js";

/**
 * CurrentAccount
 *  - Allows overdraft up to `overdraftLimit`.
 *  - Inherits deposit() and most behavior from Account.
 */
export class CurrentAccount extends Account {
  /**
   * @param {Object} params
   * @param {string} params.id
   * @param {string} params.owner
   * @param {string} params.currency
   * @param {number} params.initialBalance
   * @param {number} params.overdraftLimit
   * @param {import("./IdGenerator.js").IdGenerator} params.transactionIdGen
   * @param {Date}   [params.createdAt]
   */
  constructor({
    overdraftLimit,
    ...baseParams
  }) {
    // baseParams = { id, owner, currency, initialBalance, transactionIdGen, createdAt }
    super(baseParams);

    if (
      typeof overdraftLimit !== "number" ||
      Number.isNaN(overdraftLimit) ||
      overdraftLimit < 0
    ) {
      throw new Error("OVERDRAFT_LIMIT_MUST_BE_NON_NEGATIVE_NUMBER");
    }

    /** @type {number} */
    this.overdraftLimit = overdraftLimit;
  }

  /**
   * Withdraw money with overdraft support.
   * Can go down to -overdraftLimit.
   *
   * @override
   * @param {number} amount
   * @returns {import("./Transaction.js").Transaction}
   */
  withdraw(amount) {
    this._assertOpen();
    this._assertAmount(amount);

    const currentBalance = this.getBalance();
    const newBalance = currentBalance - amount;

    if (newBalance < -this.overdraftLimit) {
      throw new Error("OVERDRAFT_EXCEEDED");
    }

    this._setBalance(newBalance);

    return this._createTransaction("withdrawal", amount, {
      overdraftLimit: this.overdraftLimit,
    });
  }

  /**
   * Extend base snapshot with account kind and overdraft info.
   * @returns {Object}
   */
  getSnapshot() {
    const base = super.getSnapshot();
    return {
      ...base,
      kind: "current",
      overdraftLimit: this.overdraftLimit,
    };
  }
}
