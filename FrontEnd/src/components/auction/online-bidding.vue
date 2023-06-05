<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="containers">
    <div class="main-section w-50 mx-auto m-2 my-hover brd">
      <loader v-if="isLoading"></loader>
      <div v-else>
        <h3 class="text-center mb-5">Live Auction</h3>
        <div class="w-100 m-1">
          <Carousel :autoplay="2000" :wrap-around="true">
            <template v-if="sellItemDetail.imageDetails.length > 0">
              <Slide
                v-for="(item, index) in sellItemDetail.imageDetails"
                :key="index"
              >
                <img
                  :src="item.imgUrl"
                  class="carousel__item item_size"
                  onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
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
        </div>
        <div class="details">
          <div class="row p-3">
            <div class="col-4 p-2 font-weight-bold">Description:</div>
            <div class="col-8 p-2">{{ description }}</div>

            <div class="col-4 p-2 font-weight-bold">Starting At Time:</div>
            <div class="col-8 p-2">
              {{
                startTime
                  ? dateParse(startTime) + " " + timeParse(startTime)
                  : "N/A"
              }}
            </div>

            <div class="col-4 p-2 font-weight-bold">Closing At Time:</div>
            <div class="col-8 p-2">
              {{
                endTime ? dateParse(endTime) + " " + timeParse(endTime) : "N/A"
              }}
            </div>

            <div class="col-4 p-2 font-weight-bold">Start Price:</div>
            <div class="col-8 p-2">$ {{ startVal }}</div>

            <div class="col-4 p-2 font-weight-bold">Highest Bid Price:</div>
            <div class="col-8 p-2">$ {{ highestBid }}</div>

            <div class="col-4 p-2 font-weight-bold">Your Bid:</div>
            <div class="col-8 p-2">$ {{ myBid }}</div>

            <div class="col-4 p-2 font-weight-bold">Make Bid:</div>
            <div class="col-8 p-2">
              <FormKit type="text" v-model="bidAmount" />
            </div>
          </div>

          <div class="text-center">
            <button
              class="btn btn-danger"
              @click="sendMessage()"
              v-if="isBuyer"
              v-bind:disabled="!enableSubmitButton"
            >
              Submit
            </button>
            <div v-if="!showBidActivenessMessage">
              Bid isn't active at the moment
            </div>
            <div v-if="isBidMade">Cool Down : {{ bidMadeTimer }} sec</div>
          </div>
        </div>
      </div>
    </div>
    <div class="timer-right pos" v-if="globalTimer > 0">
      <Timer :timeLeft="globalTimer" @time="updateGlobalTime"></Timer>
    </div>
    <div class="card scrollable-div rec-bid">
      <div class="card-header">
        <h5>Recent Bids</h5>
      </div>
      <div class="card-body p-0">
        <div
          class="d-flex align-items-center px-3 py-2 border-bottom"
          v-for="(user, index) in topUserList"
          :key="index"
        >
          <span class="mr-3">
            <font-awesome-icon icon="user-circle" />
          </span>
          <span class="flex-grow-1"
            >{{ user.firstName + " " + user.lastName }}
          </span>
          <span>{{ user.bidAmount > 0 ?"$" + user.bidAmount : "N/A" }}</span>
        </div>
      </div>
    </div>
    <div class="bubble-container">
      <BubbleAnimation
        v-for="(bubble, index) in bubbles"
        :key="index"
        :name="bubble.name"
        :top="bubble.top"
        :left="bubble.left"
        :size="bubble.size"
        :cost="bubble.cost"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "vue3-carousel/dist/carousel.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { onMounted, reactive, ref,computed, onUnmounted } from "vue";

import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import auctionService from "./../../services/auctionService";

