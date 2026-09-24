/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sky/BB palette — from Figma design system (2026-09-17 UI upgrade, see AGENTS.md §6).
        // Names mirror the Figma variables (--bb-*) as-is. (The old MD3 blue palette was removed
        // in the 2026-09-25 polish pass once nothing referenced it.)
        "sky-brand": "#56d9d2",
        "sky-deep": "#146b63",
        "sky-tint": "#e5f8f5",
        "sky-ink": "#23282b",
        "sky-muted": "#60676b",
        "sky-line": "#e3e6e8",
        "sky-white": "#ffffff",
        "sky-bg": "#f6f7f8",
        "sky-bath": "#dceefe",
        "sky-sky": "#8de3db",
        "sky-kitchen": "#fbe8d4",
        "sky-living": "#e9e1fa",
        "sky-bed": "#e2efda",
        onbrand: "#123c36",
        "literal-white": "#ffffff",
        porcelain: "#ffffff",
        "art-line": "#64807a",
        "space-bath-icon": "#41758e",
        "space-kitchen-icon": "#95613c",
        "space-living-icon": "#766095",
        "space-bed-icon": "#5e7d4f",
        // Dialog backdrop (Figma Sky / Dialog 31:1908). Full-screen, over header + nav.
        scrim: "rgba(20, 26, 24, 0.7)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1.25rem",
        full: "9999px",
        // Sky/BB surfaces (2026-09-24 polish): 40px space tile · nav/switch row · item row.
        // Cards = 2xl (20), info cards = 3xl (24).
        tile: "14px",
        "row-sm": "16px",
        row: "18px",
      },
      spacing: {
        "space-xxs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.25rem",
        "space-xl": "1.5rem",
        "space-2xl": "2rem",
        // Figma screen gutter is 24px on every page (was 20px before the 2026-09-24 pass).
        "margin-screen": "1.5rem",
        // Fixed chrome heights (Figma "Brand / header" 54, "Navigation" tab row 48 + 12 top pad + 12 bottom pad).
        header: "54px",
      },
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Malgun Gothic"',
          '"Apple SD Gothic Neo"',
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "0", fontWeight: "700" }],
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "0", fontWeight: "700" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0", fontWeight: "600" }],
        "title-sm": ["16px", { lineHeight: "24px", letterSpacing: "0", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0", fontWeight: "400" }],
        caption: ["11px", { lineHeight: "14px", letterSpacing: "0", fontWeight: "500" }],
        "title-md": ["18px", { lineHeight: "26px", letterSpacing: "0", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0", fontWeight: "500" }],
        "body-lg": ["15px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "400" }],
        // Figma "BB/*" text styles (2026-09-24, additive — the tokens above stay as-is; see AGENTS.md §6).
        "bb-display": ["32px", { lineHeight: "42px", letterSpacing: "0", fontWeight: "700" }],
        "bb-heading": ["26px", { lineHeight: "36px", letterSpacing: "0", fontWeight: "700" }],
        "bb-title": ["18px", { lineHeight: "28px", letterSpacing: "0", fontWeight: "700" }],
        "bb-label": ["14px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "500" }],
        "bb-body": ["14px", { lineHeight: "22px", letterSpacing: "0", fontWeight: "400" }],
        "bb-caption": ["12px", { lineHeight: "18px", letterSpacing: "0", fontWeight: "400" }],
        // Toast / small text link / empty-card copy (off the Figma scale but recurring).
        "bb-label-sm": ["13px", { lineHeight: "19px", letterSpacing: "0", fontWeight: "500" }],
        "bb-small": ["10px", { lineHeight: "16px", letterSpacing: "0", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
