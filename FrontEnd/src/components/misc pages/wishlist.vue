<template>
  <section>
    <div
      class="card bg-white rounded-lg shadow-sm"
      style="border-left: 4px solid #007bff; padding-left: 10px"
    >
      <div class="card-body">
        <h1>Wishlist</h1>
      </div>
    </div>
    <table class="table" aria-describedby="table">
      <thead class="thead-light">
        <tr>
          <th scope="col" class="text-center"></th>
          <th scope="col" class="text-center">Name</th>
          <th scope="col" class="text-center">Description</th>
          <th scope="col" class="text-center">Price</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="wishDetails.length > 0">
          <tr v-for="(item, index) in wishDetails" :key="index">
            <td class="text-center">
              <button
                class="wishlist-svg-selected btn-sm"
                @click="removeFromWishlist(item)"
              ></button>
            </td>
            <td class="text-center">{{ item.itemName }}</td>
            <td class="text-center">{{ item.itemDes }}</td>
            <td class="text-center">{{ item.startPrice }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="4">
              <div class="card shadow">
                <div class="card-body text-center">
                  <h1 class="card-title mb-4">
                    No Wishlisted Item's at the Moment
                  </h1>
                  <p class="card-text">
                    We're sorry, but there are currently no items.
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import auctionService from "../../services/auctionService";
import { onMounted, ref } from "vue";

const wishDetails = ref<any>([]);
const details: any = localStorage.getItem("userDetails");
const { userId } = JSON.parse(details);
onMounted(async () => {
  await loadWishlist();
});

async function loadWishlist() {
  try {
    const response = await auctionService.getWishlist(userId);
    wishDetails.value = response.data;
  } catch (e) {
    console.error("Error in fetching wishlist", e);
  }
}

async function removeFromWishlist(item: any) {
  await auctionService.deleteWishlist(item.itemId, userId);
  await loadWishlist();
}
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

.wishlist-svg {
  background: url(../../assets/heart-regular.svg) no-repeat top left;
  background-size: contain;
  cursor: pointer;
  display: inline-block;
  height: 52px;
  width: 40px;
}
.wishlist-svg-selected {
  background: url(../../assets/heart-solid.svg) no-repeat top left;
  background-size: contain;
  cursor: pointer;
  display: inline-block;
  height: 52px;
  width: 40px;
}
</style>
