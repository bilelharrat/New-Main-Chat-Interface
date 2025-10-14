export type VerifyStatus = 'verified' | 'flagged' | 'unverified';

export interface VerifyResult {
  status: VerifyStatus;
  confidence: number;
}

const CITE_NUMERIC = /\[\d+\]/;
const CITE_AUTHOR_YEAR = /\([^)]+\b\d{4}\b[^)]*\)/;

export function fakeVerify(text: string): VerifyResult {
  const t = (text ?? '').trim();
  if (t.length < 40) return { status: 'unverified', confidence: 0.3 };
  const hasCitation = CITE_NUMERIC.test(t) || CITE_AUTHOR_YEAR.test(t);
  return hasCitation
    ? { status: 'verified', confidence: 0.92 }
    : { status: 'flagged', confidence: 0.56 };
}
