'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  SquareCode,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Download,
  Copy,
  Check,
  FileCode,
  HelpCircle,
} from 'lucide-react';

interface ToolbarBlockProps {
  onInsertSyntax: (prefix: string, suffix?: string, defaultText?: string) => void;
  onInsertLinePrefix: (prefix: string) => void;
  onInsertTable: () => void;
  onDownloadMd: () => void;
  onCopyRaw: () => void;
  onCopyHtml: () => void;
  onOpenCheatSheet: () => void;
  hasCopiedRaw: boolean;
  hasCopiedHtml: boolean;
}

export function ToolbarBlock({
  onInsertSyntax,
  onInsertLinePrefix,
  onInsertTable,
  onDownloadMd,
  onCopyRaw,
  onCopyHtml,
  onOpenCheatSheet,
  hasCopiedRaw,
  hasCopiedHtml,
}: ToolbarBlockProps) {
  const toolButtonClass =
    'p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-neutral-400 outline-none flex items-center justify-center';

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs transition-colors duration-200">
      {/* Group A: Format Actions */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => onInsertLinePrefix('# ')}
            className={toolButtonClass}
            title="Heading 1 (# )"
            aria-label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertLinePrefix('## ')}
            className={toolButtonClass}
            title="Heading 2 (## )"
            aria-label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertLinePrefix('### ')}
            className={toolButtonClass}
            title="Heading 3 (### )"
            aria-label="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Text Decoration */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => onInsertSyntax('**', '**', 'bold text')}
            className={toolButtonClass}
            title="Bold (**text**)"
            aria-label="Bold text"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertSyntax('*', '*', 'italic text')}
            className={toolButtonClass}
            title="Italic (*text*)"
            aria-label="Italic text"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertSyntax('~~', '~~', 'strikethrough')}
            className={toolButtonClass}
            title="Strikethrough (~~text~~)"
            aria-label="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertSyntax('`', '`', 'code')}
            className={toolButtonClass}
            title="Inline Code (`code`)"
            aria-label="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => onInsertLinePrefix('- ')}
            className={toolButtonClass}
            title="Bullet List (- item)"
            aria-label="Bullet list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertLinePrefix('1. ')}
            className={toolButtonClass}
            title="Numbered List (1. item)"
            aria-label="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertLinePrefix('- [ ] ')}
            className={toolButtonClass}
            title="Task List (- [ ] item)"
            aria-label="Task list"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertLinePrefix('> ')}
            className={toolButtonClass}
            title="Blockquote (> quote)"
            aria-label="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Structured Elements */}
        <div className="flex items-center gap-0.5 pl-1.5">
          <button
            onClick={() => onInsertSyntax('```typescript\n', '\n```', '// code block')}
            className={toolButtonClass}
            title="Code Block (```)"
            aria-label="Code block"
          >
            <SquareCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertSyntax('[', '](https://example.com)', 'link label')}
            className={toolButtonClass}
            title="Insert Link ([text](url))"
            aria-label="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertSyntax('![', '](https://via.placeholder.com/600x300)', 'alt text')}
            className={toolButtonClass}
            title="Insert Image (![alt](url))"
            aria-label="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onInsertTable}
            className={toolButtonClass}
            title="Insert Table"
            aria-label="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInsertLinePrefix('---\n')}
            className={toolButtonClass}
            title="Horizontal Divider (---)"
            aria-label="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Group B: Action Items & Download / Copy */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCheatSheet}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Markdown Cheatsheet"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Syntax Guide</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:border-neutral-800 mx-0.5" />

        <button
          onClick={onCopyHtml}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 rounded-lg transition-colors"
          title="Copy Rendered HTML to clipboard"
        >
          {hasCopiedHtml ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400">HTML Copied</span>
            </>
          ) : (
            <>
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy HTML</span>
            </>
          )}
        </button>

        <button
          onClick={onCopyRaw}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/80 dark:bg-neutral-800/80 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 rounded-lg transition-colors"
          title="Copy Raw Markdown"
        >
          {hasCopiedRaw ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Raw</span>
            </>
          )}
        </button>

        <motion.button
          onClick={onDownloadMd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white rounded-lg shadow-sm transition-colors"
          title="Download .md file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .md</span>
        </motion.button>
      </div>
    </div>
  );
}
