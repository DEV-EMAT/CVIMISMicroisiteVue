<template>
  <v-app id="inspire">
    <v-app-bar color="primary" app dark elevate-on-scroll>
      <v-img
        src="https://cvimsmicrosite.s3.ap-southeast-1.amazonaws.com/images/GOCABVax.png"
        alt="John"
        max-height="55"
        max-width="55"
        contain
      ></v-img>
      <v-toolbar-title>
        <v-list-item two-line>
          <!-- <v-list-item-avatar>
            <img src="/images/go-cabvax-1.png" alt="John" />
          </v-list-item-avatar> -->
          <v-list-item-content>
            <v-list-item-title class="text-h5"
              ><b>CVIMSMicrosite</b></v-list-item-title
            >
            <v-list-item-subtitle>
              Cabuyao Vaccine Information Management System
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="password" persistent max-width="600px">
        <v-card>
          <v-card-title class="text-h5"> Change Password </v-card-title>
          <v-card-subtitle>
            <small>*indicates required field</small>
          </v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      ref="currentpassword"
                      v-model="currentPassword"
                      :rules="[rules.required, rules.min]"
                      label="Current Password*"
                      :append-icon="showcurrent ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showcurrent = !showcurrent"
                      :type="showcurrent ? 'text' : 'password'"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      ref="newpassword"
                      v-model="newPassword"
                      :rules="[rules.required, rules.min]"
                      label="New Password*"
                      :append-icon="shownew ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="shownew = !shownew"
                      :type="shownew ? 'text' : 'password'"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      ref="confirmpassword"
                      v-model="confirmPassword"
                      :rules="[
                        rules.required,
                        rules.min,
                        (value) =>
                          value == newPassword ||
                          'The password confirmation does not match.',
                      ]"
                      label="Confirm Password*"
                      :append-icon="showconfirm ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showconfirm = !showconfirm"
                      :type="showconfirm ? 'text' : 'password'"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="password = false"> Close </v-btn>
            <v-btn color="primary" text @click="changePassword"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-menu open-on-hover offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="text-capitalize" text v-bind="attrs" v-on="on">
            {{ user.first_name + " " + user.last_name }}
            <v-icon class="ml-3" right size="23.5">mdi-cog-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link @click="password = true">
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-tabs
        slot="extension"
        v-model="model"
        centered
        color="white"
        show-arrows
        slider-color="white"
      >
        <v-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.text }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-row no-gutters align="start" justify="center">
          <v-col cols="12" sm="12" md="12" lg="12" xl="10">
            <v-tabs-items v-model="model">
              <v-tab-item v-for="(tab, index) in tabs" :key="index">
                <component
                  :overlay="overlay"
                  v-bind:is="tab.component"
                  class="tab"
                  @changeValue="changeValue"
                ></component>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer color="white" bottom padless>
      <v-col class="text-center" cols="12">
        <div class="font-weight-normal mb-0 text-body-2">
          © {{ new Date().getFullYear() }}
          <span class="font-weight-medium">Enterprise Cabuyao</span>. All Rights
          Reserved. Powered by
          <span class="font-weight-medium">WebAppliExTeam</span>
        </div>
      </v-col>
    </v-footer>

    <v-snackbar v-model="snackbar" top right color="blue-grey">
      Printing of Vaccination Card for Booster Shot is now available!.

      <!-- <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template> -->
    </v-snackbar>
    <!-- <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
  </v-app>
</template>


<script>
import PatientMonitoring from "./PatientMonitoring.vue";
import PreRegisterVerification from "./PreRegisterVerification.vue";
import VaccinationCard from "./VaccinationCard.vue";

import { LOGOUT, CHANGE_PASSWORD } from "../store/auth";

export default {
  name: "Dashboard",
  components: {
    PatientMonitoring,
    PreRegisterVerification,
    VaccinationCard,
  },
  data: () => ({
    model: "tab-2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    tabs: [
      {
        text: "Patient Monitoring",
        component: "PatientMonitoring",
      },
      {
        text: "Vaccination Card",
        component: "VaccinationCard",
      },
      {
        text: "Pre-reg Verification",
        component: "PreRegisterVerification",
      },
    ],
    overlay: true,
    user: null,
    password: false,
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
    rules: {
      required: (value) => !!value || "Required.",
      min: (value) => value.length >= 6 || "Min 6 characters",
      // min: (v) => (v && v.length >= 8) || "Min 6 characters",
    },
    valid: false,
    shownew: false,
    showcurrent: false,
    showconfirm: false,
    snackbar: false
  }),
  methods: {
    logout() {
      this.$swal({
        title: "Logout",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Log Out",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch(LOGOUT).then(() => {
            this.$router.push({ name: "login" });
            //             this.$swal(
            //   "Logout",
            //   "You have been successfully logged out.",
            //   "success"
            // );
          });
        }
      });
    },
    changeValue(value) {
      this.overlay = value;
    },
    validate() {
      return this.$refs.form.validate();
    },
    changePassword() {
      if (this.validate()) {
        // this.isDisabled = true;
        const old_password = this.currentPassword;
        const password = this.newPassword;
        const confirm_password = this.confirmPassword;

        this.$swal({
          title: "Confirm",
          text: "Are you sure you want to save this?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store
              .dispatch(CHANGE_PASSWORD, {
                old_password,
                password,
                confirm_password,
              })
              // go to which page after successfully login
              .then((data) => {
                if (data.status == 200) {
                  this.password = false;
                  this.clearInput();
                  this.$store.dispatch(LOGOUT).then(() => {
                    this.$router.push({ name: "login" });
                  });
                  this.$swal(
                    "Change Password",
                    "ChangePassword successfully.",
                    "success"
                  );
                } else if (data.status == 404) {
                  this.password = false;
                  this.clearInput();
                  this.$swal(
                    "Change Password",
                    "Incorrect Password",
                    "warning"
                  );
                } else {
                  this.password = false;
                  this.clearInput();
                  this.$swal(
                    "Change Password",
                    "Something went wrong",
                    "error"
                  );
                }
              })
              .catch(() => {
                this.password = false;
                this.clearInput();
              });
          }
        });
      }
    },
    clearInput() {
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    },
  },
  mounted() {
    this.user = JSON.parse(window.localStorage.getItem("user_details"));
    this.snackbar = true;
  },
};
</script>

<style scoped>
label.v-label.theme--light {
  margin-bottom: 0 !important;
}
</style>
