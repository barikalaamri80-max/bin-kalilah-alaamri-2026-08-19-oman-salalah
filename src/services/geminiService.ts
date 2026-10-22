/**
 * Client service for querying the Legal & Strategic AI Advisor (/api/ai/ask)
 */

export async function askLegalAdvisor(prompt: string, context?: string): Promise<string> {
  const response = await fetch('/api/ai/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, context }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'تعذر الاتصال بالمستشار الذكي' }));
    throw new Error(err.error || 'تعذر الاتصال بالمستشار الذكي');
  }

  const data = await response.json();
  return data.answer || 'لم يتم استلام رد من المستشار الذكي.';
}
