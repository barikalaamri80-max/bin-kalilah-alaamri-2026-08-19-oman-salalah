import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Text to Speech endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Fenrir', style } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const narrationStyle = style || 'Clear, authoritative, respectful legal narrator in classical Arabic';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 3000), // Safety bound
              speechMetadata: {
                style: narrationStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini Flash TTS model.' });
    }

    return res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS Generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to synthesize speech.',
    });
  }
});

// Enhanced AI Legal & Regulatory Advisor endpoint
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { prompt, mode = 'refute', useSearch = false } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    let systemInstruction = `أنت المستشار القانوني الأول لشركة بن كليلة العامري للتجارة والاستثمار ش.م.م في ملف الشكوى الرقابية المودعة أمام مركز حماية المنافسة ومنع الاحتكار بوزارة التجارة والصناعة وترويج الاستثمار، ضد شركة المطاحن العمانية ش.م.ع.ع والوسيط نوفل (شركة أطياف جلوبال FZC).
المرتكزات المادية والنظامية:
1. المادتان 155 و156 من قانون المعاملات المدنية: شمول البيع لملحقات المبيع الصالحة للانتفاع والتصدير، وأن الامتناع أو التعجيز المستندي هو امتناع مقنع عن البيع (Constructive Refusal to Deal).
2. المادة 10 من قانون حماية المنافسة ومنع الاحتكار (المرسوم السلطاني 67/2014): حظر إساءة استغلال الوضع المهيمن، وحظر الاتفاقات المنسقة والتمييز السعري وتمرير الصفقات لوسيط خارجي.
3. التناقضات الفنية والمستندية المصطنعة:
   - تناقض شهادة التحليل COA (تثبت مضادات كوكسيديا Sacox) مع البطاقة التعريفية على الكيس (تغفلها وتذكر Rotation Program).
   - تقديم إقرار سلامة لمنتج علف بياض (Layer 16% لعام 2025) لصفقة أعلاف دجاج لاحم 2026.
   - مناورة الصفر يوم سحب استناداً لنشرة بلغارية، بينما تفرض دولة الإمارات (MOCCAE) 7 أيام كمعيار أمان حيوي، مما علق الطلب رقم (APH-12062026-3382929).
4. التداخل المحاسبي واللوجستي للوسيط نوفل:
   - سداد أجور الوسيط في حساب المطاحن ببنك مسقط بما يثبت دمج الأموال وقيد الوكالة المشتركة.
   - واقعة تعطيل 7 مايو 2026، ومحاولة الاستحواذ على مزرعة بركة الوقن بسويحان (160,000 طير دجاج بقيمة 1.87 مليون ر.ع سنوياً وسداد 100% كاش مسبق).
5. أسلوب الصياغة: استبعاد أي ألفاظ شتم أو تجريح، والاعتماد التام على الشك القانوني والاستقراء المنطقي والدليل المادي المحكم.`;

    if (mode === 'diplomat') {
      systemInstruction += `\nالمطلوب في وضع (المُحوّل الدبلوماسي الآمن): صياغة رد قانوني ودبلوماسي متزن ورفيع، يحافظ على الحقوق الصارمة دون تصعيد انفعالي، ويضع الخصم أمام التزاماته التعاقدية بأدب رسمي قاطع.`;
    } else if (mode === 'draft_memo') {
      systemInstruction += `\nالمطلوب في وضع (صياغة رسالة / مذكرة): صياغة مذكرة رقابية تنفيذية موجهة إلى الفاضل/ خالد المسروري المحترم (مدير عام مركز حماية المنافسة ومنع الاحتكار) مع الديباجة الرسمية ومحاور الدفوع والطلبات الختامية.`;
    } else if (mode === 'questions_matrix') {
      systemInstruction += `\nالمطلوب في وضع (توليد مصفوفة أسئلة رقابية): توليد مصفوفة أسئلة تحقيق رقابي دقيقة ومفحمة، لتوجيهها إلى مسؤولي المطاحن العمانية، موثقة بالسند القانوني والوثيقة المقابلة بصيغة واضحة.`;
    } else if (mode === 'detect_fallacy') {
      systemInstruction += `\nالمطلوب في وضع (كاشف المغالطات): تفكيك حجة المصنع وتحديد المغالطة المنطقية (Logical Fallacy)، التناقض المستندي، والمخالفة القانونية الصريحة مع تقديم الدليل الداحض فوراً.`;
    } else if (mode === 'hearing_simulation') {
      systemInstruction += `\nالمطلوب في وضع (محاكاة جلسة استماع): محاكاة سيناريو جلسة استماع أمام المحقق الرقابي بين (ممثل المطاحن العمانية) والرد المفحم لـ (المستشار القانوني لشركة بن كليلة العامري).`;
    }

    const config: any = {
      systemInstruction,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Ask error:', error);
    return res.status(500).json({ error: error.message || 'Error processing inquiry.' });
  }
});

// Audio Transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    const { audio, mimeType = 'audio/webm' } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    let transcribedText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: [
          {
            inlineData: {
              mimeType,
              data: audio,
            },
          },
          'قم بتفريغ هذا التسجيل الصوتي بدقة تامة باللغة العربية مع مراعاة المصطلحات القانونية والمصنعية والتجارية بدقة.',
        ],
      });
      transcribedText = response.text || '';
    } catch (err: any) {
      console.warn('gemini-3.5-transcribe fallback to gemini-3.8-flash:', err?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType,
              data: audio,
            },
          },
          'قم بتفريغ هذا التسجيل الصوتي بدقة تامة باللغة العربية.',
        ],
      });
      transcribedText = fallbackResponse.text || '';
    }

    return res.json({ text: transcribedText.trim() });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: error.message || 'Transcription failed' });
  }
});

// Setup WebSocket for Live API (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live Voice API WebSocket');
  let liveSession: any = null;

  try {
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
        },
        systemInstruction: `أنت المستشار القضائي الصوتي لمنظومة بن كليلة العامري القانونية والرقابية.
تخاطب المستخدم بصوت وقور ومحترم باللغة العربية الفصحى.
تلتزم بمنهج الاستقراء المنطقي والشك القانوني وفق قانون المعاملات المدنية العماني (المواد 155 و156) وقانون حماية المنافسة ومنع الاحتكار (المرسوم السلطاني 67/2014).
توضح للمراجع تفاصيل الأدلة العشرة (DOC-01 إلى DOC-10)، والمحاور الرقابية الأربعة (Node A, B, C, D)، وثالوث المستندات (بطاقة المنتج، شهادة COA، إقرار سلامة الأعلاف).`,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }
          if (text && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'text', text }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
          }
        },
        onerror: (err: any) => {
          console.error('Live session internal error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: err.message || 'Live session error' }));
          }
        },
        onclose: () => {
          console.log('Live session closed');
        },
      },
    });

    clientWs.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === 'audio' && data.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: {
              data: data.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (data.type === 'text' && data.text && liveSession) {
          liveSession.sendRealtimeInput({
            text: data.text,
          });
        }
      } catch (err) {
        console.error('Error handling client message:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        liveSession?.close?.();
      } catch (e) {
        // ignore
      }
    });
  } catch (error: any) {
    console.error('Failed to connect to Live API:', error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: error.message || 'Could not initialize Live audio session.',
        })
      );
    }
  }
});

// Vite middleware in dev or static files in production
async function setupApp() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
});
