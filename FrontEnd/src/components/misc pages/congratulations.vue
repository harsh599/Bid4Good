<template>
  <section>
    <div class="congrats">
      <img src="../../assets/congrats_crackers.gif" alt="congrats gif"/>
    </div>
    <h1 class="congrats">Congratulations!</h1>

    <br />
    <br />
    <div class="center">
      <h3>Redirecting to HomePage in: {{ count }} seconds</h3>
    </div>
  </section>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ref, onMounted } from "vue";

const count = ref<number>(5);

onMounted(() => {
  const interval = setInterval(() => {
    count.value--;
    if (count.value == 0) {
      clearInterval(interval);
      router.push("/home");
      count.value = 5;
    }
  }, 1000);
});
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 25px;
  margin-right: 20px;
  padding-right: 20px;
}

.congrats {
  color: salmon;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 50px;
}

.parent_sect {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
