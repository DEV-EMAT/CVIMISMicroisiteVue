<template>
    <router-view></router-view>
</template>
<script>
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  name: "auth",
  computed: {
    ...mapGetters([
      "isAuthenticated",
    ]),
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    }else{
      this.$router.push({ name: "dashboard" });
    }
  }
};
</script>