'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Clipboard,
  Trash2,
  Upload,
  AlignLeft,
  Check,
  RotateCcw,
} from 'lucide-react';

interface EditorBlockProps {
  value: string;
  onChange: (val: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onClear: () => void;
  onPasteClipboard: () => void;
  onFileUpload: (content: string, name: string) => void;
}

export function EditorBlock({
  value,
  onChange,
  textareaRef,
  onClear,
  onPasteClipboard,
  onFileUpload,
}: EditorBlockProps) {
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync scroll between textarea and line numbers gutter
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Update cursor position
  const updateCursorPosition = () => {
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart;
    const textBefore = el.value.substring(0, pos);
    const lines = textBefore.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  // Handle Tab key for clean 2-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;

      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      onChange(newVal);

      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Drag and drop file ingestion
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (typeof text === 'string') {
        onFileUpload(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  // Calculate lines array for line numbers
  const linesCount = Math.max(1, value.split('\n').length);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col h-full min-h-[500px] lg:min-h-[560px] bg-white dark:bg-neutral-900 border ${
        isDragOver
          ? 'border-neutral-950 dark:border-white ring-2 ring-neutral-400 dark:ring-neutral-600'
          : 'border-neutral-200/90 dark:border-neutral-800'
      } rounded-2xl shadow-xs overflow-hidden transition-all duration-200`}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 select-none">
        <div className="flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Markdown Editor
          </h2>
          <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-300 hidden sm:inline">
            · UTF-8
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Import .md or .txt file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={onPasteClipboard}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {showClearConfirm ? (
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
              <span className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                Clear all?
              </span>
              <button
                onClick={() => {
                  onClear();
                  setShowClearConfirm(false);
                }}
                className="p-1 text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-200"
                title="Confirm clear"
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="p-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-700"
                title="Cancel"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (value.trim().length > 0) {
                  setShowClearConfirm(true);
                }
              }}
              disabled={value.trim().length === 0}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-40 disabled:hover:text-neutral-500 rounded-lg transition-colors"
              title="Clear all text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas with Synchronized Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-11 sm:w-13 py-3.5 text-right pr-3 select-none bg-neutral-50/70 dark:bg-neutral-900/60 border-r border-neutral-100 dark:border-neutral-800/80 font-mono text-[13px] leading-6 text-neutral-500 dark:text-neutral-400 overflow-hidden"
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              className={`${
                cursorPos.line === num
                  ? 'text-neutral-950 dark:text-white font-medium'
                  : ''
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative flex-1 h-full">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onKeyDown={handleKeyDown}
            placeholder="# Start writing markdown here...
            
Paste text from anywhere or select a template from below."
            spellCheck={false}
            className="w-full h-full resize-none p-3.5 bg-transparent font-mono text-[13px] leading-6 text-neutral-900 dark:text-neutral-100 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600 overflow-y-auto whitespace-pre selection:bg-neutral-200 dark:selection:bg-neutral-800"
          />

          {isDragOver && (
            <div className="absolute inset-0 bg-neutral-900/10 dark:bg-white/10 backdrop-blur-xs flex items-center justify-center pointer-events-none">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2 rounded-xl text-xs font-medium text-neutral-900 dark:text-white shadow-lg">
                Drop .md or .txt file here to import
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 select-none">
        <div className="flex items-center gap-3">
          <span>
            Ln <span className="tabular-nums font-medium text-neutral-700 dark:text-neutral-300">{cursorPos.line}</span>, Col{' '}
            <span className="tabular-nums font-medium text-neutral-700 dark:text-neutral-300">{cursorPos.col}</span>
          </span>
          <span className="hidden sm:inline">· Tab Size: 2 spaces</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Markdown GFM</span>
        </div>
      </div>
    </div>
  );
}
