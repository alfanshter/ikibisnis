/**
 * Page: /projects/quotations
 * Halaman manajemen penawaran (Penawaran).
 */
'use client';
import { useQuotationManagement } from '@/src/presentation/hooks/quotation/useQuotationManagement';
import { QuotationManagementTemplate } from '@/src/presentation/components/templates/QuotationManagementTemplate';
import { PermissionGuard } from '@/src/presentation/components/providers/PermissionGuard';

export default function QuotationsPage() {
  const state = useQuotationManagement();

  return (
    <PermissionGuard feature="penawaran">
      <QuotationManagementTemplate
        /* Data */
        collection={state.collection}
        stats={state.stats}

        /* Flags */
        tableLoading={state.tableLoading}
        modalSaving={state.modalSaving}
        actionSaving={state.actionSaving}
        deleting={state.deleting}

        /* Modal state */
        showAddModal={state.showAddModal}
        editingQuotation={state.editingQuotation}
        deletingQuotation={state.deletingQuotation}
        accingQuotation={state.accingQuotation}
        rejectingQuotation={state.rejectingQuotation}
        convertingQuotation={state.convertingQuotation}

        /* Filters */
        statusFilter={state.statusFilter}
        search={state.search}
        page={state.page}

        /* Callbacks */
        onPageChange={state.onPageChange}
        onStatusFilter={state.onStatusFilter}
        onSearch={state.onSearch}
        onOpenAddModal={state.onOpenAddModal}

        onEditQuotation={state.onEditQuotation}
        onDeleteQuotation={state.onDeleteQuotation}
        onSendQuotation={state.onSendQuotation}
        onAccQuotation={state.onAccQuotation}
        onRejectQuotation={state.onRejectQuotation}
        onConvertQuotation={state.onConvertQuotation}

        onCloseModal={state.onCloseModal}
        onModalSubmit={state.onModalSubmit}

        onAccSubmit={state.onAccSubmit}
        onAccClose={state.onAccClose}

        onRejectSubmit={state.onRejectSubmit}
        onRejectClose={state.onRejectClose}

        onConvertSubmit={state.onConvertSubmit}
        onConvertClose={state.onConvertClose}

        onDeleteConfirm={state.onDeleteConfirm}
        onDeleteClose={state.onDeleteClose}
      />
    </PermissionGuard>
  );
}
