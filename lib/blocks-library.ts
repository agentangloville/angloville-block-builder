// lib/blocks-library.ts
// Complete ACF blocks library with real WordPress field IDs
// Source: block PHP templates + WP block comments from Angloville theme

export type BlockField = {
  id: string;
  type: string;
  desc: string;
  options?: string[];
  subFields?: Record<string, string>;
};

export type BlockDef = {
  name: string;
  description: string;
  fields: Record<string, any>;
  parentField?: string | null;
};

export const BLOCKS_LIBRARY: Record<string, BlockDef> = {

  "block-banner": {
    name: "acf/block-banner",
    description: "Hero banner – full-width background image with title overlay. Options: wide title, big title, small height. Used as the first section on landing pages.",
    fields: {
      "block-banner_title": { id: "field_623d803c94b91", type: "text", desc: "Main headline (H2, white on image)" },
      "block-banner_titlewide": { id: "field_623d892367a65", type: "true_false", desc: "Wide title (col-10 instead of col-7)" },
      "block-banner_titlebig": { id: "field_624ea1e718460", type: "true_false", desc: "Big title size" },
      "block-banner_elementheight": { id: "field_624ea4422799b", type: "true_false", desc: "Small height variant" },
      "block-banner_image": { id: "field_623d819d94b92", type: "image", desc: "Background image (desktop + auto mobile crop)" },
      "block-banner_use_mobile_image": { id: "field_6983605f17421", type: "true_false", desc: "Use separate mobile image" },
    },
    parentField: "field_623d7ffa94b90",
  },

  "block-video": {
    name: "acf/block-video",
    description: "Video section – YouTube embed or self-hosted video (mp4/webm/ogg) with poster image overlay and optional title (top or bottom). Great for hero video or product showcase.",
    fields: {
      "block-video_title": { id: "field_624ef12add357", type: "text", desc: "Section title" },
      "block-video_titleposition": { id: "field_623c33f412331", type: "select", desc: "Title position: top or bottom", options: ["top", "bottom"] },
      "block-video_videotype": { id: "field_623c33d212330", type: "select", desc: "Video type", options: ["youtube", "file"] },
      "block-video_video-youtube": { id: "field_623c344112335", type: "url", desc: "YouTube URL (youtu.be format)" },
      "block-video_image": { id: "", type: "image", desc: "Poster/preview image" },
    },
    parentField: "field_623b3a3ce7c62",
  },

  "block-line": {
    name: "acf/block-line",
    description: "Simple horizontal divider line. No fields needed – just visual separator between sections.",
    fields: {},
    parentField: null,
  },

  "block-info": {
    name: "acf/block-info",
    description: "Info block – left column with title + text + CTA, right column with bulleted list (with or without icons). Two styles: simple list or list with icons.",
    fields: {
      "block-info_title": { id: "field_623c486c0802f", type: "text", desc: "Section title" },
      "block-info_style": { id: "field_623c48e508030", type: "select", desc: "Style: 1=simple list, 2=list with icons", options: ["1", "2"] },
      "block-info_text": { id: "field_623c491708031", type: "wysiwyg", desc: "Body text (left column, style 1 only)" },
      "block-info_titlelist": { id: "field_623c49ab08035", type: "text", desc: "List header text (right column, style 1)" },
      "block-info_list": { id: "field_623c493f08032", type: "repeater", desc: "List items", subFields: { "text": "text", "icon": "image (style 2)" } },
      "block-info_button-type": { id: "field_62820977a5761", type: "select", desc: "Button: 0=none, 1=anchor #tabela, 2=custom link" },
    },
    parentField: "field_623c484a0802e",
  },

  "block-find": {
    name: "acf/block-find",
    description: "Course finder/search block – big title, subtitle, and dropdown filters (dla-kogo, gdzie, rodzaj wyjazdu). Can show results below as cards or list.",
    fields: {
      "block-find_title": { id: "field_623d8c5130680", type: "text", desc: "Big heading" },
      "block-find_text": { id: "field_623d8c6630681", type: "text", desc: "Subtitle under title" },
      "block-find_what": { id: "field_6298ce3bdbdbf", type: "select", desc: "Filter scope: 0=all, 1=adults, 2=kids, 3=companies" },
      "block-find_type": { id: "field_6299e2d9bb81b", type: "select", desc: "Results display: 0=no results, 2=big cards, 3=small cards" },
    },
    parentField: "field_623d8c143067f",
  },

  "block-courses": {
    name: "acf/block-courses",
    description: "Course cards grid – displays program cards with image, age group, title, and link. Type 3 = manual list with repeater, types 1/2/4 = auto from WP pages.",
    fields: {
      "block-courses_title": { id: "field_623daa5b79761", type: "text", desc: "Section title" },
      "block-courses_coursetype": { id: "field_6259287c9622f", type: "select", desc: "Type: 0=all auto, 1=adults auto, 2=kids auto, 3=manual list, 4=companies auto" },
      "block-courses_list": { id: "", type: "repeater", desc: "Manual course cards (type 3)", subFields: {
        "type": "1=manual, 2=from page",
        "image": "image", "title": "text", "age": "text", "text": "text", "link": "link {title,url,target}"
      }},
    },
    parentField: "field_623da9da79760",
  },

  "block-infocols": {
    name: "acf/block-infocols",
    description: "Info columns – grid of cards with icon, title, and text description. Optional border style and title. Good for features/benefits.",
    fields: {
      "block-infocols_title": { id: "field_62502b5db2446", type: "text", desc: "Section title" },
      "block-infocols_spacing": { id: "field_624ed7295b56e", type: "true_false", desc: "Reduced top spacing" },
      "block-infocols_border": { id: "field_624ffc8a279be", type: "true_false", desc: "Show borders around items" },
      "block-infocols_items": { id: "field_623dc20f9fdc8", type: "repeater", desc: "Column items", subFields: {
        "icon": "field_623dc23e9fdc9 (image)", "title": "field_623dc26e9fdca (text)", "text": "field_623dc27b9fdcb (textarea)"
      }},
    },
    parentField: "field_623dc2009fdc7",
  },

  "block-opinions": {
    name: "acf/block-opinions",
    description: "Testimonials/reviews section – title + Google reviews widget shortcode + optional CTA button. Pulls reviews via shortcode plugin.",
    fields: {
      "block-opinions_title": { id: "field_629dc8017d8e8", type: "text", desc: "Section title" },
      "block-opinions_code": { id: "field_629dcbfa9592e", type: "textarea", desc: "Reviews shortcode/embed code" },
      "block-opinions_button-type": { id: "field_6246dcb910211", type: "select", desc: "CTA button type: 0=none, 1=anchor, 2=link" },
    },
    parentField: "field_623dd8944efa6",
  },

  "block-contact-form": {
    name: "acf/block-contact-form",
    description: "Contact/lead form – title, description text on left, form embed on right. Type: 0=global shortcode, 1=global with radio options, 2=custom embed code (HubSpot).",
    fields: {
      "block-contact-form_type": { id: "field_625ec0785b782", type: "select", desc: "Form type: 0=global CF7, 1=global with radio, 2=custom code" },
      "block-contact-form_title": { id: "field_62722be2950de", type: "text", desc: "Form title (type 2)" },
      "block-contact-form_text": { id: "field_62722bf6950df", type: "wysiwyg", desc: "Left side text (type 2)" },
      "block-contact-form_code": { id: "field_626bf52d5c76c", type: "textarea", desc: "Custom form embed code / HubSpot (type 2)" },
    },
    parentField: "field_625ebf6993735",
  },

  "block-contact-form2": {
    name: "acf/block-contact-form2",
    description: "Contact form v2 – simpler layout, title + text + form code. Options for border, centering, HubSpot or CF7.",
    fields: {
      "block-contact-form2_border": { id: "field_64673b70a0e92", type: "true_false", desc: "Show border around form" },
      "block-contact-form2_center": { id: "field_64673b92a0e93", type: "true_false", desc: "Center layout (full width)" },
      "block-contact-form2_title": { id: "field_64673ba1a0e94", type: "text", desc: "Form title" },
      "block-contact-form2_text": { id: "field_64673bb0a0e95", type: "wysiwyg", desc: "Description text" },
      "block-contact-form2_type": { id: "field_64673bc0a0e96", type: "select", desc: "0=CF7 shortcode, 1=HubSpot embed" },
      "block-contact-form2_code": { id: "field_64673bd7a0e97", type: "textarea", desc: "CF7 shortcode or embed" },
      "block-contact-form2_codehs": { id: "", type: "textarea", desc: "HubSpot embed code" },
    },
    parentField: "field_64673b65a0e91",
  },

  "block-trips": {
    name: "acf/block-trips",
    description: "Trips table – banner image + filterable table of available trips with dates, locations, hotels. Complex WP Query block. Includes hotel popups.",
    fields: {
      "block-trips_title": { id: "field_6274d06b769d0", type: "text", desc: "Banner title" },
      "block-trips_titlewide": { id: "field_6274d06d769d1", type: "true_false", desc: "Wide title" },
      "block-trips_titlebig": { id: "field_6274d06e769d2", type: "true_false", desc: "Big title" },
      "block-trips_elementheight": { id: "field_62f36602cd087", type: "true_false", desc: "Small banner height" },
      "block-trips_agecol": { id: "field_65ddc3b46c006", type: "true_false", desc: "Show age/availability column" },
      "block-trips_image": { id: "field_6274d070769d3", type: "image", desc: "Banner background image" },
      "block-trips_category": { id: "field_6274d073769d4", type: "taxonomy", desc: "Trip category filter" },
      "block-trips_colhotelname": { id: "field_624c42f5bb257", type: "true_false", desc: "Show 'Lokalizacja' instead of 'Nazwa Hotelu'" },
      "block-trips_button-type": { id: "field_62727e6a79cc4", type: "select", desc: "CTA button type" },
    },
    parentField: "field_624c42e0bb256",
  },

  "block-text-button": {
    name: "acf/block-text-button",
    description: "Text + button block – two columns: left with title + CTA button, right with body text + optional button. Simple content + CTA section.",
    fields: {
      "block-text-button_title": { id: "field_624eb0a9fafdf", type: "text", desc: "Title (left column)" },
      "block-text-button_text": { id: "field_624eb0d0fafe0", type: "wysiwyg", desc: "Body text (right column)" },
      "block-text-button_button-type": { id: "field_624eb17bfafe2", type: "select", desc: "Button: 0=none, 1=anchor, 2=link" },
    },
    parentField: "field_624eb061fafde",
  },

  "block-text": {
    name: "acf/block-text",
    description: "Flexible text block – supports layouts: text100 (full width with title/text/image/link), text5050 (50/50 split), text33 (3 columns). Most versatile content block.",
    fields: {
      "block-text_flex": { id: "field_6259432008791", type: "flexible_content", desc: "Flexible layouts: text100, text5050, text33. Each supports sub-layouts: title, text, image, link." },
    },
    parentField: "field_6259431508790",
  },

  "block-icons": {
    name: "acf/block-icons",
    description: "Icons grid – icon image + text label in 3-column grid. Optional title, bottom text, and CTA button. Used for USPs/features.",
    fields: {
      "block-icons_title": { id: "field_6250319e622f6", type: "text", desc: "Section title" },
      "block-icons_spacing": { id: "field_624ebd7dc8d6f", type: "true_false", desc: "Add top spacing" },
      "block-icons_list": { id: "field_624ebc6d355bc", type: "repeater", desc: "Icon items", subFields: { "image": "icon image", "text": "label text" } },
      "block-icons_text": { id: "field_625e8e2dd8fa2", type: "textarea", desc: "Text below icons" },
      "block-icons_button-type": { id: "field_624ebc96355bd", type: "select", desc: "Button: 0=none, 1=anchor, 2=link" },
    },
    parentField: "field_624ebc5d355bb",
  },

  "block-plan": {
    name: "acf/block-plan",
    description: "Timeline/schedule – vertical timeline with colored lines, time labels, and descriptions. Perfect for daily schedules, event agendas.",
    fields: {
      "block-plan_title": { id: "field_624ee9a73a56b", type: "text", desc: "Section title" },
      "block-plan_plan": { id: "field_624ee9cf3a56c", type: "repeater", desc: "Timeline items", subFields: {
        "color": "select (blue/green/red/yellow/orange/purple)", "time": "text (e.g. 09:00)", "text": "text (description)"
      }},
    },
    parentField: "field_624ee9923a56a",
  },

  "block-crew": {
    name: "acf/block-crew",
    description: "Team/crew cards – title + grid of cards with title, text, optional popup with image and extended description. Plus optional CTA link.",
    fields: {
      "block-crew_title": { id: "field_62502b7d9f32f", type: "text", desc: "Section title" },
      "block-crew_spacing": { id: "field_625028319f62f", type: "true_false", desc: "Reduced spacing" },
      "block-crew_items": { id: "field_625028319f673", type: "repeater", desc: "Team members", subFields: {
        "title": "field_6250283252bb7", "text": "field_6250283252bfa", "popup": "field_625040f7ed863 (true_false)"
      }},
      "block-crew_link": { id: "field_627278743a8e8", type: "link", desc: "CTA link {title, url, target}" },
    },
    parentField: "field_62502830ada48",
  },

  "block-gallery": {
    name: "acf/block-gallery",
    description: "Photo gallery slider – title + image carousel/slider. Shows program photos, locations, activities.",
    fields: {
      "block-gallery_title": { id: "field_62554f4ef6822", type: "text", desc: "Gallery title" },
      "block-gallery_gallery": { id: "field_62554f94f6823", type: "gallery", desc: "Gallery images array" },
    },
    parentField: "field_62554f3ff6821",
  },

  "block-list": {
    name: "acf/block-list",
    description: "Bulleted list – title on left, bullet-point list on right. Simple two-column layout for key points.",
    fields: {
      "block-list_title": { id: "field_62597c2638cde", type: "text", desc: "Title (left column)" },
      "block-list_list": { id: "field_62597c2638d80", type: "repeater", desc: "List items", subFields: { "text": "text" } },
    },
    parentField: "field_62597c262c364",
  },

  "block-listnumber": {
    name: "acf/block-listnumber",
    description: "Numbered list – auto-numbered steps with descriptions. Good for how-it-works, process steps.",
    fields: {
      "block-listnumber_title": { id: "field_62598384ea41d", type: "text", desc: "Section title" },
      "block-listnumber_list": { id: "field_62598384ea453", type: "repeater", desc: "Numbered items", subFields: { "text": "text" } },
    },
    parentField: "field_62598384ddba8",
  },

  "block-profits": {
    name: "acf/block-profits",
    description: "Benefits/profits – grid of cards with large image, title, and description text. Two-column layout. Shows program benefits visually.",
    fields: {
      "block-profits_title": { id: "field_625e6ae61e653", type: "text", desc: "Section title" },
      "block-profits_list": { id: "field_625e6ae61e68b", type: "repeater", desc: "Benefit cards", subFields: {
        "image": "image", "title": "text", "text": "wysiwyg"
      }},
    },
    parentField: "field_625e6ae5df3ad",
  },

  "block-faq": {
    name: "acf/block-faq",
    description: "FAQ accordion – title on left, expandable Q&A on right. Essential for landing pages.",
    fields: {
      "block-faq_title": { id: "field_625e795689c8f", type: "text", desc: "Section title (e.g. 'FAQ')" },
      "block-faq_list": { id: "field_625e795689cc6", type: "repeater", desc: "FAQ items", subFields: {
        "question": "text (H3)", "answer": "wysiwyg"
      }},
    },
    parentField: "field_625e79567d2ff",
  },

  "block-table": {
    name: "acf/block-table",
    description: "Data table – title + rows with up to 4 columns + optional text below. For pricing, comparisons, specs.",
    fields: {
      "block-table_title": { id: "field_625eab06cd89c", type: "text", desc: "Table title" },
      "block-table_table": { id: "field_625eab74f583b", type: "repeater", desc: "Table rows", subFields: {
        "col1": "text", "col2": "text (optional)", "col3": "text (optional)", "col4": "text (optional)"
      }},
      "block-table_textunder": { id: "field_625eabec77a1d", type: "wysiwyg", desc: "Text below table" },
    },
    parentField: "field_625eaaf5cd89b",
  },

  "block-instagram": {
    name: "acf/block-instagram",
    description: "Instagram feed – title + Instagram feed shortcode embed + 'Zobacz więcej' link to IG profile.",
    fields: {
      "block-instagram_title": { id: "field_629dea3d057d0", type: "text", desc: "Section title" },
      "block-instagram_code": { id: "field_629debc349942", type: "textarea", desc: "Instagram feed shortcode" },
    },
    parentField: "field_629dea3cdd250",
  },

  "block-newsletter": {
    name: "acf/block-newsletter",
    description: "Newsletter signup – title + HubSpot form embed. Pulls title and code from homepage settings.",
    fields: {},
    parentField: null,
  },

  "block-choose": {
    name: "acf/block-choose",
    description: "Trust logos / 'As featured in' – title + row of partner/media logos. Pulls from homepage settings.",
    fields: {},
    parentField: null,
  },

  "block-message": {
    name: "acf/block-message",
    description: "Messages/announcements – tabbed interface with trip details, organizational info, PDFs. Complex block pulling from 'wyjazdy' CPT.",
    fields: {},
    parentField: null,
  },
};

