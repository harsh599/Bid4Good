<template>
  <loader v-if="isLoading"></loader>
  <div v-else>
    <div>
      <button
        class="filter-toggle filter-btn"
        v-if="!isHidden"
        @click="showFilter"
      >
        <font-awesome-icon icon="filter" />
      </button>
      <div
        v-if="isHidden"
        class="d-flex align-items-center form-background form-card card-body p-2"
        style="border-left: 4px solid #007bff; padding-left: 10px"
      >
        <h3 style="display: flex; justify-content: center">Live Auction</h3>
        <div class="col-4">
          <FormKit
            type="date"
            name="StartDate"
            label="Start Date"
            validation="required"
            validation-visibility="live"
            v-model="startDate"
            class="m-2"
          />
        </div>

        <div class="col-4 m-2">
          <FormKit
            class="m-2"
            type="date"
            label="End Date"
            :validation="[['date_after', startDate]]"
            v-model="endDate"
          />
        </div>
        <div class="text-center m-2 col-4">
          <button class="btn btn-primary m-1" @click="filterByDate">
            Search
          </button>
          <button class="btn btn-danger m-1" @click="close">Cancel</button>
        </div>
      </div>
    </div>
    <div v-if="liveAuctionDetails.length > 0">
      <Carousel
        id="gallery"
        :items-to-show="1"
        :wrap-around="false"
        v-model="currentSlide"
      >
        <Slide v-for="(item, index) in liveAuctionDetails" :key="index">
          <img
            :src="item.imgUrl"
            onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
            class="carousel__item item_size"
            @click="liveAuctionClicked(item)"
            alt="Image"
          />
        </Slide>
      </Carousel>
      <Carousel
        id="thumbnails"
        :items-to-show="liveAuctionDetails.length"
        :wrap-around="true"
        v-model="currentSlide"
        ref="carousel"
      >
        <Slide v-for="(item, index) in liveAuctionDetails" :key="index">
          <img
            :src="item.imgUrl"
            onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
            class="carousel__item item_size img_resolution"
            @click="slideTo(index - 1)"
            alt="Image"
          />
        </Slide>
      </Carousel>
    </div>
    <div v-else>
      <div class="container m-5">
        <div class="card border shadow">
          <div class="card-body">
            <h1 class="card-title text-center mb-4">
              No Live Auctions Posted at the Moment
            </h1>
            <p class="card-text text-center">
              We're sorry, but there are currently No live auctions available.
              Please check back later for updates.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="blindAuctionDetails.length > 0">
      <h3 style="display: flex; justify-content: center">Blind Auction</h3>
      <Carousel>
        <Slide v-for="(item, index) in blindAuctionDetails" :key="index">
          <img
            :src="item.imgUrl"
            onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
            class="carousel__item item_size"
            @click="blindAuctionClicked(item)"
            alt="Image"
          />
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
    <div v-else>
      <div class="container m-5">
        <div class="card border shadow">
          <div class="card-body">
            <h1 class="card-title text-center mb-4">
              No Blind Auction's Posted at the Moment
            </h1>
            <p class="card-text text-center">
              Sorry, No Blind Auction's has been posted at the moment. Please check
              back later.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="simpleSellAuctionDetails.length > 0">
      <h3 style="display: flex; justify-content: center">Simple sell</h3>

      <Carousel>
        <Slide v-for="(item, index) in simpleSellAuctionDetails" :key="index">
          <img
            :src="item.imgUrl"
            onerror="this.src='https://imgs.search.brave.com/5W8zVnZVHamv7gy2RklV0IPv4-vJWrNe0wCqNTUjlDo/rs:fit:630:630:1/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vdGVlcHVibGlj/L2ltYWdlL3ByaXZh/dGUvcy0tNzlFd0pr/M3otLS90X1ByZXZp/ZXcvYl9yZ2I6MDAw/MDAwLGNfbGltaXQs/Zl9hdXRvLGhfNjMw/LHFfOTAsd182MzAv/djE2MDgyMzY0NDMv/cHJvZHVjdGlvbi9k/ZXNpZ25zLzE3NTE5/ODQ1XzAuanBn'"
            class="carousel__item item_size"
            @click="simpleSellClicked(item)"
            alt="Image"
          />
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
    <div v-else>
      <div class="container m-5">
        <div class="card border shadow">
          <div class="card-body">
            <h1 class="card-title text-center mb-4">
              No Simple Sell Item's Posted at the Moment
            </h1>
            <p class="card-text text-center">
              Sorry, No Simple Sell Item's has been posted at the moment. Please
              check back later.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import type { IGeneralAuctionDetails } from "../interfaces/auction";
