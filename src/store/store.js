import { proxy, subscribe } from "valtio";

const storedStateString = localStorage.getItem("currentUserState");

const initialState = storedStateString
  ? JSON.parse(storedStateString)
  : { currentUser: {}, loadingState: false };

const state = proxy(initialState);

subscribe(state, () => {
  localStorage.setItem("currentUserState", JSON.stringify(state));
});

export default state;
