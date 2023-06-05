<template>
  <notifications />
  <Navigation />
  <RouterView />
  <Footer class = "mt-3"> </Footer>
</template>

<script lang="ts" setup>
import Navigation from "../src/components/navigation/Navigation.vue";
import Footer from "../src/components/footer.vue";
</script>
