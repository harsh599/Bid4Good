<template>
  <div class="main-section w-50 mx-auto m-2 brd">
    <loader v-if="isLoading"></loader>
    <template v-else>
      <h3 class="text-center mb-5">Blind Auction</h3>
      <Carousel>
        <template v-if="sellItemDetail.imageDetails.length > 0">
          <Slide
            v-for="(item, index) in sellItemDetail.imageDetails"
            :key="index"
          >
            <img
              :src="item.imgUrl"
              class="carousel__item item_size"
              onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
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
      <div class="details">
        <div class="row p-3">
          <div class="col-4 p-2 font-weight-bold">Name:</div>
          <div class="col-8 p-2">{{ sellItemDetail.itemName }}</div>
          <div class="w-100"></div>
          <div class="col-4 p-2 font-weight-bold">Description:</div>
          <div class="col-8 p-2">{{ sellItemDetail.itemDes }}</div>
          <div class="col-4 p-2 font-weight-bold">Date Posted:</div>
          <div class="col-8 p-2">{{ sellItemDetail.createdAt }}</div>
          <div class="col-4 p-2 font-weight-bold">Time Posted:</div>
          <div class="col-8 p-2">{{ sellItemDetail.createdTime }}</div>
          <div class="col-4 p-2 font-weight-bold">Start Price:</div>
          <div class="col-8 p-2 text-wrap">
            {{
              sellItemDetail.startPrice > 0
                ? "$" + sellItemDetail.startPrice
                : "N/A"
            }}
          </div>
          <div class="col-4 p-2 font-weight-bold" v-if="!isBidAlreadyMade">
            Make Bid:
          </div>
          <div class="col-8 p-2" v-if="!isBidAlreadyMade">
            <FormKit
              type="text"
              :ignore="false"
              v-model="sellItemDetail.bidAmount"
              :disabled="isBidAlreadyMade"
              name="Bid Amount"
              pattern="\d+"
              validation="number"
            />
          </div>
        </div>
        <p class="text-center" v-if="isBidAlreadyMade">
          Bid has been made. All the best!
        </p>
        <div v-else-if="!isBuyer">
          <div class="text-center">Seller Cannot place a bid</div>
        </div>
        <div v-else>
          <div class="text-center">
            <button
              class="btn btn-danger"
              @click="makePayment"
              :hidden="isBidAlreadyMade"
            >
              Submit Bid
            </button>
          </div>
        </div>
      </div>
    </template>
    <div class="timer-right pos" v-if="globalTimer > 0">
      <Timer :timeLeft="globalTimer" @time="updateGlobalTime"></Timer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import auctionService from "../../services/auctionService";
import { useRoute, type LocationQueryValue } from "vue-router";
import type { IGetAuctionItemDetails } from "../../interfaces/auction";
import { Loader } from "../component";
import { useNotification } from "@kyvg/vue3-notification";
import { getDate, getTime } from "../../utility";
import { Timer } from "../component";

const { notify } = useNotification();
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
  bidAmount: 0,
  createdTime: "",
});
const isBidAlreadyMade = ref<boolean>(false);
const itemId = ref<any>("");
const auctionId = ref<any>("");
const details: any = localStorage.getItem("userDetails");
const { userId } = JSON.parse(details);
let { isBuyer } = JSON.parse(details);
const globalTimer = ref<number>(0);

const bidCalculatedEndTime = ref<Date | string | number>("");
const bidCalculatedStartTime = ref<Date | string | number>(getDate(new Date()));

onMounted(async () => {
  itemId.value = route.query.itemId;
  auctionId.value = route.query.auctionId;
  try {
    isLoading.value = true;
    const requestPayload = {
      itemId: itemId.value,
      auctionId: auctionId.value,
      auctionType: "blind",
      userId,
    };
    const response = await auctionService.getNewItemDetails(requestPayload);
    sellItemDetail = response.data.item;
    isBidAlreadyMade.value = response.data.userCount
      ? response.data.userCount > 0
      : false;
    let tempCreatedAt = response.data.item.createdAt;
    sellItemDetail.createdAt = getDate(response.data.item.createdAt);
    sellItemDetail.createdTime = getTime(tempCreatedAt);
    bidCalculatedStartTime.value =
      getDate(response.data.item.auction.startTime) +
      " " +
      getTime(response.data.item.auction.startTime);
    bidCalculatedEndTime.value =
      getDate(response.data.item.auction.endTime) +
      " " +
      getTime(response.data.item.auction.endTime);
    calculateTimer();
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
});

const calculateTimer = () => {
  const dateObj = new Date(bidCalculatedEndTime.value);
  const timeRemaining = dateObj.getTime() - Date.now();
  if (timeRemaining < 0) {
    return;
  }
  const timeInSeconds = Math.floor(timeRemaining / 1000);
  globalTimer.value = timeInSeconds;
};

const updateGlobalTime = (time: any) => {
  globalTimer.value = time;
};

const makePayment = async () => {
  try {
    if (sellItemDetail.bidAmount == null) {
      notify({
        title: "Failure!",
        text: "Bid should not be empty!",
        type: "danger",
      });
    } else if (!/^\d+$/.test(sellItemDetail?.bidAmount.toString())) {
      notify({
        title: "Failure!",
        text: "Bid should be a number!",
        type: "danger",
      });
    } else {
      if (
        sellItemDetail.bidAmount == null ||
        sellItemDetail.bidAmount < sellItemDetail.startPrice
      ) {
        notify({
          title: "Failure!",
          text: "Bid should be more than start price!",
          type: "danger",
        });
      } else {
        isBidAlreadyMade.value = true;
        const requestPayload = {
          itemId: itemId.value,
          bidAmount: sellItemDetail.bidAmount,
          auctionId: auctionId.value,
          userId: userId,
        };
        await auctionService.makeBlindBid(requestPayload);
        notify({
          title: "Successfull!",
          text: "Your Bid has been placed Successfully!",
          type: "success",
        });
      }
    }
  } catch (e) {
    console.log("Error occured in placing a bid");
    notify({
      title: "Failure!",
      text: "Opps Something went wrong!",
      type: "danger",
    });
  }
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

button {
  padding: 10px 20px;
  font-size: 1.2rem;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

button:hover {
  background-color: #ff4c4c;
  color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

h3 {
  color: #000000;
}

.brd {
  border: 2px solid #007bff;
}

.timer-right {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
