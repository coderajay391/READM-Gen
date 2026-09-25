'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, BookOpen } from 'lucide-react';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertExample: (text: string) => void;
}

interface SyntaxItem {
  element: string;
  syntax: string;
  example: string;
}

const CHEATSHEET_DATA: { category: string; items: SyntaxItem[] }[] = [
  {
    category: 'Typography & Headings',
    items: [
      { element: 'Heading 1', syntax: '# Heading 1', example: '# Project Title' },
      { element: 'Heading 2', syntax: '## Heading 2', example: '## Section Overview' },
      { element: 'Heading 3', syntax: '### Heading 3', example: '### Sub-topic' },
      { element: 'Bold', syntax: '**text**', example: '**bold statement**' },
      { element: 'Italic', syntax: '*text*', example: '*emphasized term*' },
      { element: 'Strikethrough', syntax: '~~text~~', example: '~~deprecated feature~~' },
    ],
  },
  {
    category: 'Lists & Organization',
    items: [
      { element: 'Bullet List', syntax: '- Item', example: '- First item\n- Second item' },
      { element: 'Numbered List', syntax: '1. Item', example: '1. Step one\n2. Step two' },
      { element: 'Task Checkbox', syntax: '- [x] Completed', example: '- [ ] Pending task\n- [x] Finished item' },
      { element: 'Blockquote', syntax: '> Quote text', example: '> "Simplicity is prerequisite for reliability."' },
      { element: 'Horizontal Rule', syntax: '---', example: '---' },
    ],
  },
  {
    category: 'Code & Media',
    items: [
      { element: 'Inline Code', syntax: '`code`', example: 'Use `npm install` to setup' },
      { element: 'Code Block', syntax: '```lang\n...\n```', example: '```typescript\nconst status = true;\n```' },
      { element: 'Hyperlink', syntax: '[Title](url)', example: '[Next.js Docs](https://nextjs.org)' },
      { element: 'Image Embed', syntax: '![Alt](url)', example: '![Preview](https://picsum.photos/400/200)' },
    ],
  },
  {
    category: 'Tables (GFM)',
    items: [
      {
        element: 'Table (3 Columns)',
        syntax: '| Col 1 | Col 2 | Col 3 |\n| :--- | :---: | ---: |\n| Left | Center | Right |',
        example: '| Metric | Value | Status |\n| :--- | :---: | ---: |\n| P99 Latency | 12ms | Nominal |',
      },
    ],
  },
];

export function CheatSheetModal({
  isOpen,
  onClose,
  onInsertExample,
}: CheatSheetModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Markdown Syntax Quick Reference
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close cheatsheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {CHEATSHEET_DATA.map((group, gIdx) => (
                <div key={group.category}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                    {group.category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {group.items.map((item, iIdx) => {
                      const id = `${gIdx}-${iIdx}`;
                      return (
                        <div
                          key={item.element}
                          className="flex flex-col justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/70 dark:border-neutral-800"
                        >
                          <div className="flex items-center justify-between text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1.5">
                            <span>{item.element}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onInsertExample(item.example)}
                                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                title="Insert into editor"
                              >
                                Insert
                              </button>
                              <button
                                onClick={() => handleCopy(item.syntax, id)}
                                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                title="Copy syntax"
                              >
                                {copiedIndex === id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="font-mono text-xs bg-white dark:bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-700/60 text-neutral-800 dark:text-neutral-200 overflow-x-auto whitespace-pre">
                            {item.syntax}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Supports GitHub Flavored Markdown (GFM) specs</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 font-medium text-xs rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
