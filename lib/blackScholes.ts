// Black-Scholes-Merton pricing model with Greeks and IV solver

// Cumulative standard normal distribution using Hart approximation
function normCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absx = Math.abs(x);
  const t = 1.0 / (1.0 + p * absx);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absx * absx);
  return 0.5 * (1.0 + sign * y);
}

// Standard normal PDF
function normPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface BSInputs {
  S: number;   // stock price
  K: number;   // strike price
  T: number;   // time to expiration in years
  sigma: number; // volatility (decimal, e.g. 0.20 for 20%)
  r: number;   // risk-free rate (decimal)
  q: number;   // dividend yield (decimal)
}

export interface BSResult {
  callPrice: number;
  putPrice: number;
  d1: number;
  d2: number;
  delta: { call: number; put: number };
  gamma: number;
  theta: { call: number; put: number };
  vega: number;
  rho: { call: number; put: number };
}

export function blackScholes(inputs: BSInputs): BSResult {
  const { S, K, T, sigma, r, q } = inputs;

  if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) {
    const intrinsicCall = Math.max(S - K, 0);
    const intrinsicPut = Math.max(K - S, 0);
    return {
      callPrice: intrinsicCall,
      putPrice: intrinsicPut,
      d1: 0, d2: 0,
      delta: { call: S > K ? 1 : 0, put: S < K ? -1 : 0 },
      gamma: 0,
      theta: { call: 0, put: 0 },
      vega: 0,
      rho: { call: 0, put: 0 },
    };
  }

  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const Nd1 = normCDF(d1);
  const Nd2 = normCDF(d2);
  const Nd1n = normCDF(-d1);
  const Nd2n = normCDF(-d2);
  const nd1 = normPDF(d1);

  const callPrice = S * Math.exp(-q * T) * Nd1 - K * Math.exp(-r * T) * Nd2;
  const putPrice = K * Math.exp(-r * T) * Nd2n - S * Math.exp(-q * T) * Nd1n;

  // Delta
  const deltaCall = Math.exp(-q * T) * Nd1;
  const deltaPut = Math.exp(-q * T) * (Nd1 - 1);

  // Gamma (same for call and put)
  const gamma = (Math.exp(-q * T) * nd1) / (S * sigma * Math.sqrt(T));

  // Theta (per calendar day)
  const thetaCall = (
    -(S * Math.exp(-q * T) * nd1 * sigma) / (2 * Math.sqrt(T))
    - r * K * Math.exp(-r * T) * Nd2
    + q * S * Math.exp(-q * T) * Nd1
  ) / 365;

  const thetaPut = (
    -(S * Math.exp(-q * T) * nd1 * sigma) / (2 * Math.sqrt(T))
    + r * K * Math.exp(-r * T) * Nd2n
    - q * S * Math.exp(-q * T) * Nd1n
  ) / 365;

  // Vega (per 1% change in IV → divide by 100)
  const vega = (S * Math.exp(-q * T) * nd1 * Math.sqrt(T)) / 100;

  // Rho (per 1% change in rate → divide by 100)
  const rhoCall = (K * T * Math.exp(-r * T) * Nd2) / 100;
  const rhoPut = -(K * T * Math.exp(-r * T) * Nd2n) / 100;

  return {
    callPrice,
    putPrice,
    d1,
    d2,
    delta: { call: deltaCall, put: deltaPut },
    gamma,
    theta: { call: thetaCall, put: thetaPut },
    vega,
    rho: { call: rhoCall, put: rhoPut },
  };
}

// Newton-Raphson IV solver
export function impliedVolatility(
  marketPrice: number,
  S: number,
  K: number,
  T: number,
  r: number,
  q: number,
  optionType: "call" | "put",
  tolerance = 0.0001,
  maxIter = 100
): number | null {
  if (T <= 0 || marketPrice <= 0) return null;

  let sigma = 0.2; // initial guess

  for (let i = 0; i < maxIter; i++) {
    const bs = blackScholes({ S, K, T, sigma, r, q });
    const price = optionType === "call" ? bs.callPrice : bs.putPrice;
    const diff = price - marketPrice;

    if (Math.abs(diff) < tolerance) return sigma;

    // vega in full form (not per-1% scaled)
    const nd1 = normPDF(bs.d1);
    const vegaFull = S * Math.exp(-q * T) * nd1 * Math.sqrt(T);

    if (vegaFull < 1e-10) break;

    sigma = sigma - diff / vegaFull;

    // Clamp sigma to reasonable range
    if (sigma <= 0) sigma = 0.001;
    if (sigma > 5) sigma = 5;
  }

  // Final check
  const bs = blackScholes({ S, K, T, sigma, r, q });
  const price = optionType === "call" ? bs.callPrice : bs.putPrice;
  if (Math.abs(price - marketPrice) < 0.01) return sigma;

  return null;
}

// Expected move calculation
export function expectedMove(S: number, sigma: number, T: number): { dollar: number; percent: number } {
  const move = S * sigma * Math.sqrt(T);
  return { dollar: move, percent: (move / S) * 100 };
}

// Theta decay curve — returns array of { dte, value }
export function thetaDecayCurve(
  inputs: Omit<BSInputs, "T">,
  totalDTE: number,
  optionType: "call" | "put"
): Array<{ dte: number; value: number }> {
  const points: Array<{ dte: number; value: number }> = [];
  for (let dte = totalDTE; dte >= 0; dte--) {
    const T = dte / 365;
    if (T <= 0) {
      const intrinsic =
        optionType === "call"
          ? Math.max(inputs.S - inputs.K, 0)
          : Math.max(inputs.K - inputs.S, 0);
      points.push({ dte, value: intrinsic });
    } else {
      const bs = blackScholes({ ...inputs, T });
      points.push({ dte, value: optionType === "call" ? bs.callPrice : bs.putPrice });
    }
  }
  return points;
}

export { normCDF, normPDF };
