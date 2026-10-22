import express, { type Request, type Response } from 'express';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, type LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MASTER_DOSSIER_KNOWLEDGE_BASE = `
أوامر صارمة وملزمة للمستشار الذكي والرقابي (ملف صلالة 2026):
1. الجهة الموجه إليها الملف:
   وزارة التجارة والصناعة وترويج الاستثمار — مركز/دائرة حماية المنافسة ومنع الاحتكار
   الأستاذ الفاضل / خالد المسروري المحترم (مدير عام مركز حماية المنافسة ومنع الاحتكار).
2. الشركة المودِعة:
   شركة بن كليلة العامري للتجارة والاستثمار ش.م.م (صلالة — محافظة ظفار) — المستثمر الوطني: بريك العامري.
3. القواعد الذهبية للملف:
   - لا توجد أي شحنات محتجزة أو معلقة في المنافذ، ولا نطالب باسترداد أموال أو تعويضات مالية.
   - كامل التعاملات مسددة 100% نقداً مقدماً عبر بنك مسقط (إجمالي الدفعات الأولى: 18,640 ريالاً عمانياً بموجب الإيصالات رقم 686568727 بمبلغ 4,580 ر.ع، ورقم 689375818 بمبلغ 4,760 ر.ع، ورقم 691776712 بمبلغ 9,300 ر.ع).
   - الهدف الحصري: "المطابقة المستندية" وحق المستثمر الوطني في العمل بكرامة وشفافية دون فرض وسطاء أو عراقيل فنية.
   - إجمالي فترة التعطيل: 5 أشهر و18 يوماً من التعطيل، و3 أيام عمل من الصمت الرسمي أمام المهلة الرسمية للوزارة.
   - الرمز الذي يختصر الملف: صلالة 2026.

4. الوقائع التفصيلية الموثقة في الشرائح الـ 22 والمقاطع الرقابية:
   - حكاية العميل الوطني في صلالة (مايو 2026): بعد معاناة سنة كاملة من ممارسات الإغراق والتمييز في السوق المحلي بظفار، آثر المستثمر الوطني حفظ كرامته ونزاهته وأغلق محله ومستودعه الأكبر في صلالة في مايو 2026، وتوجه للتصدير النظامي المباشر للمنتج الوطني (علامة بركات — علف الدجاج اللاحم Broiler Starter & Finisher) إلى دولة الإمارات العربية المتحدة بعقد استراتيجي ضخم (1,877,000 ريال عماني — جدول المرحلة الأولى 16 تريلا / 7,500 كيس / 375 طناً).
   - قرينة الإنجاز في 24 ساعة (1 مايو 2026): الشحنة الأولى (500 كيس علف بادي — 25 طناً) عبرت منفذ خطم الشكلة في 1 مايو 2026 بموجب البيان الجمركي رقم 20261501028987 وتصريح العبور 243/2026 خلال 24 ساعة فقط، مما يثبت القدرة التشغيلية الفورية عند توفر التعاون المستندي.
   - واقعة 7 مايو ورسالة 19 مايو 2026 (فرض الوسيط وتجاوز الأصول): في 19 مايو 2026 وثقت رسالة نصية من المبيعات ("تحدثت مع مهند وأفاد بأن أي طلبات لعميل الإمارات ستكون عن طريق نوفل، وهو يرتب مع مهند مباشرة") حصر قناة التصدير في الوسيط نوفل (شركة الأطياف جنوباً)، والذي توجه مباشرة إلى المشتري النهائي في مزرعة سويحان بالإمارات لمحاولة الاستحواذ على الصفقة، فرفضه المشتري الإماراتي وتمسك بالعميل الوطني، مع تهديد المستثمر الوطني بغرامات تأخير 50 ريالاً يومياً عن تأخير تسبب فيه المصنع والوسيط.
   - علم المصنع المسبق بالتصدير: أصدر المصنع الفاتورتين الضريبيتين OFM/270 و OFM/271 والشهادة الصحية البيطرية رقم 829 وشهادتي المنشأ الخليجية 2026/1626906 و2026/1626907 وخطاب 283/2026 الموجه لمنفذ خطم الشكلة.
   - الذرائع الفنية الثلاث التي لم تُصحَّح:
     (أ) شهادة التحليل المخبري (COA) الصادرة في 23 يونيو 2026 عن دائرة الجودة بالمصنع تثبت وجود مادة مضادات الكوكزيديا (Anticoccidials)، بينما الملصق التعريفي (Label) يتجاهلها ويكتفي بعبارة برنامج تناوبي (Rotation Program)، ورفض مسؤول التصدير تعديل البطاقة متذرعاً بتكلفة إعادة الطباعة.
     (ب) إرسال إقرار سلامة غذائية في 23 و28 سبتمبر 2026 يخص علف الدجاج البياض (Layer 16%) المؤرخ في مايو 2025، بينما الصفقة والفواتير تخص حصراً علف الدجاج اللاحم (Broiler Starter & Finisher).
     (ج) الإصرار على فترة سحب صفر يوم (0 Days) بينما اشتراط وزارة التغير المناخي والبيئة الإماراتية (الطلب APH/RAC-12062026-3382929) هو 7 أيام (أو شهادة خلو مخبرية معتمدة وفق مذكرة المسارين النظاميين المؤرخة في 7 أكتوبر 2026 مرجع BK/REG-TECH/2026-10).
   - المهلة الرسمية (16 إلى 19 أكتوبر 2026): منحت الوزارة مهلة رسمية ثلاثة أيام عمل، وأُرسلت ثلاث رسائل PDF بقائمة المستندات ومرفق وزارة التغير المناخي والبيئة (الخطاب BKA/OMF-MOCCAE/2026/10) إلى ثلاثة مسؤولين: فيصل المعشني، وأدهم البلوشي (كوهي)، ومهند الرئيسي. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام عمل كاملة، والنتيجة: صمت رسمي مطبق.
   - الأساس القانوني العماني: المادتان (9) و(10) من قانون حماية المنافسة ومنع الاحتكار الصادر بالمرسوم السلطاني رقم 67/2014 (حظر التمييز وتقييد التعامل المباشر والامتناع المقنّع عن التعامل)، والمادتان (155) و(158) من قانون المعاملات المدنية العماني (الالتزام بتسليم المبيع وملحقاته المستندية الضرورية للانتفاع به)، والقرار الوزاري 209/2020.

5. المقاطع السبعة المعتمدة في الوثيقة:
- المقطع 1 (الافتتاح الهادئ): "الأستاذ خالد المسروري المحترم، دائرة المنافسة والاحتكار، السلام عليكم. لا أتيتُ بشكوى، ولا أطلب تعويضاً. أضع بين أيديكم وقائع، والحكم لكم."
- المقطع 2 (قاعدة الرفض): "الطرف الآخر يقول: نحن لم نرفض البيع. وأقول بهدوء: الرفض ليس كلمة تُقال، الرفض سلوك. من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض."
- المقطع 3 (المهلة الرسمية): "الوزارة منحت مهلة رسمية ثلاثة أيام عمل. وأنا ومعي فيصل المعشني وأدهم البروشي ومهند الرئيسي، أرسلنا لكل واحد منهم رسالة PDF بقائمة المستندات، ومرفقاً بها صورة من وزارة التغير المناخي والبيئة. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام. والنتيجة: لا حياة لمن تنادي."
- المقطع 4 (الأسباب التعسفية): "شهادة تحليل تذكر مادة مضادات الكوكزيديا، والملصق يتجاهلها ويكتفي بعبارة برنامج تناوبي. وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم. وإصرار على فترة سحب صفر يوم والاشتراط سبعة أيام. هذه ذرائع لم تُصحَّح. والذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ."
- المقطع 5 (تصحيح الصورة): "أنا لا أقول إن المستثمر لا يخطئ. المستثمر بشر. لكن المحاسبة تكون بإجراء مكتوب: بيان الخلل، ومهلة التصحيح. أما الصمت، فليس محاسبة، بل إغلاق باب."
- المقطع 6 (البعد الوطني): "الدولة حفظها الله وضعتكم في موقع المسؤولية، ودائرتكم مباشرة مع مكتب الوزير. ونحن بعد الله نضع أمننا فيكم. نطلب أن تعود المياه إلى مجاريها، وأن يرجع الحق إلى صاحبه، وأن تمشي الأمور."
- المقطع 7 (الخاتمة): "كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026."
`;

