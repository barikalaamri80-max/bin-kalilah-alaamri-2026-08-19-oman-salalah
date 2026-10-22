import { TWENTY_TWO_SLIDES_DATA } from '../data/presentation22SlidesData';

export interface GeneratedDeckResult {
  presentationId: string;
  presentationUrl: string;
  title: string;
  slidesCount: number;
}

export async function createDossierPresentation(
  accessToken: string,
  dossierTitle: string = 'مذكرة رسمية تحليلية — الامتناع الضمني والتعطيل المستندي (22 شريحة) — شركة بن كليلة العامري'
): Promise<GeneratedDeckResult> {
  if (!accessToken) {
    throw new Error('Access token is missing. Please sign in with Google to continue.');
  }

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

  const requests: Record<string, unknown>[] = [];

  TWENTY_TWO_SLIDES_DATA.forEach((slide, idx) => {
    const slideObjectId = `slide_item_${slide.slideNumber}`;
    const textObjectId = `text_item_${slide.slideNumber}`;

    requests.push({
      createSlide: {
        objectId: slideObjectId,
        insertionIndex: idx + 1,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    });

    requests.push({
      createShape: {
        objectId: textObjectId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: slideObjectId,
          size: { width: { magnitude: 640, unit: 'PT' }, height: { magnitude: 340, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: 40, translateY: 30, unit: 'PT' },
        },
      },
    });

    const cardsText = slide.cards
      .map((c) => `• ${c.tag} — ${c.title}: ${c.body}`)
      .join('\n');

    requests.push({
      insertText: {
        objectId: textObjectId,
        text: `${slide.sectionBadge}\n${slide.title}\n${slide.subtitle}\n\n${slide.mainText}\n\n${cardsText}\n\n${slide.goldenCallout}`,
      },
    });
  });

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
    slidesCount: TWENTY_TWO_SLIDES_DATA.length,
  };
}
