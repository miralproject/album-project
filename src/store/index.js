import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';

const authenticated = createPersistedState({
  key: 'authenticated',
  paths: ['data'],
});

export const store = createStore({
  state() {
    return {
      data: "",
      isMassage: false,
      message: '',
      hallo: 'hallo',
      alert: ''
    };
  },
  mutations: {
    authenticated(state, {data}){
      state.data = data;
    },
    setIsMessage(state, {status}){
      state.isMassage = status;
      setTimeout(() => {
        state.isMassage = false;
      }, 10000);
    },
    setMessage(state, {message}){
      state.message = message;
      setTimeout(() => {
        state.message = '';
      }, 10000);
    },
    setAlert(state, {alert}){
      state.alert = alert;
      setTimeout(() => {
        state.alert = '';
      }, 10000);
    }
  },
  plugins: [authenticated],
});