// Persistent server-side TTS cache and rate-limit cooldown tracking across restarts
const serverTtsCache = new Map<string, string>();
const COOLDOWN_FILE = path.join(os.tmpdir(), 'bka-tts-cooldown-state.json');

interface CooldownState {
  liteTtsCooldownUntil: number;
  flashTtsCooldownUntil: number;
}

function loadCooldownState(): CooldownState {
  try {
    if (fs.existsSync(COOLDOWN_FILE)) {
      const raw = JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf-8'));
      return {
        liteTtsCooldownUntil: Number(raw.liteTtsCooldownUntil) || 0,
        flashTtsCooldownUntil: Number(raw.flashTtsCooldownUntil) || 0,
      };
    }
  } catch {
    // ignore
  }
  return { liteTtsCooldownUntil: 0, flashTtsCooldownUntil: 0 };
}

function saveCooldownState(state: CooldownState) {
  try {
    fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(state), 'utf-8');
  } catch {
    // ignore
  }
}

const cooldownState = loadCooldownState();

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err || '');
  return (
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota') ||
    msg.includes('Quota exceeded')
  );
}

function extractCooldownMs(err: unknown): number {
  const msg = err instanceof Error ? err.message : String(err || '');
  const retryMatch = msg.match(/"retryDelay"\s*:\s*"(\d+)s"/);
  if (retryMatch && retryMatch[1]) {
    const seconds = parseInt(retryMatch[1], 10);
    if (!Number.isNaN(seconds) && seconds > 0) {
      return Math.min(seconds * 1000, 24 * 60 * 60 * 1000);
    }
  }
  return 60 * 60 * 1000; // Default 1 hour cooldown on daily free-tier exhaustion
}