import { BubbleAnimation } from "../component";
import type { IGetAuctionItemDetails } from "../../interfaces/auction";
import { Timer } from "../component";
import { useRoute } from "vue-router";
import type { IRecentBidder } from "../../interfaces/bid-for-good";
import { getDate, getTime } from "../../utility";
import { notify } from "@kyvg/vue3-notification";
import { Loader } from "../component";

const isBidMade = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const bidAmount = ref<number>();
const bidStatus = ref<string>();
const showBidActivenessMessage = ref<boolean>(false);

const topUserList = ref<IRecentBidder[]>([]);

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

const bidCalculatedEndTime = ref<Date | string | number>("");
const bidCalculatedStartTime = ref<Date | string | number>(getDate(new Date()));

const userDetails: any = localStorage.getItem("userDetails");
const { userId, sessionId, isBuyer } = JSON.parse(userDetails);

let bidChecker: number;
let highestBid = ref<number>(0);
let startVal = ref<number>(100);
let startTime = ref<Date | string>("");
let endTime = ref<Date | string>("");
let socket = ref<Socket>();
const description = ref<string>();
let myBid = ref<number>();

let bidMadeTimer = ref<number>(10);
const route = useRoute();
const { itemId, auctionId, auctionType } = route.query;
const bubbles = ref<any>([]);
const globalTimer = ref<number>(0);

// Add an hour to the date

let socketUrl;

if (window.location.hostname === "localhost") {
  socketUrl = "http://localhost:3000";
} else {
  socketUrl = "http://csci5308vm5.research.cs.dal.ca:3000";
}

socket.value = io(socketUrl);

const calculateTimer = () => {
  const dateObj = new Date(bidCalculatedEndTime.value);
  const timeRemaining = dateObj.getTime() - Date.now();
  const timeInSeconds = Math.floor(timeRemaining / 1000);
  globalTimer.value = timeInSeconds;
};

const updateGlobalTime = (time: any) => {
  globalTimer.value = time;
};

const hasBidStarted = () => {
  bidChecker = setInterval(() => {
  }, 5000);
};

const enableSubmitButton = computed(() => {
  return checkButtonDisability() && !isBidMade.value;
});

const checkButtonDisability = () => {
  const currentTime = Date.now();
  const startTime = new Date(bidCalculatedStartTime.value);
  const endTime = new Date(bidCalculatedEndTime.value);
  showBidActivenessMessage.value =
    currentTime >= startTime.getTime() && currentTime <= endTime.getTime();
  return showBidActivenessMessage.value;
};

