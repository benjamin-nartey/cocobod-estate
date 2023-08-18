import { proxy } from "valtio";

const state = proxy({
  currentUser: {},
  loadingState: false,
});

export default state;
