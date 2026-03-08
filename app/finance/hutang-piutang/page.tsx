'use client';

import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';
import { useDebt } from '@/src/presentation/hooks/finance/useDebt';
import { DebtTemplate } from '@/src/presentation/templates/DebtTemplate';

export default function HutangPiutangPage() {
  const state = useDebt();

  return (
    <PermissionGuard feature="hutang_piutang">
      <DebtTemplate
        collection={state.collection}
        summary={state.summary}
        query={state.query}
        listLoading={state.listLoading}
        saving={state.saving}
        toast={state.toast}
        showCreateModal={state.showCreateModal}
        showEditModal={state.showEditModal}
        showPayModal={state.showPayModal}
        editingDebt={state.editingDebt}
        payingDebt={state.payingDebt}
        deletingDebt={state.deletingDebt}
        openCreate={state.openCreate}
        closeCreate={state.closeCreate}
        openEdit={state.openEdit}
        closeEdit={state.closeEdit}
        openPay={state.openPay}
        closePay={state.closePay}
        openDelete={state.openDelete}
        closeDelete={state.closeDelete}
        onCreate={state.onCreate}
        onUpdate={state.onUpdate}
        onPay={state.onPay}
        onDelete={state.onDelete}
        setTypeFilter={state.setTypeFilter}
        setSearchFilter={state.setSearchFilter}
        setStatusFilter={state.setStatusFilter}
        setPage={state.setPage}
      />
    </PermissionGuard>
  );
}
