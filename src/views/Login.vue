<template>
  <v-app id="inspire">
    <v-main>
      <v-row no-gutters class="fill-height">
        <v-col
          cols="12"
          sm="12"
          md="5"
          lg="5"
          xl="6"
          align-self="stretch"
          class="d-flex align-center bg-light-green"
        >
          <v-row no-gutters justify="center">
            <v-col cols="12" sm="8" md="11" lg="10" xl="6">
              <v-img
                lazy-src="/images/GOCABVax2.png"
                src="/images/GOCABVax2.png"
                max-height="380"
                max-width="350"
                contain
                class="mx-auto mb-10"
              ></v-img>
              <h6 class="font-weight-regular text-center text-body-2">
                © 2021
                <b class="font-weight-medium green--text text--darken-3"
                  >Enterprise Cabuyao</b
                >. All Rights Reserved. Powered by
                <b class="font-weight-medium green--text text--darken-3"
                  >WebAppliExTeam</b
                >
                <div class="mt-5">
                  <v-btn
                    depressed
                    fab
                    small
                    class="mx-2"
                    href=""
                    color="green lighten-4"
                  >
                    <v-icon color="green darken-3"> mdi-twitter </v-icon>
                  </v-btn>
                  <v-btn
                    depressed
                    fab
                    small
                    class="mx-2"
                    href=""
                    color="green lighten-4"
                  >
                    <v-icon color="green darken-3"> mdi-facebook </v-icon>
                  </v-btn>
                  <v-btn
                    depressed
                    fab
                    small
                    class="mx-2"
                    href=""
                    color="green lighten-4"
                  >
                    <v-icon color="green darken-3"> mdi-instagram </v-icon>
                  </v-btn>
                  <v-btn
                    depressed
                    fab
                    small
                    class="mx-2"
                    href=""
                    color="green lighten-4"
                  >
                    <v-icon color="green darken-3"> mdi-google </v-icon>
                  </v-btn>
                </div>
              </h6>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="5"
          lg="5"
          xl="6"
          align-self="stretch"
          class="d-flex align-center"
        >
          <v-row no-gutters justify="center">
            <v-col cols="12" sm="8" md="11" lg="10" xl="6">
              <v-card ref="form" elevation="0">
                <v-card-text>
                  <div class="mb-10">
                    <h4
                      class="
                        text-h4
                        font-weight-black
                        text-uppercase
                        grey--text
                        text--darken-3
                      "
                    >
                      Hi, Welcome Back!
                    </h4>
                    <h6
                      class="
                        text-subtitle-1
                        font-weight-normal
                        grey--text
                        text--darken-1
                      "
                    >
                      Please login to your account.
                    </h6>
                  </div>
                  <h6 class="mb-2">Email</h6>
                  <v-text-field
                    ref="email"
                    v-model="email"
                    :rules="emailRules"
                    :error-messages="errorMessageEmail"
                    placeholder="name@domain.com"
                    pre
                    color="green"
                    type="email"
                    outlined
                    required
                  >
                    <!-- <template v-slot:prepend-inner>
                <v-icon color="grey" small >mdi-email</v-icon>
              </template> -->
                  </v-text-field>
                  <h6 class="mb-2 mt-5">Password</h6>
                  <v-text-field
                    ref="password"
                    v-model="password"
                    :append-icon="isPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :error-messages="errorMessagePassword"
                    :type="isPassword ? 'text' : 'password'"
                    name="input-10-1"
                    color="green"
                    outlined
                    placeholder="At least 6 characters"
                    @click:append="isPassword = !isPassword"
                  ></v-text-field>
                </v-card-text>
                <div v-if="errors" style="color: red;">
                  {{ errors.message }}
                </div>
                <v-card-actions>
                  <v-btn
                    v-if="!isLoading"
                    block
                    depressed
                    x-large
                    color="green"
                    dark
                    @click="login"
                  >
                    Login
                  </v-btn>
                  <v-btn v-else block depressed x-large color="green" dark>
                    <v-progress-circular
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { LOGIN, LOGOUT } from "../store/auth";

export default {
  name: "Login",
  data() {
    return {
      isPassword: false,
      password: "",
      email: "",
      errorMessageEmail: null,
      errorMessagePassword: null,
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      rules: {
        required: (value) => !!value || "Required.",
        // min: (v) => (v && v.length >= 8) || "Min 6 characters",
      },
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      errors: (state) => state.auth.errors,
    }),
  },
  methods: {
    validate() {
      let isValid = true;
      if (!this.$refs.email.validate()) {
        this.errorMessageEmail = "Please provide valid email";
        isValid = false;
      }
      if (!this.$refs.password.validate()) {
        this.errorMessagePassword = "The password is require";
        isValid = false;
      }

      return isValid;
    },
    login() {
      if (this.validate()) {
        this.isLoading = true;
        const username = this.email;
        const password = this.password;

        this.$store.dispatch(LOGOUT);
        this.$store
          .dispatch(LOGIN, { username, password })
          // go to which page after successfully login
          .then((data) => {
            if (data.status == 200) {
              this.isLoading = false;
              var now = new Date().getTime();
              localStorage.setItem("setupTime", now);
              this.$router.push({ name: "dashboard" });
            } else {
              this.isLoading = false;
            }
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
    },
  },
};
</script>

<style>
.back {
  /* background: linear-gradient(rgba(7, 61, 7, 0.8), rgba(7, 61, 7, 0.8)),
    url(/vectors/login.png) no-repeat center right fixed; */
  /* background: linear-gradient(rgba(7, 61, 7, 0.8), rgba(7, 61, 7, 0.8)),
    url(/images/background.jpg) no-repeat center right fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-color: #388E3C;
  display: flex;
  flex-wrap: wrap;
  height: 100%; */
}

#inspire {
  background: none;
}

.bg-green-lighten-4 {
  background-color: #c8e6c9;
}

.bg-light-blue {
  background-color: #03a9f4;
}

.bg-light-green {
  /* background-color: #8BC34A; */
  background-color: #e8f5e9;
}

.bg-white {
  background-color: #fff;
}
</style>
