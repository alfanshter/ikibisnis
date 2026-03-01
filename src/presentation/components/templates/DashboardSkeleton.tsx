/**
 * Template: DashboardSkeleton
 * Shimmer loading skeleton that mirrors the exact dashboard layout.
 * Replaces full-page spinner with content-aware placeholders.
 */

'use client';

import React from 'react';
import { Sidebar } from '../organisms/Sidebar';

/* ─── Reusable shimmer primitives ─────────────────────────── */
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-700/60 rounded-lg animate-pulse ${className}`} />
);

const ShimmerText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-700/60 rounded animate-pulse ${className}`} />
);

/* ─── TopBar skeleton ──────────────────────────────────────── */
const TopBarSkeleton: React.FC = () => (
  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700/30">
    <div className="space-y-2">
      <ShimmerText className="h-7 w-52" />
      <ShimmerText className="h-4 w-80" />
    </div>
    <div className="flex items-center gap-3">
      <Shimmer className="h-9 w-48 rounded-xl" />
      <Shimmer className="h-9 w-9 rounded-xl" />
      <Shimmer className="h-9 w-24 rounded-xl" />
    </div>
  </div>
);

/* ─── 4 Metric Cards ───────────────────────────────────────── */
const MetricCardSkeleton: React.FC = () => (
  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <ShimmerText className="h-3.5 w-24" />
        <ShimmerText className="h-8 w-32" />
      </div>
      <Shimmer className="w-10 h-10 rounded-lg shrink-0" />
    </div>
    <div className="flex items-center gap-2">
      <Shimmer className="h-5 w-14 rounded-full" />
      <ShimmerText className="h-3.5 w-28" />
    </div>
  </div>
);

/* ─── Project Status Section skeleton ─────────────────────── */
const ProjectStatusSkeleton: React.FC = () => (
  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-2">
        <ShimmerText className="h-5 w-48" />
        <ShimmerText className="h-3.5 w-60" />
      </div>
      <Shimmer className="h-8 w-32 rounded-lg" />
    </div>
    {/* Fake chart area */}
    <Shimmer className="h-48 w-full rounded-xl mb-5" />
    {/* Legend rows */}
    <div className="space-y-3">
      {[80, 65, 50, 40].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <Shimmer className="w-3 h-3 rounded-full shrink-0" />
          <ShimmerText className={`h-3.5 w-${w === 80 ? '32' : w === 65 ? '24' : w === 50 ? '20' : '16'}`} />
          <div className="flex-1" />
          <ShimmerText className="h-3.5 w-8" />
          <Shimmer className="h-1.5 w-24 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Recent Activity skeleton ─────────────────────────────── */
const ActivitySkeleton: React.FC = () => (
  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <ShimmerText className="h-5 w-36" />
      <ShimmerText className="h-4 w-24" />
    </div>
    {/* Activity rows */}
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex items-start gap-3">
          <Shimmer className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5 pt-0.5">
            <ShimmerText className="h-3.5 w-full" />
            <ShimmerText className={`h-3 ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Full Dashboard Skeleton ──────────────────────────────── */
export const DashboardSkeleton: React.FC = () => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar />

    <main className="flex-1 lg:ml-64 p-8 pt-16 lg:pt-8">
      <TopBarSkeleton />

      {/* Metrics row — 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => <MetricCardSkeleton key={i} />)}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectStatusSkeleton />
        </div>
        <div className="lg:col-span-1">
          <ActivitySkeleton />
        </div>
      </div>
    </main>
  </div>
);
