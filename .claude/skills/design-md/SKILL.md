---
name: design-md
description: Write, update or validate a DESIGN.md (Google's format for describing a visual identity to coding agents) for this project. Use when asked to create or update DESIGN.md, document the site's design system, or before restyling a page so tokens and rationale stay in one place.
license: Apache-2.0 (spec from google-labs-code/design.md)
---

# DESIGN.md

DESIGN.md is a format from google-labs-code/design.md. It combines design tokens (YAML front matter) with prose that says why each value exists and how to apply it. The full spec is in [references/spec.md](references/spec.md): read it before writing the file.

## In this project

- The file goes at the repository root: `DESIGN.md`.
- Take tokens from the code, not from memory. The sources are `styles.css` (`:root` variables, `@font-face`) and `artus-react/app/artus.css` / `globals.css`. If the two versions disagree, record the difference and ask which one is right.
- Brand facts: Clínica Artus Ortopedia, Cuiabá, MT. Colors in use include `--ink #142a2f`, `--petrol #123e48`, `--accent #076f7c`, `--wash #eef4f4`, plus `#102e35` (footer). The type is Instrument Sans. Check these against the CSS before writing, because they can change.
- The logos are `assets/logo.svg` (white, for dark backgrounds) and `assets/logo-color.svg`.
- Keep the prose in Brazilian Portuguese, and keep the token keys in English, as the spec requires.

## Validate

```bash
npx @google/design.md lint DESIGN.md
```

Fix every error. Warnings about contrast are real: a clinic site must meet WCAG AA. Report what the lint returned.
