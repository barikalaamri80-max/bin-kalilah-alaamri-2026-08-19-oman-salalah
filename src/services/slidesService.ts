/**
 * Google Slides Integration Service
 * Uses Google Slides API v1 with client access token
 */

export interface GeneratedDeckResult {
  presentationId: string;
  presentationUrl: string;
  title: string;
  slidesCount: number;
}

export async function createDossierPresentation(
  accessToken: string,
  dossierTitle: string = 'ملف بن كليلة الرقابي والسيادي — خط تصدير أعلاف بركات 2026'
): Promise<GeneratedDeckResult> {
  if (!accessToken) {
    throw new Error('Access token is missing. Please sign in with Google to continue.');
  }

  // 1. Create a blank presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: dossierTitle,
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message ||
        `Google Slides API error (${createRes.status}): ${createRes.statusText}`
    );
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;

  // 2. Define batch updates to insert slides and content
  const requests: any[] = [
    // Slide 1: Executive Title Slide
    {
      createSlide: {
        objectId: 'slide_title_01',
        insertionIndex: 1,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createShape: {
        objectId: 'box_title_bg',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_title_01',
          size: { width: { magnitude: 720, unit: 'PT' }, height: { magnitude: 405, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, unit: 'PT' },
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: 'box_title_bg',
        fields: 'shapeBackgroundFill.solidFill.color',
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: { color: { rgbColor: { red: 0.137, green: 0.082, blue: 0.235 } } },
          },
        },
      },
    },
    {
      createShape: {
        objectId: 'text_title_01',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: 'slide_title_01',
          size: { width: { magnitude: 640, unit: 'PT' }, height: { magnitude: 180, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 40, translateY: 60, unit: 'PT' },
        },
      },
    },
    {
      insertText: {
        objectId: 'text_title_01',
        text: 'شركة بن كليلة العامري للتجارة والاستثمار ش.م.م\nالمنظومة الرقابية والتنفيذية الفاصلة — خط تصدير أعلاف بركات\nإيداع رسمي مشفوع بالأدلة الجنائية والاقتصادية أمام دائرة حماية المنافسة ومنع الاحتكار',
      },
    },
    {
      updateTextStyle: {
        objectId: 'text_title_01',
        textRange: { type: 'ALL' },
        style: {
          foregroundColor: {
            opaqueColor: { rgbColor: { red: 0.95, green: 0.82, blue: 0.45 } },
          },
          bold: true,
          fontSize: { magnitude: 20, unit: 'PT' },
          fontFamily: 'Tajawal',
        },
        fields: 'foregroundColor,bold,fontSize,fontFamily',
      },
    },

    // Slide 2: Logistical Paradigm Shift
    {
      createSlide: {
        objectId: 'slide_paradigm_02',
        insertionIndex: 2,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createShape: {
        objectId: 'text_paradigm_02',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: 'slide_paradigm_02',
          size: { width: { magnitude: 640, unit: 'PT' }, height: { magnitude: 320, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 40, translateY: 30, unit: 'PT' },
        },
      },
    },
    {
      insertText: {
        objectId: 'text_paradigm_02',
        text: 'التحول اللوجستي والاستثماري: هدر الوساطة مقابل كفاءة الشراكة المباشرة\n\n' +
          '1. مسار الوساطة الالتفافي (عبر شركة نوفل): \n' +
          '   - إقحام وسيط غير ذي صفة، فرض عمولة إجبارية +650 ر.ع / حمولة.\n' +
          '   - احتجاز الشاحنات لأكثر من 57 يوماً بتضارب مستندي مصطنع، ومصادرة الأعلاف.\n\n' +
          '2. مسار شركة بن كليلة المباشر والسيادي: \n' +
          '   - سداد نقدي مسبق 100% كاش بحساب المطاحن (18,640.000 ر.ع) دون مخاطر ائتمانية.\n' +
          '   - خفض زمن الفسح الجمركي إلى أقل من 12 ساعة وتوفير ذاتي بنسبة 52.36%.\n' +
          '   - ضمان الأمن الغذائي لمزارع سويحان (160,000 طير دجاج).',
      },
    },
    {
      updateTextStyle: {
        objectId: 'text_paradigm_02',
        textRange: { type: 'ALL' },
        style: {
          foregroundColor: {
            opaqueColor: { rgbColor: { red: 0.1, green: 0.1, blue: 0.2 } },
          },
          fontSize: { magnitude: 13, unit: 'PT' },
          fontFamily: 'Tajawal',
        },
        fields: 'foregroundColor,fontSize,fontFamily',
      },
    },

    // Slide 3: Antitrust Legal Architecture (Nodes A to D)
    {
      createSlide: {
        objectId: 'slide_nodes_03',
        insertionIndex: 3,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createShape: {
        objectId: 'text_nodes_03',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: 'slide_nodes_03',
          size: { width: { magnitude: 640, unit: 'PT' }, height: { magnitude: 340, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 40, translateY: 30, unit: 'PT' },
        },
      },
    },
    {
      insertText: {
        objectId: 'text_nodes_03',
        text: 'الهندسة الرقابية الفاصلة: تفكيك وتفنيد دفوع المصنع والوسيط\n\n' +
          '• Node A (الركن القانوني للمبيع): المادتان 155 و 156 معاملات مدنية تلزمان بتسليم المبيع وملحقاته الصالحة للغرض. تسليم أوراق معيبة يمثل امتناعاً مقنعاً عن البيع (Constructive Refusal to Deal).\n\n' +
          '• Node B (إثبات التبعية والوكالة): تحويل بنكي مباشر (280 ر.ع) من حساب نوفل لحساب المطاحن، مع اعتراف مندوب المصنع صوتياً بتبعيتهم وتوريد أسعار حصرية.\n\n' +
          '• Node C (الفخ المستندي العمدي): تصدير عقد دجاج لاحم 2026 مع إرفاق إقرار سلامة أعلاف خاص بدجاج بياض صادر لعام 2025 لإيقاع المستثمر في حظر جمركي.\n\n' +
          '• Node D (التناقض الفني المصطنع): طباعة (0 يوم) فترة سحب على الليبل مع وجود 7 أيام في شهادة COA بالمخالفة لتعميم MOCCAE رقم 365/2021.',
      },
    },
    {
      updateTextStyle: {
        objectId: 'text_nodes_03',
        textRange: { type: 'ALL' },
        style: {
          foregroundColor: {
            opaqueColor: { rgbColor: { red: 0.1, green: 0.1, blue: 0.2 } },
          },
          fontSize: { magnitude: 12, unit: 'PT' },
          fontFamily: 'Tajawal',
        },
        fields: 'foregroundColor,fontSize,fontFamily',
      },
    },

    // Slide 4: Documentary Triptych & 10 Exhibits
    {
      createSlide: {
        objectId: 'slide_vault_04',
        insertionIndex: 4,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createShape: {
        objectId: 'text_vault_04',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: 'slide_vault_04',
          size: { width: { magnitude: 640, unit: 'PT' }, height: { magnitude: 340, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 40, translateY: 30, unit: 'PT' },
        },
      },
    },
    {
      insertText: {
        objectId: 'text_vault_04',
        text: 'ثالوث المستندات الإلزامي وسجل الحيازة الجنائية الـ 10\n\n' +
          '1. بطاقة المنتج التعريفية (Product Labeling Card)\n' +
          '2. شهادة التحليل المخبري (COA)\n' +
          '3. إقرار سلامة الأعلاف الحصري (FSD)\n\n' +
          'مستودع الأدلة الـ 10:\n' +
          'DOC-01: إشعار تحويل بنك مسقط (18,640.000 ر.ع) — صفر مخاطر ائتمانية.\n' +
          'DOC-02: فاتورة مبيعات OFM/270 (100 طن أعلاف بركات لاحم).\n' +
          'DOC-03: إشعار تحويل نوفل (280 ر.ع) — إثبات دمج الأموال وقيد الوكالة.\n' +
          'DOC-04: إقرار علف البياض المعيب 2025.\n' +
          'DOC-05: شهادة COA المتناقضة مع الليبل (7 أيام vs 0 يوم).\n' +
          'DOC-06: تسجيلات مندوب المصنع مهند الهاتفية.\n' +
          'DOC-07: إيميلات مدير التصدير أدهم (تعطيل 57 يوماً).\n' +
          'DOC-08: محضر مسؤول الأمن الداخلي علي العجمي.\n' +
          'DOC-09: تعميم وزارة التغير المناخي والبيئة بدولة الإمارات رقم 365.\n' +
          'DOC-10: توثيق الفيديو الميداني للشاحنات المحتجزة.',
      },
    },
    {
      updateTextStyle: {
        objectId: 'text_vault_04',
        textRange: { type: 'ALL' },
        style: {
          foregroundColor: {
            opaqueColor: { rgbColor: { red: 0.1, green: 0.1, blue: 0.2 } },
          },
          fontSize: { magnitude: 11, unit: 'PT' },
          fontFamily: 'Tajawal',
        },
        fields: 'foregroundColor,fontSize,fontFamily',
      },
    },

    // Slide 5: Statutory Requests & Endorsement
    {
      createSlide: {
        objectId: 'slide_signoff_05',
        insertionIndex: 5,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createShape: {
        objectId: 'box_signoff_bg',
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: 'slide_signoff_05',
          size: { width: { magnitude: 720, unit: 'PT' }, height: { magnitude: 405, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, unit: 'PT' },
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: 'box_signoff_bg',
        fields: 'shapeBackgroundFill.solidFill.color',
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: { color: { rgbColor: { red: 0.137, green: 0.082, blue: 0.235 } } },
          },
        },
      },
    },
    {
      createShape: {
        objectId: 'text_signoff_05',
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: 'slide_signoff_05',
          size: { width: { magnitude: 640, unit: 'PT' }, height: { magnitude: 300, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 40, translateY: 50, unit: 'PT' },
        },
      },
    },
    {
      insertText: {
        objectId: 'text_signoff_05',
        text: 'السند التنفيذي والإجرائي والطلبات الختامية\n\n' +
          'بموجب المرسوم السلطاني رقم 67/2014 وقانون المعاملات المدنية:\n' +
          '1. إلزام شركة المطاحن العمانية بتسليم ملحقات المبيع الصالحة فوراً لشحنات أعلاف بركات لاحم.\n' +
          '2. وقف فرض التبعية والوساطة الإجبارية لشركة نوفل.\n' +
          '3. فتح تحقيق رقابي موسع في ممارسات إساءة استغلال الوضع المهيمن لتعطيل التصدير الوطني.\n\n' +
          'المفوض بالتوقيع: بريك بن محمد بن كليلة العامري — المدير العام والمسؤول التنفيذي\n' +
          'Digital Signature Hash: BKA-9942-ANTITRUST-CONFIRMED-2026',
      },
    },
    {
      updateTextStyle: {
        objectId: 'text_signoff_05',
        textRange: { type: 'ALL' },
        style: {
          foregroundColor: {
            opaqueColor: { rgbColor: { red: 0.95, green: 0.82, blue: 0.45 } },
          },
          fontSize: { magnitude: 13, unit: 'PT' },
          fontFamily: 'Tajawal',
        },
        fields: 'foregroundColor,fontSize,fontFamily',
      },
    },
  ];

  // Execute batch updates
  const updateRes = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!updateRes.ok) {
    console.warn('Batch update response warning, presentation was created:', updateRes.status);
  }

  const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  return {
    presentationId,
    presentationUrl,
    title: dossierTitle,
    slidesCount: 5,
  };
}
