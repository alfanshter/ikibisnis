'use client';

import { use } from 'react';
import Link from 'next/link';
import { useProjectDetail } from '@/src/presentation/hooks/project/useProjectDetail';
import { ProjectDetailTemplate } from '@/src/presentation/components/templates/ProjectDetailTemplate';
import { DashboardSkeleton } from '@/src/presentation/components/templates/DashboardSkeleton';
import { Sidebar } from '@/src/presentation/components/organisms/Sidebar';
import { Icon } from '@/src/presentation/components/atoms/Icon';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { id } = use(params);
  const {
    project, loading, saving, notFound,
    showPaymentModal, showTerminModal, selectedTermin,
    onStatusChange, onMarkAsPaid, onClosePayModal,
    onOpenTerminModal, onPayTermin, onCloseTerminModal,
    onEdit,
  } = useProjectDetail(id);

  if (loading) return <DashboardSkeleton />;

  if (notFound || !project) {
    return (
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar activePage="Projects" />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="briefcase" className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Proyek Tidak Ditemukan</h2>
            <p className="text-slate-400 text-sm mb-6">Proyek dengan ID <span className="font-mono text-slate-300">{id}</span> tidak ada.</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all"
            >
              <Icon name="chevron-left" className="w-4 h-4" />
              Kembali ke Daftar Proyek
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ProjectDetailTemplate
      project={project}
      saving={saving}
      showPaymentModal={showPaymentModal}
      showTerminModal={showTerminModal}
      selectedTermin={selectedTermin}
      onEdit={onEdit}
      onStatusChange={onStatusChange}
      onMarkAsPaid={onMarkAsPaid}
      onClosePayModal={onClosePayModal}
      onOpenTerminModal={onOpenTerminModal}
      onPayTermin={onPayTermin}
      onCloseTerminModal={onCloseTerminModal}
    />
  );
}
