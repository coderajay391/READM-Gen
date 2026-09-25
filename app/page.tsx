'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { HeaderBlock } from '@/components/HeaderBlock';
import { ToolbarBlock } from '@/components/ToolbarBlock';
import { EditorBlock } from '@/components/EditorBlock';
import { PreviewBlock } from '@/components/PreviewBlock';
import { TemplatesVaultBlock } from '@/components/TemplatesVaultBlock';
import { StatsBlock } from '@/components/StatsBlock';
import { CheatSheetModal } from '@/components/CheatSheetModal';
import { MARKDOWN_TEMPLATES, MarkdownTemplate } from '@/lib/templates';
import { useTheme } from '@/hooks/use-theme';
import {
  calculateMarkdownStats,
  insertMarkdownSyntax,
  insertLinePrefix,
  downloadFile,
} from '@/lib/markdown-utils';

export default function MarkdownGeneratorPage() {
  // Initial document state with a high quality starter README
  const [content, setContent] = useState<string>(() => {
    return MARKDOWN_TEMPLATES[0].content;
  });
  const [fileName, setFileName] = useState<string>('README.md');
  const [isDark, handleToggleTheme] = useTheme();
  const [hasCopiedRaw, setHasCopiedRaw] = useState<boolean>(false);
  const [hasCopiedHtml, setHasCopiedHtml] = useState<boolean>(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    setHasUnsavedChanges(true);
  };

  // Insert syntax into textarea at cursor or selection
  const handleInsertSyntax = (
    prefix: string,
    suffix: string = '',
    defaultText: string = 'text'
  ) => {
    if (!textareaRef.current) return;
    const { newText, newCursorStart, newCursorEnd } = insertMarkdownSyntax(
      textareaRef.current,
      prefix,
      suffix,
      defaultText
    );
    setContent(newText);
    setHasUnsavedChanges(true);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newCursorStart;
        textareaRef.current.selectionEnd = newCursorEnd;
      }
    }, 0);
  };

  // Insert line prefix into textarea
  const handleInsertLinePrefix = (prefix: string) => {
    if (!textareaRef.current) return;
    const { newText, newCursorStart, newCursorEnd } = insertLinePrefix(
      textareaRef.current,
      prefix
    );
    setContent(newText);
    setHasUnsavedChanges(true);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newCursorStart;
        textareaRef.current.selectionEnd = newCursorEnd;
      }
    }, 0);
  };

  // Insert standard markdown table
  const handleInsertTable = () => {
    const tableTemplate = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Data A | Center B | 100 |\n| Data C | Center D | 250 |\n\n`;
    if (!textareaRef.current) {
      setContent((prev) => prev + tableTemplate);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const newVal = val.substring(0, start) + tableTemplate + val.substring(end);
    setContent(newVal);
    setHasUnsavedChanges(true);

    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + tableTemplate.length;
    }, 0);
  };

  // Download .md file
  const handleDownloadMd = () => {
    downloadFile(content, fileName, 'text/markdown;charset=utf-8');
    setHasUnsavedChanges(false);
  };

  // Copy raw markdown to clipboard
  const handleCopyRaw = () => {
    navigator.clipboard.writeText(content);
    setHasCopiedRaw(true);
    setTimeout(() => setHasCopiedRaw(false), 2000);
  };

  // Copy rendered HTML representation
  const handleCopyHtml = () => {
    const htmlString = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName.replace('.md', '')}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #24292e; }
    h1, h2, h3 { border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    table, th, td { border: 1px solid #dfe2e5; padding: 8px 12px; }
    th { background: #f6f8fa; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
    code { font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; background: rgba(27,31,35,.05); padding: 2px 4px; border-radius: 3px; font-size: 85%; }
    blockquote { border-left: 4px solid #dfe2e5; color: #6a737d; padding: 0 1em; margin: 0; }
  </style>
</head>
<body>
  ${content
    .split('\n')
    .map((line) => {
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
      if (line.trim().length > 0) return `<p>${line}</p>`;
      return '';
    })
    .join('\n  ')}
</body>
</html>`;

    navigator.clipboard.writeText(htmlString);
    setHasCopiedHtml(true);
    setTimeout(() => setHasCopiedHtml(false), 2000);
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (!textareaRef.current) {
          setContent((prev) => prev + text);
          return;
        }
        const el = textareaRef.current;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const val = el.value;
        const newVal = val.substring(0, start) + text + val.substring(end);
        setContent(newVal);
        setHasUnsavedChanges(true);

        setTimeout(() => {
          el.focus();
          el.selectionStart = el.selectionEnd = start + text.length;
        }, 0);
      }
    } catch {
      // If clipboard permission prompt is blocked, focus textarea for manual Ctrl+V
      textareaRef.current?.focus();
    }
  };

  // Clear text
  const handleClear = () => {
    setContent('');
    setHasUnsavedChanges(true);
    textareaRef.current?.focus();
  };

  // File upload from local system
  const handleFileUpload = (newContent: string, uploadedName: string) => {
    setContent(newContent);
    setFileName(uploadedName.endsWith('.md') ? uploadedName : `${uploadedName}.md`);
    setHasUnsavedChanges(false);
  };

  // Template selection
  const handleSelectTemplate = (tpl: MarkdownTemplate) => {
    setContent(tpl.content);
    setFileName(tpl.filename);
    setHasUnsavedChanges(false);
    textareaRef.current?.focus();
  };

  // New blank document
  const handleReset = () => {
    setContent('# New Document\n\nWrite your content here...');
    setFileName('untitled.md');
    setHasUnsavedChanges(false);
  };

  // Calculate live stats
  const stats = calculateMarkdownStats(content);

  return (
    <div
      suppressHydrationWarning
      className={`min-h-screen ${
        isDark ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-100/70 text-neutral-900'
      } transition-colors duration-200`}
    >
      {/* Background Subtle Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-200/40 via-transparent to-transparent dark:from-neutral-800/20 dark:via-transparent dark:to-transparent" />

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex flex-col gap-4">
        {/* Bento Block C: Header & Theme Controller */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <HeaderBlock
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            fileName={fileName}
            onFileNameChange={setFileName}
            onReset={handleReset}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </motion.div>

        {/* Bento Block D: Toolbar / Actions Control */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <ToolbarBlock
            onInsertSyntax={handleInsertSyntax}
            onInsertLinePrefix={handleInsertLinePrefix}
            onInsertTable={handleInsertTable}
            onDownloadMd={handleDownloadMd}
            onCopyRaw={handleCopyRaw}
            onCopyHtml={handleCopyHtml}
            onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
            hasCopiedRaw={hasCopiedRaw}
            hasCopiedHtml={hasCopiedHtml}
          />
        </motion.div>

        {/* Primary Workspace Grid: Block A (Editor) & Block B (Live Preview) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch"
        >
          {/* Block A: Input Editor Area */}
          <div className="h-full">
            <EditorBlock
              value={content}
              onChange={handleContentChange}
              textareaRef={textareaRef}
              onClear={handleClear}
              onPasteClipboard={handlePasteClipboard}
              onFileUpload={handleFileUpload}
            />
          </div>

          {/* Block B: Live Markdown Previewer */}
          <div className="h-full">
            <PreviewBlock
              markdown={content}
              isDark={isDark}
              isFullscreen={isFullscreenPreview}
              onToggleFullscreen={() => setIsFullscreenPreview((prev) => !prev)}
              onLoadSample={() => handleSelectTemplate(MARKDOWN_TEMPLATES[0])}
            />
          </div>
        </motion.div>

        {/* Bottom Bento Row: Block E (Templates Vault) & Block F (File Statistics) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="grid grid-cols-1 gap-4"
        >
          {/* Block F: File Statistics & Metadata */}
          <StatsBlock stats={stats} />

          {/* Block E: Quick Snippets / Templates Vault */}
          <TemplatesVaultBlock
            onSelectTemplate={handleSelectTemplate}
            hasContent={content.trim().length > 0}
          />
        </motion.div>
      </main>

      {/* Syntax Reference Cheatsheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        onInsertExample={(example) => {
          if (!textareaRef.current) {
            setContent((prev) => prev + '\n' + example);
            return;
          }
          const el = textareaRef.current;
          const start = el.selectionStart;
          const end = el.selectionEnd;
          const val = el.value;
          const newVal = val.substring(0, start) + example + val.substring(end);
          setContent(newVal);
          setHasUnsavedChanges(true);
          setIsCheatSheetOpen(false);

          setTimeout(() => {
            el.focus();
            el.selectionStart = el.selectionEnd = start + example.length;
          }, 0);
        }}
      />
    </div>
  );
}