app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName, voice, stylePrompt, style } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const selectedVoice = voiceName || voice || 'Charon';
    const narrationStyle =
      stylePrompt ||
      style ||
      'Speak in a deep, resonant, masculine Omani Arabic voice, slower than normal to convey dignity, gravitas, and deliberation, and lower in pitch than normal to convey weight and authority, with clear articulation and natural pauses.';
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/\s*([،؛.؟!:])\s*/g, '$1 ')
      .trim()
      .slice(0, 4000);

    const cacheKey = `${selectedVoice}::${cleanText}`;
    const cachedAudio = serverTtsCache.get(cacheKey);
    if (cachedAudio) {
      return res.json({
        audio: cachedAudio,
        mimeType: 'audio/wav',
      });
    }

    if (!apiKey) {
      return res.json({
        audio: null,
        fallbackToBrowserTTS: true,
        mimeType: 'audio/wav',
      });
    }

    let base64Audio: string | undefined;
    const now = Date.now();

    if (now >= cooldownState.liteTtsCooldownUntil) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
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
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });
        base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (liteErr: unknown) {
        if (isQuotaError(liteErr)) {
          cooldownState.liteTtsCooldownUntil = Date.now() + extractCooldownMs(liteErr);
          saveCooldownState(cooldownState);
        }
      }
    }

    if (!base64Audio && Date.now() >= cooldownState.flashTtsCooldownUntil) {
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
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
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });
        base64Audio = fallbackResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (flashErr: unknown) {
        if (isQuotaError(flashErr)) {
          cooldownState.flashTtsCooldownUntil = Date.now() + extractCooldownMs(flashErr);
          saveCooldownState(cooldownState);
        }
      }
    }

    if (!base64Audio) {
      return res.json({
        audio: null,
        fallbackToBrowserTTS: true,
        mimeType: 'audio/wav',
      });
    }

    serverTtsCache.set(cacheKey, base64Audio);
    return res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch {
    return res.json({
      audio: null,
      fallbackToBrowserTTS: true,
      mimeType: 'audio/wav',
    });
  }
});

app.post('/api/tts-dialogue', async (req: Request, res: Response) => {
  try {
    const { turns } = req.body;
    if (!Array.isArray(turns) || turns.length === 0) {
      return res.status(400).json({ error: 'Dialogue turns array is required.' });
    }

    if (!apiKey || Date.now() < cooldownState.flashTtsCooldownUntil) {
      return res.json({
        audio: null,
        fallbackToBrowserTTS: true,
        mimeType: 'audio/wav',
      });
    }

    const parts = turns.slice(0, 8).map((t: { speaker?: string; text?: string }) => {
      const isInvestor = t.speaker === 'investor';
      const speakerLabel = isInvestor ? 'Khalid' : 'Advisor';
      return {
        text: `${speakerLabel}: ${String(t.text || '').slice(0, 900)}`,
        speechMetadata: {
          speaker: speakerLabel,
          style: isInvestor
            ? 'Dignified Omani investor speaking clear Arabic at a slower, deliberate pace with a deep masculine pitch'
            : 'Calm Omani regulatory expert analyzing documented facts in clear Arabic at a measured, dignified pace',
        },
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Khalid',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Charon' },
                },
              },
              {
                speaker: 'Advisor',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Orus' },
                },
              },
            ],
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.json({
        audio: null,
        fallbackToBrowserTTS: true,
        mimeType: 'audio/wav',
      });
    }

    return res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: unknown) {
    if (isQuotaError(error)) {
      cooldownState.flashTtsCooldownUntil = Date.now() + extractCooldownMs(error);
      saveCooldownState(cooldownState);
    }
    return res.json({
      audio: null,
      fallbackToBrowserTTS: true,
      mimeType: 'audio/wav',
    });
  }
});

