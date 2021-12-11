import axios from "axios";
import apiservice from "./apiservice";
const instance = axios.create();

// action types
export const GET_QUALIFIED_PATIENT = "getQualifiedPatient";
export const ADD_PREREG = "addPreReg";
export const UPDATE_PREREG = "updatePreReg";
export const GET_PREREG_VERIFICATION = "getPreRegVerification";
export const GET_BARANGAY = "getBarangay";
export const GET_CATEGORIES = "getCategories";
export const GET_ID_CATEGORIES = "getIdCategories";
export const GET_EMPLOYEE_STATUS = "getEmployeeStatus";
export const GET_PROFESSIONS = "getProfessions";
export const GET_VACCINATORS = "getVaccinators";
export const GET_VACCINE_CATEGORIES = "getVaccineCategories";
export const VERIFY_PATIENT = "verifyPatient";
export const MONITOR_PATIENT = "monitorPatient";
export const VERIFY_PASSWORD = "verifyPassword";
export const UPDATE_SUMMARY = "updateSummary";
export const VOID_RECORD = "voidRecord";
export const GET_VASLINE_INFO = "getVasLineInfo";

// mutation types

instance.defaults.baseURL = "https://cvimsmicro.com/api";
// instance.defaults.baseURL = "https://cvimsmicro.com/api";

const state = {
  token: apiservice.getToken()
};

const getters = {
    token(state){
        return state.token;
    }
};

const actions = {
  [ADD_PREREG](context, credentials) {
  return new Promise(resolve => {
    instance.post("/cabvax/add-prereg", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
      });
  });
},
[UPDATE_PREREG](context, credentials) {
return new Promise(resolve => {
  instance.put("/cabvax/update-prereg", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
    .then(({ data }) => {
      resolve(data);
    })
    .catch(() => {
    });
});
},
  [GET_QUALIFIED_PATIENT](context, credentials) {
    return new Promise(resolve => {
      instance.post("/cabvax/get-qualified-patients?page=" + credentials.page, credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
        .then(({ data }) => {
          resolve(data);
        })
        .catch(() => {
        });
    });
  },
  [GET_PREREG_VERIFICATION](context, credentials) {
  return new Promise(resolve => {
    instance.post("/cabvax/get-unverified-patients?page=" + credentials.page, credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
      });
  });
},
[GET_BARANGAY]() {
return new Promise(resolve => {
  instance.get("/cabvax/get-barangay", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
    .then(({ data }) => {
      resolve(data);
    })
    .catch(() => {
    });
});
},
[GET_CATEGORIES]() {
  return new Promise(resolve => {
    instance.get("/cabvax/get-categories", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
      });
  });
  },
  [GET_ID_CATEGORIES]() {
    return new Promise(resolve => {
      instance.get("/cabvax/get-id-categories", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
        .then(({ data }) => {
          resolve(data);
        })
        .catch(() => {
        });
    });
    },
    [GET_EMPLOYEE_STATUS]() {
      return new Promise(resolve => {
        instance.get("/cabvax/get-employee-status", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
          });
      });
      },
      [GET_PROFESSIONS]() {
        return new Promise(resolve => {
          instance.get("/cabvax/get-professions", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
            .then(({ data }) => {
              resolve(data);
            })
            .catch(() => {
            });
        });
        },
        [GET_VACCINATORS]() {
          return new Promise(resolve => {
            instance.get("/cabvax/get-vaccinators", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
              .then(({ data }) => {
                resolve(data.data);
              })
              .catch(() => {
              });
          });
          },
          [GET_VACCINE_CATEGORIES]() {
            return new Promise(resolve => {
              instance.get("/cabvax/get-vaccine-categories", {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
                .then(({ data }) => {
                  resolve(data.data);
                })
                .catch(() => {
                });
            });
            },
        [VERIFY_PATIENT](context, credentials) {
        return new Promise(resolve => {
          instance.post("/cabvax/validate-patient", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
            .then(({ data }) => {
              resolve(data);
            })
            .catch(() => {
            });
        });
      },
      [MONITOR_PATIENT](context, credentials) {
      return new Promise(resolve => {
        instance.post("/cabvax/monitor-qualified-patient", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
          });
      });
    },
    [VERIFY_PASSWORD](context, credentials) {
      return new Promise(resolve => {
        instance.post("/cabvax/verify-password", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
          });
      });
    },
    [UPDATE_SUMMARY](context, credentials) {
      return new Promise(resolve => {
        instance.post("/cabvax/update-summary", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
          });
      });
    },
    [VOID_RECORD](context, credentials) {
      return new Promise(resolve => {
        instance.post("/cabvax/void-record", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
          });
      });
    },
    [GET_VASLINE_INFO](context, credentials) {
      return new Promise(resolve => {
        instance.post("/cabvax/get-vasline-info", credentials, {headers : {'Authorization' : 'Bearer ' + apiservice.getToken()}})
          .then(({ data }) => {
            resolve(data);
          })
          .catch(() => {
          });
      });
    },

};

const mutations = {
//  [SET_ERROR](state, error) {
//         state.errors = error;
//  },
//   [SET_AUTH](state, user) {
//     console.log(user);
//     state.isAuthenticated = true;
//     state.user = user.user_details;
//     state.errors = {};
//     window.localStorage.setItem("isAuthenticated", true);
//     window.localStorage.setItem("user", JSON.stringify(user));
//     window.localStorage.setItem("user_details", JSON.stringify(user.user_details));
//   },
//   [PURGE_AUTH](state) {
//     state.isAuthenticated = false;
//     window.localStorage.setItem("isAuthenticated", false);
//     state.user = {};
//     state.errors = {};
//     window.localStorage.clear()
//   }
};

export default {
  state,
  actions,
  mutations,
  getters
};
