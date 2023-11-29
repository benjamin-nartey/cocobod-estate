export const modalSlice = {
  showAddDeploymentModal: false,
  toggleAddDeploymentModal() {
    this.showAddDeploymentModal = !this.showAddDeploymentModal;
  },
  selectedRecord: null,
};