async function handleAdvisorRequest(req: Request, res: Response) {
  try {
    const userPrompt = req.body.message || req.body.prompt;
    const pdfBase64 = req.body.pdfBase64 as string | undefined;
    const pdfName = req.body.pdfName as string | undefined;
    const customKnowledge = req.body.customKnowledge as string | undefined;

    if (!userPrompt && !pdfBase64) {
      return res.status(400).json({ error: 'Prompt or PDF file is required.' });
    }

    const systemInstruction = `أنت المساعد الذكي والمستشار الرقابي والقانوني لوثيقة العميل الوطني المرفوعة إلى وزارة التجارة والصناعة وترويج الاستثمار — مركز حماية المنافسة ومنع الاحتكار — الفاضل / خالد المسروري المحترم.
مهمتك:
1. الإجابة بدقة ووضوح ودبلوماسية راقية عن أي سؤال يطرحه المراجع أو المدير العام أو المستثمر، بالاستناد إلى:
   - قاعدة المعرفة الكاملة للملف السيادي (الشرائح الـ 22 والمقاطع السبعة المرفقة أدناه).
   - أي ملف PDF أو عرض تقديمي مرفوع من المستخدم في المحادثة.
   - أي معلومات أو توجيهات إضافية يزودك بها المستخدم.
   - مواد قانون حماية المنافسة ومنع الاحتكار العماني (المرسوم السلطاني 67/2014 — خاصة المادتين 9 و10) وقانون المعاملات المدنية العماني (المادتان 155 و158).
2. إذا أرفق المستخدم ملف PDF، قم بقراءة وتحليل محتويات ملف الـ PDF بدقة، واستخرج منه النقاط الجوهرية، وأجب عن سؤاله مباشرة مع ربطه بوقائع ملف صلالة 2026.

${MASTER_DOSSIER_KNOWLEDGE_BASE}
${customKnowledge ? `\nمعلومات وتوجيهات إضافية مزودة من صاحب الملف:\n${customKnowledge}\n` : ''}`;

    const parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [];

    if (pdfBase64) {
      const cleanBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: pdfName
        ? `[الملف المرفق للتحليل: ${pdfName}]\nالسؤال أو الطلب: ${userPrompt || 'يرجى قراءة وتحليل هذا العرض التقديمي / المستند المرفق وتلخيص أبرز نقاطه الرقابية والقانونية.'}`
        : String(userPrompt),
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        systemInstruction,
      },
    });

    const text =
      response.text ||
      'كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.';
    return res.json({ reply: text, answer: text });
  } catch {
    const fallbackReply =
      'كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. الرفض ليس كلمة تُقال، الرفض سلوك: شهادة تحليل تذكر مادة مضادات الكوكزيديا والملصق يكتفي بعبارة برنامج تناوبي، وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم، وإصرار على فترة سحب صفر يوم والاشتراط سبعة أيام، ثم صمت رسمي لمدة ثلاثة أيام عمل أمام مهلة الوزارة الرسمية. الرمز الذي يختصر الملف: صلالة 2026.';
    return res.json({ reply: fallbackReply, answer: fallbackReply });
  }
}

app.post('/api/advisor/chat', handleAdvisorRequest);
app.post('/api/ai/ask', handleAdvisorRequest);

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
  let liveSession: { sendRealtimeInput?: (input: unknown) => void; close?: () => void } | null = null;

  try {
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orus' } },
        },
        systemInstruction: `أنت المستشار الصوتي للوثيقة الموجهة حصراً إلى الأستاذ الفاضل خالد المسروري المحترم — دائرة المنافسة والاحتكار. تلتزم حصرياً بالنص المعتمد دون أي إضافة.
${MASTER_DOSSIER_KNOWLEDGE_BASE}`,
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
        },
        onerror: (err: { message?: string }) => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: err?.message || 'Live session error' }));
          }
        },
        onclose: () => {},
      },
    });

    clientWs.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === 'audio' && data.audio && liveSession) {
          liveSession.sendRealtimeInput?.({
            audio: {
              data: data.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (data.type === 'text' && data.text && liveSession) {
          liveSession.sendRealtimeInput?.({
            text: data.text,
          });
        }
      } catch {
        // ignore
      }
    });

    clientWs.on('close', () => {
      try {
        liveSession?.close?.();
      } catch {
        // ignore
      }
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Could not initialize Live audio session.';
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: errMsg,
        })
      );
    }
  }
});

async function setupApp() {
  const distPath = path.resolve(__dirname, 'dist');
  const distIndex = path.resolve(distPath, 'index.html');
  const isProd =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    if (!fs.existsSync(distIndex)) {
      const { build } = await import('vite');
      await build();
    }
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(distIndex);
    });
  }

  server.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

setupApp();
