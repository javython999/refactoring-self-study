export function statement(invoice) {

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  let totalAmount = 0;
  let detail = "";
  for (let performance of invoice.performances) {
    const play = performance.play;
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy': // 비극
        thisAmount = 40000;
        if (performance.audience > 30) {
          thisAmount += 1000 * (performance.audience - 30);
        }
        break;
      case 'comedy': // 희극
        thisAmount = 30000;
        if (performance.audience > 20) {
          thisAmount += 10000 + 500 * (performance.audience - 20);
        }
        thisAmount += 300 * performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }
    totalAmount += thisAmount;

    // 청구 내역을 출력한다.
    detail += `  ${play.name}: ${format(thisAmount / 100)} (${performance.audience}석)\n`;
    
  }

  
  // 포인트를 적립한다.
  let volumeCredits = 0;
  for (let performance of invoice.performances) {
    const play = performance.play;
    volumeCredits += Math.max(performance.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === play.type) volumeCredits += Math.floor(performance.audience / 5);
  }

  
  function getResult(customer, detail, totalAmount, volumeCredits) {
    return `청구 내역 (고객명: ${customer})\n${detail}총액: ${totalAmount}\n적립 포인트: ${volumeCredits}점\n`;
  }

  return getResult(invoice.customer, detail, format(totalAmount / 100), volumeCredits);
}

// 사용예:
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
}

const invoicesJSON = [
  {
    customer: 'BigCo',
    performances: [
      new Performance(new Play('Hamlet', 'tragedy'), 55),
      new Performance(new Play('As You Like It', 'comedy'), 35),
      new Performance(new Play('Othello', 'tragedy'), 40),
    ],
  },
];

const result = statement(invoicesJSON[0]);
const expected =
  '청구 내역 (고객명: BigCo)\n' +
  '  Hamlet: $650.00 (55석)\n' +
  '  As You Like It: $580.00 (35석)\n' +
  '  Othello: $500.00 (40석)\n' +
  '총액: $1,730.00\n' +
  '적립 포인트: 47점\n';
console.log(result);
console.log(result === expected);