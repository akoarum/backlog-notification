import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  backlogName: '',
  backlogTld: '',
  backlogKey: '',
  notificationSeconds: 'not',
  notificationCounts: 0,
  remindScope: {
    type: 'myself',
    projects: []
  },
  remindTiming: {
    date: 0,
    hour: 9
  },
  myId: '',
  projects: []
};

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  strict: true
});
