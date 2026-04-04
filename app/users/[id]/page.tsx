'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserDetail } from '@/src/presentation/hooks/user/useUserDetail';
import { UserDetailTemplate } from '@/src/presentation/components/templates/user/UserDetailTemplate';
import { DashboardSkeleton } from '@/src/presentation/components/templates/shared/DashboardSkeleton';
import { Sidebar } from '@/src/presentation/components/organisms/shared/Sidebar';
import { Icon } from '@/src/presentation/components/atoms/Icon';

interface Props {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: Props) {
  const { id } = use(params);
  const router  = useRouter();
  const { user, loading, notFound } = useUserDetail(id);

  if (loading) return <DashboardSkeleton />;

  if (notFound || !user) {
    return (
      <div className="flex min-h-screen bg-slate-900">
        <Sidebar activePage="User Management" />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="user" className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Pengguna Tidak Ditemukan</h2>
            <p className="text-slate-400 text-sm mb-6">
              Pengguna dengan ID <span className="font-mono text-slate-300">{id}</span> tidak ada.
            </p>
            <Link
              href="/users"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all"
            >
              <Icon name="chevron-left" className="w-4 h-4" />
              Kembali ke Daftar Pengguna
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <UserDetailTemplate
      user={user}
      onEdit={() => router.push(`/users?edit=${user.id}`)}
    />
  );
}
