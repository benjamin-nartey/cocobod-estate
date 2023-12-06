export const CRUDTYPES = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  RESET: 'RESET',
};

export const modalSlice = {
  selectedRecord: null,
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
};
