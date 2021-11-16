<template>
  <div v-if="isAuthenticated">
    <!-- <div v-if="getCurrentBranch">
      <router-view></router-view>
    </div>
    <div v-else>
      <p>Please Select Branch</p>
    </div> -->
    <router-view></router-view>
  </div>
  <!-- <dashboard /> -->
</template>

<script>
// import HelloWorld from "../components/HelloWorld";
// import Dashboard from "../components/Dashboard";
import { mapGetters } from "vuex";

export default {
  name: "Home",
    mounted() {
    // check if current user is authenticated
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },

  // components: {
  //   // HelloWorld,
  //   Dashboard,
  // },
};
</script>
