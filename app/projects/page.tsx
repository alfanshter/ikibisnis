'use client';

import { useProjectManagement } from '@/src/presentation/hooks/project/useProjectManagement';
import { ProjectManagementTemplate } from '@/src/presentation/components/templates/ProjectManagementTemplate';

export default function ProjectsPage() {
  const {
    collection, stats,
    tableLoading, modalSaving, deleting,
    showAddModal, editingProject, deletingProject,
    statusFilter, categoryFilter, search,
    handlePageChange, handleStatusFilter, handleCategoryFilter, handleSearch,
    handleAddProject, handleEditProject, handleDeleteProject, handleViewProject,
    handleModalClose, handleModalSubmit,
    handleDeleteConfirm, handleDeleteClose,
  } = useProjectManagement();

  return (
    <ProjectManagementTemplate
      collection={collection}
      stats={stats}
      tableLoading={tableLoading}
      modalSaving={modalSaving}
      deleting={deleting}
      showAddModal={showAddModal}
      editingProject={editingProject}
      deletingProject={deletingProject}
      statusFilter={statusFilter}
      categoryFilter={categoryFilter}
      search={search}
      onPageChange={handlePageChange}
      onStatusFilter={handleStatusFilter}
      onCategoryFilter={handleCategoryFilter}
      onSearch={handleSearch}
      onAddProject={handleAddProject}
      onEditProject={handleEditProject}
      onDeleteProject={handleDeleteProject}
      onViewProject={handleViewProject}
      onModalClose={handleModalClose}
      onModalSubmit={handleModalSubmit}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteClose={handleDeleteClose}
    />
  );
}
