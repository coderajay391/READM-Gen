'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, FileText, Check, RefreshCw } from 'lucide-react';

interface HeaderBlockProps {
  isDark: boolean;
  onToggleTheme: () => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onReset: () => void;
  hasUnsavedChanges: boolean;
}

export function HeaderBlock({
  isDark,
  onToggleTheme,
  fileName,
  onFileNameChange,
  onReset,
  hasUnsavedChanges,
}: HeaderBlockProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [inputVal, setInputVal] = useState(fileName);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setInputVal(fileName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    let clean = inputVal.trim();
    if (!clean) clean = 'document';
    if (!clean.endsWith('.md')) clean = `${clean}.md`;
    onFileNameChange(clean);
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setInputVal(fileName);
      setIsEditingName(false);
    }
  };

  return (
    <header className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm transition-colors duration-200">
      {/* Zone 1: App Brand Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-sm">
          <FileText className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Markdown Studio
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-neutral-600 dark:text-neutral-300">
              v2.5
            </span>
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-300">
            Bento Workspace & Generator
          </span>
        </div>
      </div>

      {/* Zone 2: Document File Name & Quick State */}
      <div className="flex items-center gap-2 bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 rounded-xl px-3 py-1.5 transition-colors">
        <span className="text-xs text-neutral-600 dark:text-neutral-300 select-none">File:</span>
        {isEditingName ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-white dark:bg-neutral-900 text-xs font-mono font-medium text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-600 outline-none w-36 sm:w-48"
            />
            <button
              onClick={handleSaveName}
              className="p-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              title="Save file name"
              aria-label="Save file name"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={startEditing}
            className="group flex items-center gap-1.5 text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
            title="Click to rename file"
            aria-label="Rename file"
          >
            <span className="max-w-[160px] sm:max-w-[240px] truncate">{fileName}</span>
            <span className="text-[10px] text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
              (edit)
            </span>
          </button>
        )}

        {hasUnsavedChanges && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-1"
            title="Document has unsaved changes"
            aria-label="Unsaved changes"
          />
        )}
      </div>

      {/* Zone 3: Actions & Theme Controller */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 rounded-xl transition-colors"
          title="Reset to a blank document"
          aria-label="Reset document"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Doc</span>
        </button>

        {/* Dark/Light mode switcher with Framer Motion icon transition */}
        <motion.button
          suppressHydrationWarning
          onClick={onToggleTheme}
          whileTap={{ scale: 0.92 }}
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-neutral-400 outline-none"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="w-4 h-4 stroke-[2.2] text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 stroke-[2.2] text-amber-600" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </header>
  );
}
