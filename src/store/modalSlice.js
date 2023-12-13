export const CRUDTYPES = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  RESET: 'RESET',
};

export const modalSlice = {
  pageNum: 1,
  selectedRecord: null,
  reportFilters: null,
  crudType: CRUDTYPES.ADD,
  showAddDeploymentModal: false,
  toggleAddDeploymentModal() {
    this.showAddDeploymentModal = !this.showAddDeploymentModal;
  },

  showNewDeploymentModal: false,
  toggleShowNewDeploymentModal() {
    this.showNewDeploymentModal = !this.showNewDeploymentModal;
  },
  showAddDistrictModal: false,
  toggleShowAddDistrictModal() {
    this.showAddDistrictModal = !this.showAddDistrictModal;
  },
  showEditPropertyModal: false,
  toggleshowEditPropertyModal() {
    this.showEditPropertyModal = !this.showEditPropertyModal;
  },
  showReportModal: false,
  toggleshowReportModal() {
    this.showReportModal = !this.showReportModal;
  },
  showReferencesUploadModal: false,
  toggleshowReferencesUploadModal() {
    this.showReferencesUploadModal = !this.showReferencesUploadModal;
  },
};