import { onMounted, ref } from "vue";
import auctionService from "../services/auctionService";
import router from "@/router";
import { getDate } from "../utility";
import { Loader } from "../components/component";

const startDate = ref<Date>(new Date());
const endDate = ref<Date>(new Date());
const currentSlide = ref<number>(0);
const slideTo = (val: any) => {
  currentSlide.value = val;
};

const close = () => {
  isHidden.value = false;
};

const showFilter = () => {
  isHidden.value = true;
};

const filterByDate = async () => {
  let response = await auctionService.getAllBidDetails();

  let allAuctionDetails = response.data.details.map((auction: any) => {
    return {
      auctionId: auction.auctionId,
      auctionType: auction.auctionType,
      startTime: auction.startTime,
      endTime: auction.endTime,
      ...auction.items[0],
      imgUrl: auction.items[0].imageDetails[0].imgUrl,
    };
  });
  blindAuctionDetails.value = allAuctionDetails.filter(
    (auction: any) =>
      auction.auctionType == "blind" &&
      getDate(auction.startTime) >= getDate(startDate.value) &&
      getDate(auction.endTime) <= getDate(endDate.value)
  );
  simpleSellAuctionDetails.value = allAuctionDetails.filter(
    (auction: any) =>
      auction.auctionType == null ||
      (auction.auctionType == "simple" && 
        getDate(auction.startTime) >= getDate(startDate.value) &&
        getDate(auction.endTime) <= getDate(endDate.value))
  );
  liveAuctionDetails.value = allAuctionDetails.filter(
    (auction: any) =>
      auction.auctionType == "live" &&
      getDate(auction.startTime) >= getDate(startDate.value) &&
      getDate(auction.endTime) <= getDate(endDate.value)
  );
};
const liveAuctionClicked = (args: any) => {
  let queryURL = {
    itemId: args.itemId,
    auctionId: args.auctionId,
    auctionType: args.auctionType,
  };
  router.push({ path: "/make-bid", query: queryURL });
};

const blindAuctionClicked = (args: any) => {
  let queryURL = {
    itemId: args.itemId,
    auctionId: args.auctionId,
    auctionType: args.auctionType,
  };
  router.push({ path: "/make-blind-auction", query: queryURL });
};

const simpleSellClicked = (args: any) => {
  let queryURL = {
    itemId: args.itemId,
    auctionId: args.auctionId,
    auctionType: args.auctionType,
  };
  router.push({ path: "/make-sell", query: queryURL });
};

const blindAuctionDetails = ref<IGeneralAuctionDetails[]>([]);
const simpleSellAuctionDetails = ref<IGeneralAuctionDetails[]>([]);
const isLoading = ref<boolean>(true);
const liveAuctionDetails = ref<IGeneralAuctionDetails[]>([]);
let isHidden = ref<boolean>(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await auctionService.getAllBidDetails();
    let allAuctionDetails = response.data.details.map((auction: any) => {
      return {
        auctionId: auction.auctionId,
        auctionType: auction.auctionType,
        ...auction.items[0],
        imgUrl: auction.items[0].imageDetails[0].imgUrl,
      };
    });

    blindAuctionDetails.value = allAuctionDetails.filter(
      (auction: any) => auction.auctionType == "blind"
    );
    simpleSellAuctionDetails.value = allAuctionDetails.filter(
      (auction: any) =>
        auction.auctionType == null || auction.auctionType == "simple"
    );
    liveAuctionDetails.value = allAuctionDetails.filter(
      (auction: any) => auction.auctionType == "live"
    );
  } catch (e) {
    console.log("Error occured");
  } finally {
    isLoading.value = false;
  }
});
</script>
<style>
.carousel__item {
  object-fit: cover;
  overflow: hidden;
  min-height: 200px;
  max-height: 400px;
  width: 75%;
  background-color: black;
  color: white;
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img_resolution {
  width: 500px;
  height: 200px;
}

.carousel__slide {
  height: fit-content;
  object-fit: cover;
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}

.parent_sect {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.filter-icon-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.filter-toggle {
  background-color: #f5f5f5;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}
.card.filter-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #f5f5f5;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
}
.form-group label {
  margin-bottom: 0.5rem;
}
.filter-btn {
  color: #0c0c0c;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
}

.form-card {
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.card-body {
  background-color: #ffffff;
  border-radius: 10px;
}

/* .filter-container {
  display: flex;
  align-items: center;
} */
</style>