onUnmounted(() => {
  clearInterval(bidChecker);
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const requestPayload: any = {
      itemId,
      auctionId,
      auctionType,
      userId,
    };
    auctionService
      .getTopFiveUser(requestPayload.auctionId)
      .then((result) => {
        const tempResult = result.data.map((bid: any) => {
          return {
            firstName: bid.UserDetail.firstName,
            lastName: bid.UserDetail.lastName,
            bidAmount: bid.bidAmount,
            userId: bid.UserDetail.userId,
          };
        });
        topUserList.value = tempResult;
      })
      .catch((_result) => {
        console.log("top User List failed.");
      });

    const updateUserList = () => {
      auctionService
        .getTopFiveUser(requestPayload.auctionId)
        .then((result) => {
          const tempResult = result.data.map((bid: any) => {
            return {
              firstName: bid.UserDetail.firstName,
              lastName: bid.UserDetail.lastName,
              bidAmount: bid.bidAmount,
            };
          });
          topUserList.value = tempResult;
        })
        .catch((_result) => {
          console.log("top User List failed.");
        });
    };

    updateUserList();

    socket.value?.on("updateTopUserList", (_data) => {
      updateUserList();
    });

    auctionService
      .getNewItemDetails(requestPayload)
      .then((res) => {
        description.value = res.data.item.itemDes;
        startVal.value = res.data.item.startPrice;
        sellItemDetail = res.data.item;
        startTime.value = res.data.item.auction.startTime;
        endTime.value = res.data.item.auction.endTime;
        bidCalculatedStartTime.value =
          getDate(startTime.value) + " " + getTime(startTime.value);
        bidCalculatedEndTime.value =
          getDate(endTime.value) + " " + getTime(endTime.value);
        calculateTimer();
        checkButtonDisability();
        hasBidStarted();
      })
      .catch(() => {
        console.log("cant fetch item details");
      });

    auctionService
      .getCurrentMax(requestPayload.auctionId)
      .then((res) => {
        highestBid.value = res.data;
      })
      .catch((res) => {
        console.log("Current Max Failed = " + res);
      });

    auctionService
      .getCurrentUserBid(userId, requestPayload.auctionId)
      .then((res) => {
        myBid.value = res.data;
      });
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

// Connection to socket at server

socket.value.on("connection", (message: string) => {
  console.log(message);
});

socket.value.on("bidUpdate", (info) => {
  bidStatus.value = undefined;
  highestBid.value = info.highestBid;
  const newBubble = {
    name: "Alice",
    top: Math.floor(Math.random() * 300) + 100,
    left: Math.floor(Math.random() * 800) - 800,
    size: 50,
    cost: +highestBid.value,
  };
  bubbles.value.push(newBubble);

  const timer = setTimeout(() => {
    bubbles.value.splice(bubbles.value.indexOf(newBubble), 1);
    clearTimeout(timer);
  }, 4000);
});

socket.value.on("login", (data) => {
  bidStatus.value = data;
});

socket.value.on("bidStatus", (data) => {
  bidStatus.value = data;
});

socket.value.on("yourBidUpdate", (data) => {
  myBid.value = data.highestBid;
});

socket.value.on("out", (data) => {
  bidStatus.value = data;
});

socket.value.on("disconnect", () => {
  console.log("user disconnected");
});

const timeParse = (startTime: string | Date) => {
  const Time = getTime(startTime);
  return Time;
};

const dateParse = (time: string | Date) => {
  const date = getDate(time);
  return date;
};
const sendMessage = () => {
  if (bidAmount.value == null) {
    notify({
      title: "Failure!",
      text: "Bid should not be empty!",
      type: "danger",
    });
  } else if (!/^\d+$/.test(bidAmount.value.toString())) {
    notify({
      title: "Failure!",
      text: "Bid should be a number!",
      type: "danger",
    });
  } else {
    if (
      bidAmount.value == null ||
      bidAmount.value <= sellItemDetail.startPrice
    ) {
      notify({
        title: "Failure!",
        text: "Bid should be more than start price!",
        type: "danger",
      });
    } else if (bidAmount.value <= highestBid.value) {
      notify({
        title: "Failure!",
        text: "Bid should be more than highest bid!",
        type: "danger",
      });
    } else {
      isBidMade.value = true;
      const bidPlaced = setInterval(() => {
        bidMadeTimer.value--;
        if (bidMadeTimer.value == 0) {
          isBidMade.value = false;
          bidMadeTimer.value = 10;
          clearInterval(bidPlaced);
        }
      }, 1000);

      socket.value!.emit("placeBid", {
        seesionId: sessionId,
        auctionId: auctionId,
        itemId: itemId,
        userId: userId,
        bidVal: bidAmount.value,
      });
    }
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

.containers {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.scrollable-div {
  overflow-y: scroll;
  width: 250px;
  height: 300px;
}

.bubble-container {
  position: relative;
  height: 400px;
}

/* .bubble-container {
  position: fixed;
  top: -150px;
  right: -350px;
  width: 300px;
  height: 500px;
  overflow-y: auto;
} */

.pos {
  position: relative;
  top: 180px;
  left: 250px;
}
.tb-bg {
  background-color: #a5dfcb;
}

.brd {
  border: 2px solid #007bff;
}

.rec-bid {
  position: relative;
  top: 250px;
  left: -100px;
}

.timer-right {
  margin-right: 63px;
}
</style>
