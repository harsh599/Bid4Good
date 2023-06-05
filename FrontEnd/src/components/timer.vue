<template>
  <div class="timer" v-if="timeLeft > 0">
    <div class="timer-value font" v-html="formattedTime"></div>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted } from "vue";
import { computed, onMounted, ref } from "vue";

const timerInterval = ref<number>(0);
const progress = ref<number>(0);
const emit = defineEmits(["time", "submit"]);

let props = defineProps({
  timeLeft: {
    type: Number,
    required: true,
    default: 100,
  },
});

const formattedTime = computed(() => {
  let seconds = props.timeLeft;
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let formattedString = `${days} <sup> days </sup>: ${pad(
    hours
  )} <sup> hours </sup>: ${pad(minutes)} <sup> min </sup>:  ${pad(
    seconds
  )} <sup> sec </sup>`;

  if (days <= 0) {
    formattedString = `${pad(hours)} <sup> hours </sup>: ${pad(
      minutes
    )} <sup> min </sup>:  ${pad(seconds)} <sup> sec </sup>`;
  }
  if (days <= 0 && hours <= 0) {
    formattedString = `${pad(minutes)} <sup> min </sup>:  ${pad(
      seconds
    )} <sup> sec </sup>`;
  }
  if (days <= 0 && hours <= 0 && minutes <= 0) {
    formattedString = `${pad(seconds)} <sup> sec </sup>`;
  }

  return formattedString;
});

const startTimer = () => {
  if (props.timeLeft > 0) {
    const propValue = ref<number>(props.timeLeft);
    timerInterval.value = setInterval(() => {
      propValue.value--;
      emit("time", propValue.value);
      progress.value = ((3600 - propValue.value) / 3600) * 100;
      progress.value *= -1;
      if (propValue.value == 0) {
        clearInterval(timerInterval.value);
        console.warn("Timer ended");
      }
    }, 1000);
  }
};

const pad = (value: number) => {
  return value < 10 ? `0${value}` : value;
};

onMounted(() => {
  startTimer();
});

onUnmounted(()=>{
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.font {
  font-size: 1.2rem !important;
}

.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.timer-value {
  font-size: 3rem;
}

.timer-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background-color: #ff5722;
  border-radius: 5px;
  transition: width 1s linear;
}
</style>
