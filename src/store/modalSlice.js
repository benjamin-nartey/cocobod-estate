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
  showLocationModal: false,
  toggleshowLocationModal() {
    this.showLocationModal = !this.showLocationModal;
  },
  showPoliticalDistrictModal: false,
  toggleshowPoliticalDistrictModal() {
    this.showPoliticalDistrictModal = !this.showPoliticalDistrictModal;
  },
  showPoliticalRegionModal: false,
  toggleshowPoliticalRegionModal() {
    this.showPoliticalRegionModal = !this.showPoliticalRegionModal;
  },
  showReportModal: false,
  toggleshowReportModal() {
    this.showReportModal = !this.showReportModal;
  },
  showUploadModal: false,
  toggleshowUploadModal() {
    this.showUploadModal = !this.showUploadModal;
  },
  showUserAddModal: false,
  toggleshowUserAddModal() {
    this.showUserAddModal = !this.showUserAddModal;
  },
  showDepartmentModal: false,
  toggleshowDepartmentModal() {
    this.showDepartmentModal = !this.showDepartmentModal;
  },
  showPropertyUnitModal: false,
  toggleshowPropertyUnitModal() {
    this.showPropertyUnitModal = !this.showPropertyUnitModal;
  },
};
