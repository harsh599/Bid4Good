<template>
  <div class="fullWidth fullHeight">
    <h3 class="text-center msg">{{ message }}</h3>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    default: "No Content Available.",
  },
});
console.log(props.message);
</script>
<style>
.fullWidth {
  width: 100%;
}

.fullHeight {
  min-height: 50vh;
}

.msg {
  align-items: center;
}
</style>
