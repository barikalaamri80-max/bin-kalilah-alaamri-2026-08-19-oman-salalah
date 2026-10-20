/**
 * Live Voice Service bridging to gemini-3.8-live over WebSocket
 */

export interface LiveMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export class LiveVoiceClient {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isMuted: boolean = false;
  private onMessageCallback: ((msg: LiveMessage) => void) | null = null;
  private onStatusChangeCallback: ((status: 'idle' | 'connecting' | 'connected' | 'speaking' | 'error') => void) | null = null;
  private nextPlayTime: number = 0;

  constructor(
    onMessage?: (msg: LiveMessage) => void,
    onStatusChange?: (status: 'idle' | 'connecting' | 'connected' | 'speaking' | 'error') => void
  ) {
    if (onMessage) this.onMessageCallback = onMessage;
    if (onStatusChange) this.onStatusChangeCallback = onStatusChange;
  }

  public async connect(): Promise<void> {
    this.updateStatus('connecting');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/live`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = async () => {
      console.log('Live Voice WebSocket connected');
      this.updateStatus('connected');
      await this.startMicrophoneCapture();
    };

    this.ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'audio' && data.audio) {
          this.updateStatus('speaking');
          await this.playAudioChunk(data.audio);
        } else if (data.type === 'text' && data.text) {
          if (this.onMessageCallback) {
            this.onMessageCallback({
              id: Math.random().toString(),
              sender: 'model',
              text: data.text,
              timestamp: new Date(),
            });
          }
        } else if (data.type === 'interrupted') {
          this.stopAudioPlayback();
          this.updateStatus('connected');
        } else if (data.type === 'error') {
          console.error('Server error in live session:', data.error);
          this.updateStatus('error');
        }
      } catch (e) {
        console.error('Error parsing live WS message:', e);
      }
    };

    this.ws.onerror = (err) => {
      console.error('Live Voice WS error:', err);
      this.updateStatus('error');
    };

    this.ws.onclose = () => {
      console.log('Live Voice WS closed');
      this.disconnect();
    };
  }

  private updateStatus(status: 'idle' | 'connecting' | 'connected' | 'speaking' | 'error') {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  private async startMicrophoneCapture(): Promise<void> {
    try {
      this.inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      // ScriptProcessor with 4096 buffer size
      this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = this.floatTo16BitPCM(inputData);
        const base64Audio = this.arrayBufferToBase64(pcm16.buffer);

        this.ws.send(
          JSON.stringify({
            type: 'audio',
            audio: base64Audio,
          })
        );
      };

      source.connect(this.processor);
      this.processor.connect(this.inputAudioCtx.destination);
    } catch (err) {
      console.error('Microphone access failed:', err);
      this.updateStatus('error');
    }
  }

  public sendTextMessage(text: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', text }));
      if (this.onMessageCallback) {
        this.onMessageCallback({
          id: Math.random().toString(),
          sender: 'user',
          text,
          timestamp: new Date(),
        });
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  private async playAudioChunk(base64Audio: string): Promise<void> {
    try {
      if (!this.outputAudioCtx) {
        this.outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }

      if (this.outputAudioCtx.state === 'suspended') {
        await this.outputAudioCtx.resume();
      }

      const binary = atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // 16-bit PCM (little endian) to Float32
      const numSamples = Math.floor(len / 2);
      const float32Data = new Float32Array(numSamples);
      const dataView = new DataView(bytes.buffer);

      for (let i = 0; i < numSamples; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32Data[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
      }

      const audioBuffer = this.outputAudioCtx.createBuffer(1, numSamples, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioCtx.destination);

      const currentTime = this.outputAudioCtx.currentTime;
      const startTime = Math.max(currentTime, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;

      source.onended = () => {
        if (this.outputAudioCtx && this.outputAudioCtx.currentTime >= this.nextPlayTime - 0.05) {
          this.updateStatus('connected');
        }
      };
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  }

  private stopAudioPlayback() {
    this.nextPlayTime = 0;
  }

  public disconnect(): void {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioCtx) {
      this.inputAudioCtx.close().catch(() => {});
      this.inputAudioCtx = null;
    }
    if (this.outputAudioCtx) {
      this.outputAudioCtx.close().catch(() => {});
      this.outputAudioCtx = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateStatus('idle');
  }

  private floatTo16BitPCM(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
  }

  private arrayBufferToBase64(buffer: ArrayBufferLike): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
