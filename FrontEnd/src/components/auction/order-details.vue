<template>
  <section>
    <div
      class="card bg-white rounded-lg shadow-sm"
      style="border-left: 4px solid #007bff; padding-left: 10px"
    >
      <div class="card-body">
        <h1>Order Details</h1>
      </div>
    </div>
    <v-table class="fullWidth fullHeight">
      <thead>
        <tr>
          <th id="order_name" class="text-left">Name</th>
          <th id="order_description" class="text-left">Description</th>
          <th id="order_price" class="text-left">Price</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="orderDetails.length > 0">
          <tr v-for="item in orderDetails" :key="item.cityName">
            <td>{{ item.itemName }}</td>
            <td>{{ item.itemDes }}</td>
            <td>{{ item.startPrice }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="4">
            <div class="container">
              <div class="card border shadow">
                <div class="card-body">
                  <h1 class="card-title text-center mb-4">
                    No Order's at the Moment
                  </h1>
                  <p class="card-text text-center">
                    We're sorry, but there are currently No Order's present. Please
                    check back later for updates.
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </section>
</template>
<script lang="ts" setup>
import AuthService from "../../services/AuthService";
import { onMounted, ref } from "vue";

const orderDetails = ref<any>([]);
const details: any = localStorage.getItem("userDetails");
const { userId } = JSON.parse(details);

onMounted(async () => {
  try {
    const response = await AuthService.getBuyerOrderDetails(userId);
    orderDetails.value = response.data;
  } catch (e) {
    console.error("Error in fetching states", e);
  }
});
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
