// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BLOCKS_LIBRARY, MARKET_CONFIG, getBlocksList, getBlockDetails } from "@/lib/blocks-library";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { prompt, market, language, selectedBlocks } = await request.json();

    if (!prompt || !market || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const marketConfig = MARKET_CONFIG[market as keyof typeof MARKET_CONFIG];
    if (!marketConfig) {
      return NextResponse.json({ error: "Invalid market" }, { status: 400 });
    }

    // Build the system prompt
    const allBlockNames = Object.keys(BLOCKS_LIBRARY);
    const blocksToUse = selectedBlocks && selectedBlocks.length > 0 ? selectedBlocks : allBlockNames;
    const blockDetails = getBlockDetails(blocksToUse);

    const systemPrompt = `You are an expert WordPress developer specializing in ACF (Advanced Custom Fields) blocks for Angloville websites.

Your job is to generate ready-to-paste WordPress Gutenberg block code using ACF blocks. The output must be valid WordPress block comments that can be pasted directly into the WordPress Code Editor.

## MARKET CONTEXT
- Website: ${marketConfig.name} (${marketConfig.domain})
- Brand: ${marketConfig.brandInfo}
- Available products: ${marketConfig.products.join(", ")}

## CONTENT LANGUAGE
Write ALL content (titles, text, descriptions, FAQs, etc.) in: ${language}

## AVAILABLE ACF BLOCKS
${blockDetails}

## OUTPUT RULES

1. Generate ONLY valid WordPress block comments in the format: <!-- wp:acf/block-name {"id":"block_XXXXX","name":"acf/block-name","data":{...},"align":"full","mode":"edit"} /-->
2. Each block must have a unique "id" starting with "block_" followed by a random hex string (e.g. "block_6a4f2b1c8d9e0")
3. For repeater fields, use the indexed format: fieldname_0_subfield, fieldname_1_subfield, etc. Include the count as just the field name (e.g. "block-plan_plan": 3 for 3 items)
4. Every field must have a corresponding underscore-prefixed meta field (e.g. "block-plan_title" paired with "_block-plan_title": "field_XXX")
5. Use realistic, compelling marketing copy appropriate for the Angloville brand and the specified market/language
6. Include proper addons fields: "addons_blockid":"","_addons_blockid":"field_62fb56f7cad40","addons":"","_addons":"field_62fb56edcad3f"
7. For image fields, use placeholder ID 455 (will be replaced in WP)
8. For link fields, use JSON format: {"title":"Button Text","url":"/page/","target":""}
9. Output ONLY the block code, no explanations, no markdown fences, no commentary

## IMPORTANT
- Make the content specific to the product/program mentioned in the prompt
- Use persuasive, conversion-oriented copy
- Include real-sounding details about the program (dates, locations, benefits)
- For FAQ blocks, create 4-6 relevant questions
- For table blocks, fill with relevant comparison data
- For plan/schedule blocks, create realistic daily schedules
- Match the tone to the market (formal for IT, casual-professional for PL, etc.)
- NEVER use "teaching" or "language school" for Malta programs - use "program", "course", "learning", "immersion"`;

    const userPrompt = `Generate a landing page with ACF blocks for this request:

${prompt}

${selectedBlocks && selectedBlocks.length > 0 ? `Use these specific blocks in this order: ${selectedBlocks.join(", ")}` : "Choose the most appropriate blocks from the library to create a complete, high-converting landing page."}

Remember: Write all content in ${language}. Output ONLY the WordPress block code.`;

    // Call Claude API
    const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";
    const response = await fetch("https://api.anthropic.com/v1/messages", {
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

    if (!response.ok) {
      let errorMsg = `Claude API error ${response.status}`;
      try {
        const errorBody = await response.text();
        console.error("Claude API error:", response.status, errorBody);
        try {
          const parsed = JSON.parse(errorBody);
          errorMsg = parsed.error?.message || `API ${response.status}: ${errorBody.substring(0, 200)}`;
        } catch {
          errorMsg = `API ${response.status}: ${errorBody.substring(0, 200)}`;
        }
      } catch {}
      return NextResponse.json({ error: errorMsg }, { status: 502 });
    }

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error("Failed to parse Claude response as JSON");
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 502 });
    }

    const generatedCode = (data.content || [])
      .filter((item: any) => item.type === "text")
      .map((item: any) => item.text)
      .join("\n");

    return NextResponse.json({
      code: generatedCode.trim(),
      usage: data.usage,
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
