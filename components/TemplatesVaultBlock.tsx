'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, ArrowRight, FileCheck, AlertCircle } from 'lucide-react';
import { MARKDOWN_TEMPLATES, MarkdownTemplate } from '@/lib/templates';

interface TemplatesVaultBlockProps {
  onSelectTemplate: (template: MarkdownTemplate) => void;
  hasContent: boolean;
}

export function TemplatesVaultBlock({
  onSelectTemplate,
  hasContent,
}: TemplatesVaultBlockProps) {
  const [pendingTemplate, setPendingTemplate] = useState<MarkdownTemplate | null>(null);

  const handleClick = (tpl: MarkdownTemplate) => {
    if (hasContent) {
      setPendingTemplate(tpl);
    } else {
      onSelectTemplate(tpl);
    }
  };

  const handleConfirmReplace = () => {
    if (pendingTemplate) {
      onSelectTemplate(pendingTemplate);
      setPendingTemplate(null);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Starter Templates Vault
          </h2>
        </div>
        <span className="text-xs text-neutral-600 dark:text-neutral-300">
          {MARKDOWN_TEMPLATES.length} templates available
        </span>
      </div>

      {/* Confirmation Overlay if editor already has text */}
      {pendingTemplate && (
        <div className="mb-4 p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              Replace current editor text with <strong>{pendingTemplate.title}</strong>?
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConfirmReplace}
              className="px-2.5 py-1 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
            >
              Replace
            </button>
            <button
              onClick={() => setPendingTemplate(null)}
              className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 flex-1">
        {MARKDOWN_TEMPLATES.map((tpl) => (
          <motion.button
            key={tpl.id}
            onClick={() => handleClick(tpl)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex flex-col justify-between text-left p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/40 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-800/80 transition-all shadow-2xs"
          >
            <div>
              {/* Category & Title with Zero-Pill discipline */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
                <span>{tpl.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{tpl.filename}</span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors mb-1.5">
                {tpl.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-300">
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Ready to use</span>
              </span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-neutral-900 dark:text-neutral-100 font-medium">
                Load
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