// Shared addons fields (present in every block)
export const ADDONS_FIELDS = {
  "addons": { id: "field_62fb56edcad3f" },
  "addons_blockid": { id: "field_62fb56f7cad40" },
};

export const MARKET_CONFIG = {
  "angloville.pl": {
    name: "Angloville Polska",
    domain: "angloville.pl",
    defaultLanguage: "pl",
    products: [
      "Angloville Junior (11-18 lat) - obozy w Polsce",
      "Angloville Kids (7-10 lat)",
      "Angloville Adult (18+)",
      "Angloville Family",
      "Angloville Plus Londyn (18+)",
      "Angloville Plus Eurotrip (18+)",
      "Junior International Malta (11-18)",
      "Junior International Anglia (11-18)",
      "Angloville SKI (Alpy/Austria)",
      "Wymiana USA J1/F1 (licealiści)",
      "Ferie zimowe",
      "Angloville Beginner (A0-A1)",
      "California 50+ (nowy 2026)",
      "Wyjazdy egzotyczne 18-30 (nowy 2026)",
    ],
    brandInfo: "Obozy językowe z native speakerami z UK, USA, Australii. 4.8/5 na Google (1900+ opinii). 40%+ powracających klientów. NIE używać 'teaching' ani 'szkoła językowa' dla Malty.",
  },
  "angloville.com": {
    name: "Angloville Native Speakers",
    domain: "angloville.com",
    defaultLanguage: "en",
    products: [
      "IP (Immersion Programme) - volunteer in Poland",
      "ESL Mentor programme",
      "NNS (Non-Native Speakers)",
      "TEFL in Asia",
      "Avocado Jobs",
    ],
    brandInfo: "Recruit English-speaking volunteers for immersion programs in Europe. Free accommodation, meals, cultural exchange. TEFL training included. 8000+ participants/year.",
  },
  "angloville.it": {
    name: "Angloville Italia",
    domain: "angloville.it",
    defaultLanguage: "it",
    products: [
      "Campo Junior (11-18 anni)",
      "Campo Kids (7-10 anni)",
      "International Malta",
      "International Londra",
      "Year Abroad / Anno negli USA",
      "AV Meets (alumni)",
    ],
    brandInfo: "Campi di immersione in inglese con native speakers da UK, USA, Australia. NON usare 'teaching' o 'scuola di lingue' per Malta.",
  },
  "angloville.com.br": {
    name: "Angloville Brasil",
    domain: "angloville.com.br",
    defaultLanguage: "pt",
    products: [
      "Programas Junior (11-18 anos)",
      "Programas Adultos (18+)",
      "Malta International",
      "Eurotrip",
      "Imersão na Polônia",
    ],
    brandInfo: "Programas de imersão em inglês na Europa com native speakers. Aprenda inglês viajando pela Europa.",
  },
};

