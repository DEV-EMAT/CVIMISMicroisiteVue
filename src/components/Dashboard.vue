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

      <v-btn icon @click="logout">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>

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
    <!-- <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
  </v-app>
</template>


<script>
import PatientMonitoring from "./PatientMonitoring.vue";
import PreRegisterVerification from "./PreRegisterVerification.vue";
import VaccinationCard from "./VaccinationCard.vue";

import { LOGOUT } from "../store/auth";

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
    overlay: true
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
    changeValue(value){
      this.overlay = value;
    }
  },
};
</script>

<style scoped>
label.v-label.theme--light {
  margin-bottom: 0 !important;
}
</style>
