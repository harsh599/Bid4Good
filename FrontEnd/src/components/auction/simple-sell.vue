<template>
  <div class="main-section w-50 mx-auto m-2 brd">
    <loader v-if="isLoading"></loader>
    <template v-else>
      <h3 class="text-center mb-5">Simple Sell</h3>
      <Carousel>
        <template v-if="sellItemDetail.imageDetails.length > 0">
          <Slide
            v-for="(item, index) in sellItemDetail.imageDetails"
            :key="index"
          >
            <img
              :src="item.imgUrl"
              onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
              class="carousel__item item_size"
              alt="Image"
            />
          </Slide>
        </template>
        <template v-else>
          <Slide v-for="slide in 5" :key="slide">
            <div class="carousel__item">
              {{ slide }}
            </div>
          </Slide>
        </template>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

      <div class="row p-3 mt-5">
        <div class="col-4 p-2 font-weight-bold">Name:</div>
        <div class="col-8 p-2">{{ sellItemDetail.itemName }}</div>
        <div class="col-4 p-2 font-weight-bold">Price:</div>
        <div class="col-8 p-2">
          {{
            sellItemDetail.startPrice > 0
              ? `$` + sellItemDetail.startPrice 
              : "N/A"
          }}
        </div>
        <div class="w-100"></div>
        <div class="col-4 p-2 font-weight-bold">Description:</div>
        <div class="col-8 p-2 text-wrap">{{ sellItemDetail.itemDes }}</div>
      </div>
      <div v-if="!isBuyer" class="text-center mt-5">
        <button>Sellers cannot buy the items</button>
      </div>
      <div v-else-if="!sellItemDetail.isSold" class="text-center mt-5">
        <button class="btn btn-danger payButton" @click="makePayment">
          Pay
        </button>
      </div>
      <div v-if="isBuyer">
        <button
          :class="isWishlisted ? 'wishlisted' : 'wishlist-svg'"
          @click="wishlist"
        ></button>
      </div>
      <div v-else></div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import router from "../../router";
import { onMounted, ref, reactive } from "vue";
import auctionService from "../../services/auctionService";
import { useRoute } from "vue-router";
import type { IGetAuctionItemDetails } from "../../interfaces/auction";
import { Loader } from "../component";

const route = useRoute();
const isLoading = ref<boolean>(false);
let sellItemDetail = reactive<IGetAuctionItemDetails>({
  imageDetails: [],
  createdAt: "",
  isSold: false,
  itemDes: "",
  itemId: 0,
  itemName: "",
  startPrice: 0,
  updatedAt: "",
  user_id: 0,
  bidAmount: null,
});
const details: any = localStorage.getItem("userDetails");
const { userId } = JSON.parse(details);
const item_id: any = route.query.itemId;
let { isBuyer } = JSON.parse(details);

const isWishlisted = ref<boolean>(false);
onMounted(async () => {
  const { itemId, auctionId, auctionType } = route.query;
  const isWishlistedInDb = await auctionService.getWishlist(userId);

  try {
    for (let i = 0; i < isWishlistedInDb.data.length; i++) {
      if (isWishlistedInDb.data[i].itemId == item_id) {
        isWishlisted.value = true;
        break;
      }
    }
    isLoading.value = true;
    const requestPayload = {
      itemId,
      auctionId,
      auctionType,
      userId,
    };
    const response = await auctionService.getNewItemDetails(requestPayload);
    sellItemDetail = response.data.item;
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
});

const wishlist = async () => {
  if (isWishlisted.value) {
    await auctionService.deleteWishlist(item_id, userId);
  } else {
    await auctionService.postWishlist(item_id, userId);
  }
  isWishlisted.value = !isWishlisted.value;
};

const makePayment = () => {
  router.push({
    path: "/add-card",
    query: {
      sellerId: sellItemDetail.user_id + "",
      itemId: sellItemDetail.itemId + "",
      buyerId: userId,
    },
  });
};
</script>
<style scoped>
.main-section {
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.carousel__item {
  height: 300px;
  width: 100%;
  object-fit: cover;
  cursor: pointer;
}

.font-weight-bold {
  font-weight: bold;
}

.wishlist-svg,
.wishlisted:visited {
  background: url(../../assets/heart-regular.svg) no-repeat top left;
  background-size: contain;
  cursor: pointer;
  display: inline-block;
  height: 52px;
  width: 40px;
}
.wishlisted,
.wishlist-svg:visited {
  background: url(../../assets/heart-solid.svg) no-repeat top left;
  background-size: contain;
  cursor: pointer;
  display: inline-block;
  height: 52px;
  width: 40px;
}

.payButton {
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.payButton:hover {
  background-color: #ff4c4c;
  color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

h3 {
  color: #000000;
}

.brd{
  border: 2px solid #007bff;
}
</style>
