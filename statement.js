export function statement(invoice) {
  return invoice.plainText();
}

class Play {
  #name;
  #type;

  constructor(name, type) {
    this.#name = name;
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }
}

class TragedyPlay extends Play {
  #baseAmount;

  constructor(name) {
    super(name, 'tragedy');
    this.#baseAmount = 40000;
  }

  get baseAmount() {
    return this.#baseAmount;
  }

  amount(audience) {
    let amount = this.baseAmount;
    return audience > 30 
      ? amount += 1000 * (audience - 30)
      : amount;
  }
}

class Comedy extends Play {
  #baseAmount;

  constructor(name) {
    super(name, 'comedy');
    this.#baseAmount = 30000;
  }

  get baseAmount() {
    return this.#baseAmount;
  }

  amount(audience) {
    let amount = this.baseAmount;
    if (audience > 20) {
      amount += 10000 + 500 * (audience - 20);
    }
    amount += 300 * audience
    return amount;
  }
}

class Performance {
  #play;
  #audience;

  constructor(play, audience) {
    this.#play = play;
    this.#audience = audience;
  }

  get play() {
    return this.#play;
  }

  get audience() {
    return this.#audience;
  }

  get volumeCredit() {
    let credits = Math.max(this.audience - 30, 0);
    return this.play.type === 'comedy' 
      ? credits +  Math.floor(this.audience / 5)
      : credits;
  }
}

class Invoice {
  #customer;
  #performances;

  constructor(customer, performances) {
    this.#customer = customer;
    this.#performances = performances;

    this.format = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format;
  }

  get customer() {
    return this.#customer;
  }

  get performances() {
    return this.#performances;
  }

  totalAmount() {
    return this.format(this.#performances
              .map(performance => performance.play.amount(performance.audience))
              .reduce((sum, amount) => sum + amount, 0) / 100);
  }

  totalVolumeCredits() {
    return this.#performances
            .map(performance => performance.volumeCredit)
            .reduce((sum, credit) => sum + credit, 0);
  }

  plainText() {
    return this.#plainTextCustomer()
        + this.#planTextPerfomances() 
        + this.#plainTextTotalAmount()
        + this.#plainTotalVolumeCredits();
  }

  #plainTextCustomer() {
    return `청구 내역 (고객명: ${this.customer})\n`;
  }

  #planTextPerfomances() {
    let result = '';
    result += this.#performances.map(performance => `  ${performance.play.name}: ${this.format(performance.play.amount(performance.audience) / 100)} (${performance.audience}석)`).join('\n');
    return result += '\n';
  }

  #plainTextTotalAmount() {
    return `총액: ${this.totalAmount()}\n`;
  }

  #plainTotalVolumeCredits() {
    return `적립 포인트: ${this.totalVolumeCredits()}점\n`;
  }
}

const invoice = new Invoice(
  'BigCo', 
  [new Performance(new TragedyPlay('Hamlet'), 55), new Performance(new Comedy('As You Like It'), 35), new Performance(new TragedyPlay('Othello'), 40),]
)

const result = statement(invoice);
const expected =
  '청구 내역 (고객명: BigCo)\n' +
  '  Hamlet: $650.00 (55석)\n' +
  '  As You Like It: $580.00 (35석)\n' +
  '  Othello: $500.00 (40석)\n' +
  '총액: $1,730.00\n' +
  '적립 포인트: 47점\n';
console.log(result);
console.log(result === expected);