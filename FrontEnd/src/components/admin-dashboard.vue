<template>
  <section class="dnone">
    <div
      class="card bg-white rounded-lg shadow-sm w-100"
      style="border-left: 4px solid #007bff"
    >
      <div class="card-body d-flex justify-content-between align-items-center">
        <h1>Admin Dashboard</h1>
        <button class="issueListButton" @click="issueList"></button>
      </div>
    </div>
    <loader v-if="isLoading"></loader>
    <table class="table" v-else aria-describedby="table">
      <thead class="thead-light">
        <tr>
          <th scope="col" class="text-center">Name</th>
          <th scope="col" class="text-center">Address</th>
          <th scope="col" class="text-center">Email</th>
          <th scope="col" class="text-center">Phone</th>
          <th scope="col" class="text-center">Identity Doc</th>
          <th scope="col" class="text-center">Verified</th>
          <th scope="col" class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="verifiedSellers.length > 0"
          v-for="item in verifiedSellers"
          :key="item.cityName"
        >
          <td class="text-center">{{ item.firstName }} {{ item.lastName }}</td>
          <td class="text-center">{{ item.address }}</td>
          <td class="text-center">{{ item.loginDetail?.email }}</td>
          <td class="text-center">{{ item.phone }}</td>
          <td class="text-center">
            <a :href="item.govtIdUrl" target="_blank">
              <font-awesome-icon icon="image" />
            </a>
          </td>
          <td class="text-center">
            <span class="p-2" v-if="item.isVerified">
              <font-awesome-icon icon="check" class="tick-mark" />
            </span>
            <span class="p-2" v-else>
              <font-awesome-icon icon="xmark" class="cross-mark" />
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-primary" @click="approve(item)">
              Approve
            </button>
          </td>
        </tr>
        <tr v-else>
          <td colspan="6">
            <div class="container">
              <div class="card border shadow">
                <div class="card-body">
                  <h1 class="card-title text-center mb-4">
                    No Seller's for approval at the Moment
                  </h1>
                  <p class="card-text text-center">
                    Please check back later for updates.
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script lang="ts" setup>
import type {
  IApproveOrDeclineReqPayload,
  IVerfiedSeller,
} from "../interfaces/admin";
import AuthService from "../services/AuthService";
import { onMounted, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import router from "@/router";
import { Loader } from "../components/component";

const verifiedSellers = ref<IVerfiedSeller[]>([]);
const { notify } = useNotification();
const isLoading = ref<boolean>(false);

const getRegisteredSellers = async () => {
  try {
    verifiedSellers.value = [];
    isLoading.value = true;
    const response = await AuthService.verifiedSellers();
    verifiedSellers.value = response.data.map((seller: any) => {
      return {
        ...seller,
        editInProgress: false,
        ...seller.loginDetail,
      };
    });
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Fetching Registered Seller Operations Failed!",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  getRegisteredSellers();
});

const issueList = () => {
  router.push("/admin-issue-details");
};
const approveOrDecline = async (payload: IApproveOrDeclineReqPayload) => {
  try {
    await AuthService.approveOrDeclineSeller(payload);
    notify({
      title: "Successfull!",
      text: "Operation Success full!",
      type: "success",
    });
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Operation Failed!",
      type: "error",
    });
    console.error("Error in verifying seller");
  }
};

const approve = async (seller: IVerfiedSeller) => {
  const reqPayload: IApproveOrDeclineReqPayload = {
    userId: seller.userId,
    isVerified: true,
  };
  await approveOrDecline(reqPayload);
  await getRegisteredSellers();
};

</script>
<style scoped>
.issueListButton {
  background: url(../../src/assets/triangle-exclamation-solid.svg) no-repeat top
    left;
  background-size: contain;
  cursor: pointer;
  display: inline-block;
  height: 52px;
  width: 40px;
}

section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-right {
  text-align: right;
}
.cross-mark {
  color: red;
}

.tick-mark {
  color: green;
}
.dnone {
  display: block;
}
</style>
