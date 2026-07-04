import type { DrillVerdict } from '../data/rapidFireDrill';
import type { PracticeTrack } from '../types/interview';

export interface DrillGradeItem {
  id: string;
  verdict: DrillVerdict;
  ideal: string;
  note: string;
}

export interface DrillGradeResponse {
  graded: boolean;
  results?: DrillGradeItem[];
  summary?: string;
}

/** Batch-grade a drill. Returns { graded: false } when AI grading is unavailable. */
export async function callDrillAgent(
  track: PracticeTrack,
  items: { id: string; question: string; answer: string }[]
): Promise<DrillGradeResponse> {
  try {
    const res = await fetch('/.netlify/functions/drill-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track, items }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as DrillGradeResponse;
    return data.graded && Array.isArray(data.results) ? data : { graded: false };
  } catch {
    return { graded: false };
  }
}
