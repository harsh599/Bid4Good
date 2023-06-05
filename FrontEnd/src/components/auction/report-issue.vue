<template>
  <section>
    <div
      class="card bg-white rounded-lg shadow-sm mb-2"
      style="border-left: 4px solid #007bff; padding-left: 10px"
    >
      <div class="card-body">
        <h1>User Details</h1>
      </div>
    </div>
  </section>
  <div class="d-flex justify-content-center">
    <div class="card mb-3 w-100 text-center mx-auto">
      <div
        class="card-body"
        style="border-left: 4px solid #007bff; padding-left: 10px"
      >
        <div class="mx-auto">
          <FormKit type="form" @submit="issueSubmit">
            <FormKit
              type="select"
              label="Issue"
              placeholder="Select the type of issue"
              :options="[
                { label: 'Return', value: 'return' },
                { label: 'Refund', value: 'refund' },
                { label: 'Cancellation', value: 'cancellation' },
              ]"
              v-model="issueDetails.issue"
              validation="required"
            >
            </FormKit>

            <FormKit
              type="select"
              label="Status"
              placeholder="Status"
              :disabled="true"
              :options="[
                { label: 'active', value: 'active' },
                { label: 'resolved', value: 'resolved' },
              ]"
              v-model="issueDetails.status"
            >
            </FormKit>

            <FormKit
              type="textarea"
              label="Concern"
              placeholder="Please explain your concern in detail..."
              v-model="issueDetails.concern"
              validation="required"
            ></FormKit>
          </FormKit>
        </div>
      </div>
    </div>
  </div>
  <br />
  <br />
  <br />
  <br />
</template>

<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css";
import { onMounted, reactive } from "vue";
import type { IGetIssueDetails } from "../../interfaces/report-issue";
import auctionService from "../../services/auctionService";
const details: any = localStorage.getItem("userDetails");
const { userId } = JSON.parse(details);

let issueDetails = reactive<IGetIssueDetails>({
  issue: "",
  status: "",
  concern: "",
});

onMounted(async () => {
  await auctionService.getReport(userId);
});

const issueSubmit = async () => {
  await auctionService.postReport(
    userId,
    issueDetails.issue,
    issueDetails.concern,
    ""
  );

  issueDetails.status = "active";

  setTimeout(() => {
    window.location.reload();
  }, 2000);
  console.log("reload");
};
</script>
<style scoped>
.side-bar > div {
  cursor: pointer;
  border: 1px solid;
}
.parent_sect {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.main {
  display: grid;
  grid-template-columns: 20% 80%;
}
</style>
