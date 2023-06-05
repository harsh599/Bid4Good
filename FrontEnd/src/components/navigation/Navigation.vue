<template>
  <nav class="navbar navbar-expand-lg row background mb-4 w-105">
    <div
      class="col-9 d-flex justify-content-between"
      @click="navigateBidForGood"
    >
      <div class="d-flex">
        <font-awesome-icon
          :icon="['fas', 'gavel']"
          class="img-size mr-1 mt-1 color"
        />
        <div class="nounderline">
          <h1 class="color">Bid4Good</h1>
        </div>
      </div>
    </div>
    <div class="col-3 d-flex justify-content-end">
      <button
        class="btn btn-outline-light m-2"
        @click="navigateTo('home')"
        v-if="!showLogOutIcon"
      >
        <font-awesome-icon icon="house" class="svg-inline--fa" />
      </button>
      <button
        class="btn btn-outline-light m-2"
        @click="navigateTo('postbid')"
        v-if="!showLogOutIcon && isUserSeller"
        v-bind:disabled="!isVerified"
      >
        <font-awesome-icon icon="gavel" class="svg-inline--fa" />
      </button>
      <button
        class="btn btn-outline-light m-2"
        @click="navigateTo('wishlist')"
        v-if="!showLogOutIcon && isUserBuyer"
      >
        <font-awesome-icon icon="heart" class="svg-inline--fa" />
      </button>
      <button
        class="btn btn-outline-light m-2"
        @click="navigateTo('admin')"
        v-if="isUserAdmin && !showLogOutIcon"
      >
        <font-awesome-icon icon="user-secret" class="svg-inline--fa" />
      </button>
      <button
        class="btn btn-outline-light m-2"
        @click="navigateTo('user')"
        v-if="!showLogOutIcon"
      >
        <font-awesome-icon icon="user-circle" class="svg-inline--fa" />
      </button>
      <button
        class="btn btn-outline-light m-2"
        @click="logout"
        v-if="!showLogOutIcon"
      >
        <font-awesome-icon icon="sign-out-alt" class="svg-inline--fa" />
      </button>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import router from "@/router";
import AuthService from "../../services/AuthService";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();
const store = useStore();
const userDetailsNew = ref(store.state.userDetails);

const navigateTo = (navigation: string) => {
  if (navigation == "wishlist") {
    router.push("/wishlist");
  } else if (navigation == "user") {
    router.push("/buyer");
  } else if (navigation == "home") {
    router.push("/home");
  } else if (navigation == "postbid") {
    router.push("/post-bid");
  } else if (navigation == "admin") {
    router.push("/admin-dashboard");
  }
};

const navigateBidForGood = () => {
  if (store.state.userDetails?.sessionId) {
    router.push("/home");
  } else {
    router.push("/");
  }
};

const showLogOutIcon = computed(
  () =>
    store.state.currentRoute != null &&
    (store.state.currentRoute.name == "Login" ||
      store.state.currentRoute.name == "User Registration")
);

const isUserAdmin = computed(() => store.state.userDetails?.isAdmin);
const isUserSeller = computed(() => store.state.userDetails?.isSeller);
const isUserBuyer = computed(() => store.state.userDetails?.isBuyer);
const isVerified = computed(() => store.state.userDetails?.isVerified);

store.watch(
  (state) => state.userDetails,
  (newValue) => {
    userDetailsNew.value = newValue;
  },
  { deep: true }
);

const logout = async () => {
  try {
    const sessionId = store.state.sessionId;
    await AuthService.logOut({ sessionId: sessionId });
    localStorage.clear();
    store.commit("setCurrentUserDetails", null);
    notify({
      title: "Successful!",
      text: "User Logged Out Successfully!",
      type: "success",
    });
    router.push("/");
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Opps Something went wrong! Please Try Again!",
      type: "error",
    });
  }
};
</script>
<style>
.background {
  background-color: #1c66de;
}

.home {
  background: url(../../assets/house-solid.svg) no-repeat top left;
  background-size: 75%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 35px;
  width: 35px;
}

.nounderline {
  text-decoration: none !important;
}

.img-size {
  width: 30px;
  height: 40px;
}

.color {
  color: #fff;
}
</style>
