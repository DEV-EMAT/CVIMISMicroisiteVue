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
//import { LOGOUT } from "../store/auth";

export default {
  name: "Home",
  mounted() {
    // check if current user is authenticated
    // if (!this.isAuthenticated) {
    //   this.$router.push({ name: "login" });
    // }
    // var hours = 24; // Reset when storage is more than 24hours
    // var now = new Date().getTime();
    // var setupTime = localStorage.getItem("setupTime");
    // console.log(setupTime);
    // if (setupTime == null) {
    //   // localStorage.setItem("setupTime", now);
    //   this.$router.push({ name: "login" });
    // } else {
    //   if (now - setupTime > hours * 60 * 60 * 1000) {
    //     localStorage.clear();
    //     this.$store.dispatch(LOGOUT).then(() => {
    //       this.$router.push({ name: "login" });
    //       //             this.$swal(
    //       //   "Logout",
    //       //   "You have been successfully logged out.",
    //       //   "success"
    //       // );
    //     });
    //   } else {
    //     if (!this.isAuthenticated) {
    //       this.$router.push({ name: "login" });
    //     }
    //   }
    // }
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
