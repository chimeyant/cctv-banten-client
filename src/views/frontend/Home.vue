<template>
  <div>
    <banner-component />
  </div>
</template  >

<script>
import BannerComponent from "./components/BannerComponent.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "home",
  components: {
    BannerComponent,
  },
  data: () => ({}),
  mounted() {
    this.setPage({
      crud: false,
      name: "home",
    });
  },
  computed: {
    ...mapState(["device", "theme", "info", "http", "snackbar", "auth"]),
  },
  methods: {
    ...mapActions(["setPage"]),
  },
};
</script>

<style>
</style>