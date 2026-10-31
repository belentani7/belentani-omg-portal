# Official tooling guidance applied to this repository

Date: 2026-10-31. Scope: belentani7/belentani-omg-portal only.

## Cursor

Cursor project rules are version-controlled under .cursor/rules and use MDC metadata. This repository adds an always-applied rule that protects public-only repository metadata, visual continuity and generated-page provenance. The rule names the canonical source and the verification commands.

Official documentation: https://docs.cursor.com/context/rules-for-ai

## GitHub Actions

The CI workflow grants contents: read, disables persisted checkout credentials, and pins checkout and setup-node to full SHAs verified from their official GitHub repositories. CI runs on pull requests and pushes, regenerates/checks the 300 public pages, runs privacy and series tests, and parses every HTML document. CodeQL and repository-safety workflows retain read-only content permissions; CodeQL alone receives security-events: write.

Official documentation: https://docs.github.com/en/actions/reference/security/secure-use
Official workflow permissions: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#permissions

Verified action references:
- actions/checkout v4.2.2: 11bd71901bbe5b1630ceea73d27597364c9af683
- actions/setup-node v4.4.0: 49933ea5288caeca8642d1e84afbd3f7d6820020
- github/codeql-action v4: 9b3254085494b55a0f7c4c2b3d2d52cc712ce370

## Microsoft Learn

The collection uses native headings, navigation, form controls, labels, status announcements and SVG title/description. Every page has a skip link, visible keyboard focus, sufficient contrast indicators beyond color, and a reduced-motion rule. Study visuals are static and have meaningful accessible names.

Official accessibility design guidance: https://learn.microsoft.com/en-us/microsoft-edge/accessibility/design
Official accessibility implementation guidance: https://learn.microsoft.com/en-us/microsoft-edge/accessibility/build/
