/**
 * Recursively freezes an object (deep immutability).
 * @param {Object} obj
 * @returns {Object} The same object, fully frozen.
 */
export function deepFreeze(obj) {
  // First freeze the top-level object
  Object.freeze(obj);

  // Then recursively deep freeze each property
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];

    // If value is an object and not already frozen, freeze it
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return obj;
}
