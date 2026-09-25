'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Eye,
  Code2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';

interface PreviewBlockProps {
  markdown: string;
  isDark: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onLoadSample: () => void;
}

export function PreviewBlock({
  markdown,
  isDark,
  isFullscreen,
  onToggleFullscreen,
  onLoadSample,
}: PreviewBlockProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const handleCopySnippet = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const isEmpty = !markdown || markdown.trim().length === 0;

  return (
    <div
      className={`relative flex flex-col h-full min-h-[500px] lg:min-h-[560px] bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden transition-colors duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
      }`}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 select-none">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Live Preview
          </h2>

          {/* Segmented View Mode Filter Control */}
          <div className="ml-2 flex items-center p-0.5 bg-neutral-200/60 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Rendered
            </button>
            <button
              onClick={() => setViewMode('html')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'html'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              HTML Code
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-neutral-50/20 dark:bg-neutral-950/20">
        {isEmpty ? (
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Your formatted markdown will appear here
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-sm mb-4">
              Type in the editor, paste raw text, or load a starter template to see real-time rendered styling.
            </p>
            <button
              onClick={onLoadSample}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors shadow-xs"
            >
              Load README Starter
            </button>
          </div>
        ) : viewMode === 'preview' ? (
          <div className="max-w-none">
            <article
              className="prose dark:prose-invert prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-table:border prose-table:border-neutral-200 dark:prose-table:border-neutral-800 prose-th:bg-neutral-100/70 dark:prose-th:bg-neutral-800/70 prose-th:px-3.5 prose-th:py-2.5 prose-td:px-3.5 prose-td:py-2.5"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children }) => {
                    return <>{children}</>;
                  },
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !String(children).includes('\n');
                    const codeString = String(children).replace(/\n$/, '');

                    if (isInline) {
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded-md font-mono text-[12px] bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    const lang = match ? match[1] : 'code';
                    const snippetId = `snippet-${codeString.slice(0, 16)}`;

                    return (
                      <div className="my-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 overflow-hidden text-xs shadow-xs not-prose">
                        <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800 bg-neutral-950/60 font-mono text-[11px] text-neutral-400">
                          <span className="uppercase">{lang}</span>
                          <button
                            onClick={() => handleCopySnippet(codeString, snippetId)}
                            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                            title="Copy code snippet"
                          >
                            {copiedSnippetId === snippetId ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-4 overflow-x-auto font-mono text-[12px] leading-relaxed">
                          <code>{children}</code>
                        </div>
                      </div>
                    );
                  },
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 not-prose">
                      <table className="w-full text-left text-xs text-neutral-800 dark:text-neutral-200 border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700/80 font-semibold text-neutral-900 dark:text-neutral-100">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-3.5 py-2.5 text-xs font-semibold">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800/60">
                      {children}
                    </td>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-3 border-l-2 border-neutral-400 dark:border-neutral-600 pl-4 py-1 italic text-neutral-600 dark:text-neutral-300">
                      {children}
                    </blockquote>
                  ),
                  input: ({ checked, ...props }) => (
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0 mr-2"
                      {...props}
                    />
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          </div>
        ) : (
          /* HTML Raw Code View */
          <div className="h-full">
            <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800">
              <pre className="whitespace-pre-wrap">{getSimplifiedHtml(markdown)}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 text-[11px] text-neutral-600 dark:text-neutral-300 select-none">
        <div className="flex items-center gap-2">
          <span>Target: CommonMark & GitHub Flavored Markdown</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" />
          <span>Live Render Active</span>
        </div>
      </div>
    </div>
  );
}

// Lightweight HTML helper for raw preview
function getSimplifiedHtml(md: string): string {
  if (!md) return '<!-- No markdown content to display -->';
  // Return clean escaped HTML structure
  return `<!-- Rendered HTML Output -->\n<article class="markdown-body">\n  <!-- Interactive compiled DOM output from react-markdown -->\n  ${md
    .split('\n')
    .map((line) => {
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
      if (line.trim().length > 0) return `<p>${line}</p>`;
      return '';
    })
    .filter(Boolean)
    .join('\n  ')}\n</article>`;
}
