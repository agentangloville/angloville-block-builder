// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_LIBRARY, MARKET_CONFIG, ADDONS_FIELDS, getBlockDetails } from "@/lib/blocks-library";

export const maxDuration = 60;

// Only include the most useful blocks for landing pages (skip complex query blocks)
const LANDING_PAGE_BLOCKS = [
  "block-banner", "block-video", "block-text", "block-text-button",
  "block-info", "block-infocols", "block-icons", "block-courses",
  "block-plan", "block-table", "block-faq", "block-contact-form2",
  "block-opinions", "block-profits", "block-crew", "block-gallery",
  "block-list", "block-listnumber", "block-instagram", "block-line",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, market, language, selectedBlocks } = body;

    if (!prompt || !market || !language) {
      return NextResponse.json({ error: "Brak wymaganych pól (prompt, market, language)" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY nie jest skonfigurowany w Vercel Environment Variables" }, { status: 500 });
    }

    const marketConfig = MARKET_CONFIG[market as keyof typeof MARKET_CONFIG];
    if (!marketConfig) {
      return NextResponse.json({ error: `Nieznany rynek: ${market}` }, { status: 400 });
    }

    // Use selected blocks or default landing page blocks
    const blocksToUse = selectedBlocks && selectedBlocks.length > 0
      ? selectedBlocks
      : LANDING_PAGE_BLOCKS;
    
    const blockDetails = getBlockDetails(blocksToUse);

    const systemPrompt = `You are an expert WordPress developer and conversion copywriter for Angloville – a European language immersion company.

Your job: generate ready-to-paste WordPress Gutenberg ACF block code for high-converting landing pages.

## MARKET
- Site: ${marketConfig.name} (${marketConfig.domain})
- Brand: ${marketConfig.brandInfo}
- Products: ${marketConfig.products.join(", ")}

## LANGUAGE
Write ALL content in: ${language}

## LANDING PAGE BEST PRACTICES (apply these)
1. HERO FIRST — Start with block-banner. Strong emotional headline (max 8 words), benefit-oriented. For camps/travel: evoke adventure, transformation, belonging.
2. SOCIAL PROOF EARLY — Place block-opinions or trust signals (4.8/5 Google, 1900+ reviews, 40%+ returning) within first 3 blocks.
3. BENEFITS OVER FEATURES — Use block-icons or block-infocols to show 3-6 key benefits with icons. Lead with what the participant GETS, not what you DO.
4. SHOW THE EXPERIENCE — block-plan (daily schedule) or block-video makes the program tangible. Parents/adults need to "see" what happens.
5. HANDLE OBJECTIONS — block-faq with 4-6 real questions (safety, level, price, what's included, cancellation).
6. CLEAR CTA — block-contact-form2 with HubSpot embed or shortcode. Place after benefits and before FAQ, and again at the end.
7. SPECIFICS CONVERT — Real dates, prices, locations, durations. Vague copy = low trust.
8. MATCH AD → PAGE — Use same language, keywords, and tone as the ad that drives traffic.
9. ONE GOAL PER PAGE — Every block should push toward the single conversion goal (sign up / contact).
10. MOBILE-FIRST COPY — Short paragraphs, scannable text, no walls of text.

## ANGLOVILLE RULES
- For Malta programs: NEVER use "teaching" or "language school" — use "program", "course", "immersion", "learning"
- Native speakers come from UK, USA, Ireland, Australia
- Highlight: no traditional classroom, learning through conversation
- 40%+ returning participants = strong social proof

## AVAILABLE ACF BLOCKS
${blockDetails}

## OUTPUT FORMAT
Generate ONLY valid WordPress block comments:
<!-- wp:acf/block-name {"id":"block_XXXXX","name":"acf/block-name","data":{...},"align":"full","mode":"preview"} /-->

Rules:
- Unique "id" per block: "block_" + random 12-char hex
- Include addons: "addons_blockid":"","_addons_blockid":"${ADDONS_FIELDS.addons_blockid.id}","addons":"","_addons":"${ADDONS_FIELDS.addons.id}"
- For repeater fields: use indexed format (fieldname_0_subfield, fieldname_1_subfield) + count as fieldname
- Every field needs underscore-prefixed meta: "title" + "_title":"field_XXX"
- Image fields: use placeholder ID 455
- Link fields: {"title":"Text","url":"/page/","target":""}
- Output ONLY block code. No explanations, no markdown, no commentary.`;

    const userPrompt = `Generate a landing page with ACF blocks:

${prompt}

${selectedBlocks && selectedBlocks.length > 0
  ? `Use these blocks in this order: ${selectedBlocks.join(", ")}`
  : "Choose 5-8 most appropriate blocks for a high-converting landing page. Always include: banner, at least one content block, FAQ, and a form."}

Language: ${language}. Output ONLY WordPress block code.`;

    // Call Claude API
    const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";
    
    const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    // Handle API errors with detailed messages
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text().catch(() => "Could not read error body");
      console.error(`Claude API error ${apiResponse.status}:`, errorText);

      let userMessage = `Błąd API Claude (${apiResponse.status})`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error?.message) {
          userMessage = parsed.error.message;
        }
      } catch {
        if (apiResponse.status === 401) userMessage = "Nieprawidłowy API key. Sprawdź ANTHROPIC_API_KEY w Vercel.";
        else if (apiResponse.status === 429) userMessage = "Rate limit — za dużo zapytań. Poczekaj chwilę.";
        else if (apiResponse.status === 404) userMessage = `Model "${model}" nie znaleziony. Dodaj CLAUDE_MODEL w env.`;
        else if (apiResponse.status === 400) userMessage = "Nieprawidłowe zapytanie do API. " + errorText.substring(0, 150);
        else userMessage = `API error ${apiResponse.status}: ${errorText.substring(0, 200)}`;
      }
      
      return NextResponse.json({ error: userMessage }, { status: 502 });
    }

    // Parse response
    let data;
    try {
      data = await apiResponse.json();
    } catch {
      return NextResponse.json({ error: "Claude zwrócił nieprawidłową odpowiedź (nie JSON)" }, { status: 502 });
    }

    const generatedCode = (data.content || [])
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join("\n");

    if (!generatedCode.trim()) {
      return NextResponse.json({ error: "Claude nie wygenerował kodu. Spróbuj ponownie z innym opisem." }, { status: 500 });
    }

    return NextResponse.json({
      code: generatedCode.trim(),
      usage: data.usage,
    });

  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: `Błąd serwera: ${error.message || "nieznany"}` },
      { status: 500 }
    );
  }
}
