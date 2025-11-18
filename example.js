class Account {
  #balance; // private field

  constructor(owner, currency, balance = 0) {
    this.owner = owner;
    this.currency = currency;
    this.#balance = balance;
  }

  deposit(amount) {
    // TODO: add validation and increase balance
  }

  withdraw(amount) {
    // TODO: decrease balance with checks
  }

  getBalance() {
    // TODO: return current balance
  }
}
