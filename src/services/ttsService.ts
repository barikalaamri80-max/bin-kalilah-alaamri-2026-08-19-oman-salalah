/**
 * TTS Service calling Gemini 3.8 Flash TTS endpoint
 */

export interface TTSResponse {
  audio: string;
  mimeType: string;
}

export async function generateSpeechAudio(
  text: string,
  voice: string = 'Fenrir',
  style: string = 'Authoritative, calm, judicial narrator in Arabic'
): Promise<string> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice,
      style,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `Speech generation failed with status ${response.status}`);
  }

  const data: TTSResponse = await response.json();
  return `data:${data.mimeType || 'audio/wav'};base64,${data.audio}`;
}
