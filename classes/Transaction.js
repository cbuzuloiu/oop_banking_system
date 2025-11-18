// @ts-check
import { deepFreeze } from "../utils/deepFreeze.js";

// We keep Transaction as a **pure data object**.
// It does NOT know about Bank or Account implementations.
// It just represents "what happened".
// Transaction represents an immutable financial record.

export class Transaction {
  /**
   * @param {Object} params
   * @param {string} params.id            - Unique transaction ID
   * @param {"deposit" | "withdrawal" | "transfer" | "interest"} params.type
   * @param {string} params.accountId     - ID of the account affected
   * @param {number} params.amount        - Positive number (business logic enforces this)
   * @param {string} params.currency      - E.g. "EUR", "USD"
   * @param {Date}   [params.createdAt]   - Defaults to now
   * @param {Object} [params.meta]        - Extra info (e.g. { fromId, toId } for transfers)
   */
  constructor({
    id,
    type,
    accountId,
    amount,
    currency,
    createdAt = new Date(),
    meta = {},
  }) {
    // Basic sanity checks (not full business validation – that belongs to Bank/Account)
    if (!id) throw new Error("TRANSACTION_ID_REQUIRED");
    if (!type) throw new Error("TRANSACTION_TYPE_REQUIRED");
    if (!accountId) throw new Error("TRANSACTION_ACCOUNT_ID_REQUIRED");
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      throw new Error("TRANSACTION_AMOUNT_MUST_BE_NUMBER");
    }
    if (!currency) throw new Error("TRANSACTION_CURRENCY_REQUIRED");

    this.id = id;
    this.type = type;
    this.accountId = accountId;
    this.amount = amount;
    this.currency = currency;
    this.createdAt = createdAt;
    this.meta = meta;

    // FULL deep immutability
    deepFreeze(this);
  }

  /**
   * Convenience method for logging / debugging.
   * Returns a plain object (safe to JSON.stringify).
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      accountId: this.accountId,
      amount: this.amount,
      currency: this.currency,
      createdAt: this.createdAt.toISOString(),
      meta: this.meta,
    };
  }
}
