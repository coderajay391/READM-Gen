'use client';

import React from 'react';
import { BarChart3, Clock, Type, AlignJustify, Hash, Layers } from 'lucide-react';
import { MarkdownStats } from '@/lib/markdown-utils';

interface StatsBlockProps {
  stats: MarkdownStats;
}

export function StatsBlock({ stats }: StatsBlockProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 shadow-xs transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            Document Metrics
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {stats.readingTimeMinutes === 0
              ? '0 min read'
              : `~${stats.readingTimeMinutes} min read`}
          </span>
        </div>
      </div>

      {/* Numerical Metrics Grid with strict Tabular Figures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Words */}
        <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
            <Type className="w-3.5 h-3.5" />
            <span>Words</span>
          </div>
          <div className="text-xl font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
            {stats.words.toLocaleString()}
          </div>
        </div>

        {/* Characters (With spaces) */}
        <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
            <Hash className="w-3.5 h-3.5" />
            <span>Characters</span>
          </div>
          <div className="text-xl font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
            {stats.charsWithSpaces.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-0.5 tabular-nums">
            {stats.charsWithoutSpaces.toLocaleString()} no spaces
          </div>
        </div>

        {/* Lines */}
        <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
            <AlignJustify className="w-3.5 h-3.5" />
            <span>Lines</span>
          </div>
          <div className="text-xl font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
            {stats.lines.toLocaleString()}
          </div>
        </div>

        {/* Paragraphs */}
        <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Paragraphs</span>
          </div>
          <div className="text-xl font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
            {stats.paragraphs.toLocaleString()}
          </div>
        </div>

        {/* Total Headings */}
        <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
            <span>Headings</span>
          </div>
          <div className="text-xl font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
            {stats.headings.total}
          </div>
          <div className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-0.5 tabular-nums">
            H1: {stats.headings.h1} · H2: {stats.headings.h2} · H3: {stats.headings.h3}
          </div>
        </div>

        {/* Density / Speed Index */}
        <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 mb-1">
            <span>Read Cadence</span>
          </div>
          <div className="text-xl font-semibold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
            200 <span className="text-xs font-normal text-neutral-600 dark:text-neutral-300">wpm</span>
          </div>
          <div className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-0.5">
            Standard speed
          </div>
        </div>
      </div>
    </div>
  );
}
