import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    edu_user_token: "",
    edu_user_type: -1,
    school: {},
    profile: {},
  },
  mutations: {
    setToken(state, value){
      state.edu_user_token = value
    },
    setUserType(state, value){
      state.edu_user_type = value
    },
    setSchool(state, value){
      state.school = value
    },
    setUserProfile(state, profile){
      state.profile = profile
    }
  },
  modules: {}
});
