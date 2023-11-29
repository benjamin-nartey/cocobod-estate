import { proxy, subscribe } from 'valtio';
import { modalSlice } from './modalSlice';

const storedStateString = localStorage.getItem('currentUserState');

const initialState = storedStateString
  ? JSON.parse(storedStateString)
  : { currentUser: null, loadingState: false };

const state = proxy({ auth: initialState, modalSlice });

subscribe(state.auth, () => {
  localStorage.setItem('currentUserState', JSON.stringify(state));
});

export default state;
