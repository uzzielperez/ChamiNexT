export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

export async function runCode(
  code: string,
  language = 'javascript',
  stdin = ''
): Promise<RunResult> {
  try {
    const res = await fetch('/.netlify/functions/code-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, stdin }),
    });
    return await res.json();
  } catch {
    return {
      stdout: '',
      stderr: 'Could not reach code runner. Continue with verbal explanation.',
      exitCode: 1,
      success: false,
    };
  }
}
