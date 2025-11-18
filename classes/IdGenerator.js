// classes/IdGenerator.js
// @ts-check

/**
 * Simple incremental ID generator.
 *
 * ❗IMPORTANT:
 * - This is meant for in-memory use in this educational project.
 * - It is NOT cryptographically secure.
 * - It is NOT suitable for public APIs where ID enumeration matters.
 */
export class IdGenerator {
  /** @type {number} */
  #counter;

  /**
   * @param {Object} [options]
   * @param {number} [options.startAt=1]  - Initial counter value
   */
  constructor({ startAt = 1 } = {}) {
    if (
      typeof startAt !== "number" ||
      !Number.isInteger(startAt) ||
      startAt < 0
    ) {
      throw new Error("ID_GENERATOR_START_AT_MUST_BE_NON_NEGATIVE_INTEGER");
    }

    this.#counter = startAt;
  }

  /**
   * Generate the next ID.
   *
   * @param {string} [prefix] - Optional prefix like "ACC" or "TX"
   * @returns {string}        - e.g. "1", "ACC-2", "TX-3"
   */
  next(prefix) {
    this.#counter += 1;
    const idNumber = this.#counter;

    if (prefix) {
      return `${prefix}-${idNumber}`;
    }

    return String(idNumber);
  }

  /**
   * Get the current counter value (for debugging/tests).
   *
   * @returns {number}
   */
  getCurrentValue() {
    return this.#counter;
  }
}
