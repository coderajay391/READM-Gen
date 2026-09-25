export interface MarkdownTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
  content: string;
}

export const MARKDOWN_TEMPLATES: MarkdownTemplate[] = [
  {
    id: 'readme-standard',
    title: 'Standard README',
    category: 'Open Source',
    description: 'A clean, comprehensive README file for open-source repositories.',
    filename: 'README.md',
    content: `# Project Name

A minimalist, high-performance solution built for modern engineering workflows.

## Key Highlights

- **Zero-Config Setup**: Get running in under 60 seconds with sensible defaults.
- **Type-Safe Architecture**: Written strictly in TypeScript with complete compile-time guarantees.
- **Ultra-Fast Performance**: Sub-millisecond response latency with minimal memory footprint.
- **Extensible Plugin Ecosystem**: Custom hooks and middleware for deep customization.

---

## Quick Start

### Installation

Install the package via your preferred package manager:

\`\`\`bash
# Using npm
npm install @organization/project-name

# Using pnpm
pnpm add @organization/project-name
\`\`\`

### Basic Usage

Initialize the client and invoke the primary handler:

\`\`\`typescript
import { createEngine } from '@organization/project-name';

const engine = createEngine({
  logLevel: 'info',
  enableTelemetry: false,
});

async function main() {
  const result = await engine.execute({
    mode: 'stream',
    timeoutMs: 3000,
  });

  console.log('Execution completed:', result.status);
}

main().catch(console.error);
\`\`\`

---

## Configuration Matrix

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`logLevel\` | \`string\` | \`'info'\` | Logging granularity (\`'debug'\` \\| \`'info'\` \\| \`'error'\`) |
| \`maxRetries\` | \`number\` | \`3\` | Number of automatic retries upon transient failure |
| \`cacheEnabled\` | \`boolean\` | \`true\` | Enables local memory caching for identical queries |

---

## Roadmap

- [x] Initial core architecture and engine release
- [x] Streaming output pipeline with backpressure handling
- [ ] Distributed cluster synchronization
- [ ] Native WebAssembly acceleration modules

---

## License

Distributed under the MIT License. See \`LICENSE\` for more information.
`,
  },
  {
    id: 'api-documentation',
    title: 'API Specification',
    category: 'Documentation',
    description: 'Technical REST/GraphQL API specification with endpoints, headers, and payload schemas.',
    filename: 'API_SPEC.md',
    content: `# API Specification: v2.4

This document outlines the core endpoints, authentication requirements, and rate limit policies.

## Base URL
\`\`\`http
https://api.domain.internal/v2
\`\`\`

## Authentication

All authenticated requests must include the bearer token inside the \`Authorization\` header:

\`\`\`http
Authorization: Bearer <user_session_token>
Content-Type: application/json
\`\`\`

---

## Endpoints

### 1. Retrieve Record Stream

\`GET /records/stream\`

Queries normalized records matching specified time-series boundaries.

#### Query Parameters

| Field | In | Type | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`cursor\` | query | string | No | Pagination cursor token for subsequent pages |
| \`limit\` | query | integer | No | Maximum entries returned (default: 50, max: 200) |
| \`status\` | query | string | Yes | Filter state (\`active\` \\| \`archived\` \\| \`flagged\`) |

#### Sample Response (\`200 OK\`)

\`\`\`json
{
  "status": "success",
  "data": [
    {
      "id": "rec_01h9x3p8",
      "timestamp": "2026-09-24T04:15:00Z",
      "metric_label": "latency_p99",
      "value_ms": 14.82,
      "region": "asia-southeast1"
    }
  ],
  "pagination": {
    "has_next": true,
    "next_cursor": "cursor_eyJhbGciOi"
  }
}
\`\`\`

---

## Error Handling

Errors return standard RFC-7807 problem detail payloads:

\`\`\`json
{
  "type": "https://errors.domain.internal/rate-limited",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate quota exceeded. Available again in 42 seconds."
}
\`\`\`
`,
  },
  {
    id: 'changelog',
    title: 'Release Changelog',
    category: 'Releases',
    description: 'Structured SemVer release notes tracking new features, improvements, and fixes.',
    filename: 'CHANGELOG.md',
    content: `# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [3.2.0] - 2026-09-24

### Added
- **Batch Normalization**: Direct parallel transformation for multi-file markdown payloads.
- **Custom Keybindings**: Added hotkeys for inline code (\`Cmd/Ctrl + E\`) and tables (\`Cmd/Ctrl + Shift + T\`).
- **Telemetry Counter**: Live word and paragraph metrics with zero layout shift.

### Changed
- Improved syntax parsing speed by 35% through incremental AST memoization.
- Standardized dark mode contrast to meet WCAG AAA standards on high-density displays.

### Fixed
- Fixed an issue where rapid consecutive undo operations could drop cursor anchor position.
- Resolved table column alignment inconsistency when using non-ASCII UTF-8 characters.

---

## [3.1.0] - 2026-08-15

### Added
- Export to standalone HTML file with bundled minimalist typographic styles.
- Drag-and-drop file ingestion support directly into the textarea canvas.

### Fixed
- Corrected list indentation normalization when pasting raw text from clipboard.
`,
  },
  {
    id: 'sprint-meeting-notes',
    title: 'Project Notes & Agenda',
    category: 'Productivity',
    description: 'Structured template for sprint syncs, technical alignment, and action checklists.',
    filename: 'MEETING_NOTES.md',
    content: `# Sprint Alignment & Architecture Review

**Date**: September 24, 2026  
**Facilitator**: Lead Architect  
**Participants**: Product Engineering, Infrastructure, Security

---

## Executive Summary

Discussion on scaling the client-side parsing pipeline and transitioning our build system to standalone deployment targets.

---

## Key Discussion Topics

### 1. Editor Latency & Typing Performance
- Need to keep keystroke latency under 16ms during continuous typing sessions.
- Identified that memoizing markdown AST tokens reduces frame drops by ~60%.

### 2. Export Pipeline Enhancements
- Users request direct \`.md\` file generation with custom slug naming.
- Added quick-copy buttons for both raw Markdown source and formatted HTML.

---

## Action Items & Ownership

- [x] Audit bundle sizes for markdown dependencies
- [x] Implement smooth hardware-accelerated theme transition
- [ ] Add export to PDF feature in upcoming milestone
- [ ] Conduct accessibility audit for keyboard tab traversal
`,
  },
];
