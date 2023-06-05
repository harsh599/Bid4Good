<template>
  <section>
    <div
      class="card bg-white rounded-lg shadow-sm"
      style="border-left: 4px solid #007bff"
    >
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h1>Reported Issues</h1>
        </div>
        <button class="dashboardButton" @click="dashboard"></button>
      </div>
    </div>
    <loader v-if="isLoading"></loader>
    <table class="table" v-else aria-describedby="table">
      <thead>
        <tr>
          <th scope="col" class="text-center">Issue ID</th>
          <th scope="col" class="text-center">Issue Type</th>
          <th scope="col" class="text-center">Issue Concern</th>
          <th scope="col" class="text-center">Issue Status</th>
          <th scope="col" class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="issueDetails.length > 0">
          <tr v-for="item in issueDetails" :key="item.ticketId">
            <td class="text-center">{{ item.ticketId }}</td>
            <td class="text-center">{{ item.issueType }}</td>
            <td class="text-center">{{ item.description }}</td>
            <td class="text-center">
              {{ item.isResolved ? "Resolved" : "Active" }}
            </td>
            <td class="text-center">
              <button class="ml-2 btn btn-outline-none" @click="decline(item)">
                <font-awesome-icon
                  icon="xmark"
                  class="cross-mark"
                  v-if="item.isResolved"
                  style="color: red"
                />
                <font-awesome-icon
                  icon="check"
                  class="check-mark"
                  v-else
                  style="color: green"
                />
              </button>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="5">
            <div class="container">
              <div class="card border shadow">
                <div class="card-body">
                  <h1 class="card-title text-center mb-4">
                    No Reported Issues's at the Moment
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
import { onMounted, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import auctionService from "../services/auctionService";
import router from "@/router";
import { Loader } from "../components/component";

const issueDetails = ref<any>([]);
const { notify } = useNotification();

let buttonDisable = ref<string>();
const isLoading = ref<boolean>(false);

onMounted(async () => {
  getIssueList();
});

const getIssueList = async () => {
  try {
    issueDetails.value = [];
    isLoading.value = true;
    const response = await auctionService.getAllReports();
    issueDetails.value = response.data;
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Fetching Issue List Operations Failed!",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const dashboard = () => {
  router.push("/admin-dashboard");
};

const decline = async (item: any) => {
  item.isResolved = true;
  await auctionService.updateReport(item.ticketId, item.isResolved);
  buttonDisable.value = "true";
  await getIssueList();
};
</script>
<style scoped>
.parent_sect {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.dashboardButton {
  background: url(../../src/assets/layer-group-solid.svg) no-repeat top left;
  background-size: contain;
  cursor: pointer;
  display: inline-block;
  height: 52px;
  width: 40px;
}
</style>