export const AVAILABLE_LANGUAGES = [
  { code: "pl", name: "Polski" },
  { code: "en", name: "English" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "uk", name: "Українська" },
];

export function getBlocksList(): string {
  return Object.entries(BLOCKS_LIBRARY)
    .map(([key, block]) => `- **${key}** (${block.name}): ${block.description}`)
    .join("\n");
}

export function getBlockDetails(blockNames: string[]): string {
  return blockNames
    .map((name) => {
      const block = BLOCKS_LIBRARY[name as keyof typeof BLOCKS_LIBRARY];
      if (!block) return `Block "${name}" not found in library.`;

      const fieldsDoc = Object.entries(block.fields)
        .map(([fieldName, field]: [string, any]) => {
          let line = `  - ${fieldName} (${field.type}): ${field.desc}`;
          if (field.id) line += ` [field_id: ${field.id}]`;
          if (field.options) line += ` options: [${field.options.join(", ")}]`;
          if (field.subFields) line += `\n    subFields: ${JSON.stringify(field.subFields)}`;
          return line;
        })
        .join("\n");

      const parentInfo = block.parentField ? `\nParent group field: ${block.parentField}` : "";

      return `## ${name} (${block.name})
${block.description}${parentInfo}
Addons: addons=${ADDONS_FIELDS.addons.id}, addons_blockid=${ADDONS_FIELDS.addons_blockid.id}
Fields:
${fieldsDoc || "  (no configurable fields - uses global/homepage settings)"}`;
    })
    .join("\n\n---\n\n");
}
