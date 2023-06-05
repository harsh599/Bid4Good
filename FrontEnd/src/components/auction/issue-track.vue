<template>
  <section>
    <div
      class="card bg-white rounded-lg shadow-sm"
      style="border-left: 4px solid #007bff; padding-left: 10px"
    >
      <div class="card-body">
        <h1>Reported Issues</h1>
      </div>
    </div>
    <div>
      <div class="text-center">
        <v-table>
          <thead>
            <tr>
              <th id="issueID" class="text-center">Issue ID</th>
              <th id="issueType" class="text-center">Issue Type</th>
              <th id="issueDescription" class="text-center">Description</th>
              <th id="issueStatus" class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="issueList.length > 0">
              <tr v-for="(item, index) in issueList" :key="index">
                <td class="text-center">
                  {{ item.issue }}
                </td>
                <td class="text-left">
                  {{ item.issueType.toUpperCase() }}
                </td>
                <td class="text-left">
                  {{ item.concern }}
                </td>
                <td class="text-center">
                  <FormKit
                    class="text-center"
                    type="text"
                    placeholder="Status"
                    :disabled="true"
                    :options="[
                      { label: 'active', value: 'active' },
                      { label: 'resolved', value: 'resolved' },
                    ]"
                    v-model="item.status"
                  />
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="5">
                <div class="container">
                  <div class="card border shadow">
                    <div class="card-body">
                      <h1 class="card-title text-center mb-4">
                        No Issue's at the Moment
                      </h1>
                      <p class="card-text text-center">
                        We're sorry, but there are currently No Issue's
                        reported. Please check back later for updates.
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import auctionService from "../../services/auctionService";

const details: any = localStorage.getItem("userDetails");
const { userId } = JSON.parse(details);

const route = useRoute();

const issueList = ref<any>([]);

onMounted(async () => {
  const response = await auctionService.getReport(userId);
  issueList.value = response.data.map((item: any) => ({
    issue: item.ticketId,
    status: item.isResolved ? "resolved" : "active",
    concern: item.description,
    issueType: item.issueType,
  }));
});
</script>

<style scoped>
.side-bar > div {
  cursor: pointer;
  border: 1px solid;
}
.parent_sect {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.main {
  display: grid;
  grid-template-columns: 20% 80%;
}
</style>
