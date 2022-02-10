import axios from "axios";
import apiservice from "./apiservice";
const instance = axios.create();

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const CHANGE_PASSWORD = "changePassword";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_ERROR = "setError";

instance.defaults.baseURL = process.env.VUE_APP_API_END_POINT;

const state = {
  errors: null,
  user: {},
  currentUser: JSON.parse(window.localStorage.getItem("user")),
  isAuthenticated: !!apiservice.getToken(),
};

const getters = {
  currentUser(state) {
    return state.currentUser;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      instance.post("/auth/login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          resolve(response);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [VERIFY_AUTH](context) {
    // JwtService.destroyToken();
    if (context.getters.isAuthenticated) {
      //ApiService.setHeader();
      var data = JSON.parse(window.localStorage.getItem("user"));
      context.commit(SET_AUTH, data);
      // ApiService.get("verify")
      //   .then(({ data }) => {
      //     context.commit(SET_AUTH, data);
      //   })
      //   .catch(({ response }) => {
      //     console.log(response);
      //     context.commit(SET_ERROR, response.data.errors);
      //   });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [CHANGE_PASSWORD](context, credentials) {
    return new Promise(resolve => {
      instance.post("/user/changepassword", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          resolve(response);
        });
    });
  },
  //  [BRANCH](context, credentials) {
  //   return new Promise(resolve => {
  //     instance.get("/branch/getallbranch?department_id=" + credentials.id, {headers : {'Authorization' : 'Bearer ' + credentials.token}})
  //       .then(({ data }) => {
  //         console.log(data);
  //         context.commit(SET_BRANCH, data.sucess);
  //         resolve(data.success);
  //         // return data;
  //       })
  //       .catch(({ response }) => {
  //         console.log(response);
  //         // context.commit(SET_ERROR, response);
  //       });
  //   });
  // }
};

const mutations = {
 [SET_ERROR](state, error) {
        state.errors = error;
 },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user.user_details;
    state.errors = {};
    window.localStorage.setItem("token", user.success.access_token);
    window.localStorage.setItem("isAuthenticated", true);
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("user_details", JSON.stringify(user.user_details));
    apiservice.saveToken(user.success.access_token);
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    window.localStorage.setItem("isAuthenticated", false);
    state.user = {};
    state.errors = {};
    apiservice.destroyToken();
    window.localStorage.clear();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
