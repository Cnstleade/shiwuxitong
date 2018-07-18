<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      filter: true
    };
  },
  methods: {
    moveSession(filter) {
      console.log(1);
      console.log(filter);
      if (filter) {
        console.log(123);
        this.filter = !filter;
        setTimeout(() => {
          console.log("++++++++++++++++");
          sessionStorage.removeItem("hsjr_username");
        }, 100);
      }
    },

  },

  mounted() {}
};
</script>

<style>
@import "../static/css/main.css";
</style>
