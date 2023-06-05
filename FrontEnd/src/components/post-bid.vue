<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="card mx-auto mb-3 w-100 wid shadow">
    <div class="form-header top-header">
      <h3>Add Bid Details</h3>
    </div>
    <div class="card-body left-border">
      <FormKit
        type="form"
        @submit="sellerRegister"
        enctype="multipart/form-data"
        :actions="false"
      >
        <div class="row">
          <div class="col-md-6">
            <FormKit
              type="text"
              label="Name Of Offering"
              v-model="sellerDetails.itemName"
              validation="required"
            />

            <FormKit
              type="number"
              label="Estimated Value"
              v-model="sellerDetails.startPrice"
              validation="required|number|min:1"
            />

            <FormKit
              type="text"
              label="Address"
              v-model="sellerDetails.address"
              validation="required"
            />

            <FormKit
              v-if="!isBidTypeSimple"
              type="date"
              label="Start Date Of Auction"
              v-model="sellerDetails.startDate"
              @change="dateTimeChanged"
              :validation-messages="{
                flag: 'End Time must be after Start Time',
              }"
              validation="required|flag"
            />

            <FormKit
              v-if="!isBidTypeSimple"
              type="time"
              label="Start Time Of Auction"
              help="What time will the auction start?"
              v-model="sellerDetails.startTime"
              @change="dateTimeChanged"
              :validation-messages="{
                flag: 'End Time must be after Start Time',
              }"
              validation="required|flag"
            />

            <FormKit
              v-if="!isBidTypeSimple"
              type="date"
              label="End Date Of Auction"
              v-model="sellerDetails.endDate"
              @change="dateTimeChanged"
              :validation-messages="{
                flag: 'End Time must be after Start Time',
              }"
              validation="required|flag"
            />

            <FormKit
              v-if="!isBidTypeSimple"
              type="time"
              label="End Time Of Auction"
              help="What time will the auction end?"
              v-model="sellerDetails.endTime"
              @change="dateTimeChanged"
              :validation-messages="{
                flag: 'End Time must be after Start Time',
              }"
              validation="required|flag"
            />
          </div>

          <div class="col-md-6">
            <FormKit
              type="select"
              label="Bid Type"
              placeholder="Post Bid as"
              :options="bidTypeOptions"
              v-model="sellerDetails.auctionType"
              validation="required"
              @change="bidTypeChanged(sellerDetails.auctionType)"
            >
            </FormKit>

            <FormKit
              type="select"
              label="State"
              placeholder="Select a State"
              :options="states"
              v-model="sellerDetails.provinceName"
              @change="triggerChange(sellerDetails.provinceName)"
              validation="required"
            >
            </FormKit>

            <FormKit
              type="select"
              label="City"
              placeholder="Select City"
              v-model="sellerDetails.cityName"
              :options="cityOptions"
              validation="required"
            >
            </FormKit>

            <FormKit
              type="text"
              label="Postal Zip Code"
              v-model="sellerDetails.postalCode"
              help="format: a1b-2c3 | a1b2c3 | a1b 2c3"
              :validation="[
                ['required'],
                ['matches', /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/i],
              ]"
            />

            <FormKit
              name="bidPhotos"
              type="file"
              label="Photo of Items"
              accept=".jpg,.jpeg,.png"
              help="Only .pdf,.jpg,.jpeg,.png files allowed"
              multiple="true"
              v-model="bidPhotos"
              @blur="uploadImages(bidPhotos)"
              validation="required"
            />

            <FormKit
              type="textarea"
              label="Description"
              v-model="sellerDetails.itemDes"
              validation="required"
            />
          </div>
        </div>
        <div class="text-center" v-if="isVerified">
          <button class="btn btn-primary" v-bind:disabled="!flag && sellerDetails.auctionType!='simple'">Submit</button>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BidDescriptionEnum, BidTypeEnum } from "../enums/BidTypeEnum";
import type {
  IBidImageDetails,
  IGetSellerBidDetails,
  ISelectResponse,
} from "../interfaces/seller-registration";
import AuthService from "../services/AuthService";
import { computed, onMounted, reactive, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import router from "@/router";

const states = ref<ISelectResponse<string>[]>([]);
const cities = ref<ISelectResponse<string>[]>([]);
const allImages = ref<any>([]);
const bidPhotos = ref<any>({});
const userDetailsObject: any = localStorage.getItem("userDetails");
const userDetail = JSON.parse(userDetailsObject);

let isVerified = ref<boolean>(false);
let flag = ref<boolean>(false);

const { notify } = useNotification();
let dateTime = computed(() => {
  return sellerDetails.startDate + " " + sellerDetails.startTime;
});
let endDateTime = computed(() => {
  return sellerDetails.endDate + " " + sellerDetails.endTime;
});

let cityOptions = computed(() => {
  return cities.value.map((city) => {
    return {
      label: city.label,
      value: city.value,
    };
  });
});

let sellerDetails = reactive<IGetSellerBidDetails>({
  itemName: "",
  startTime: "",
  endTime: "",
  startPrice: "",
  provinceName: "",
  cityName: "",
  postalCode: "",
  isSold: 0,
  address: "",
  itemDes: "",
  imageDetails: [],
  bidType: "",
  startDate: "",
  endDate: "",
  userId: null,
  auctionType: "",
});

const bidTypeOptions: ISelectResponse<string>[] = [
  {
    label: BidDescriptionEnum[BidTypeEnum.liveBidding],
    value: "live",
  },
  {
    label: BidDescriptionEnum[BidTypeEnum.blindBidding],
    value: "blind",
  },
  {
    label: BidDescriptionEnum[BidTypeEnum.simpleSell],
    value: "simple",
  },
];

const isBidTypeSimple = ref<boolean>(false);

onMounted(async () => {
  try {
    isVerified.value = userDetail.isVerified;
    let response = await AuthService.getStates();
    states.value = [];
    for (let i = 0; i < response.data.length; i++) {
      states.value.push({
        label: response.data[i].province_name,
        value: response.data[i].province_name,
      });
    }
  } catch (e) {
    console.error("Error in fetching states", e);
  }
});

const dateTimeChanged = () => {
  if (dateTime.value > endDateTime.value) {
    flag.value = false;
    notify({
      title: "Error",
      text: "End Date and Time should be more than Start Date and Time",
      type: "error",
    });
  } else {
    flag.value = true;
  }
};

const bidTypeChanged = (bidType: any) => {

  if (bidType == "simple") {
    sellerDetails.startDate = "2023-01-01";
    sellerDetails.startTime = "00:00";
    sellerDetails.endDate = "2023-12-31";
    sellerDetails.endTime = "23:59";
    isBidTypeSimple.value = true;
  } else {
    sellerDetails.startDate = "";
    sellerDetails.startTime = "";
    sellerDetails.endDate = "";
    sellerDetails.endTime = "";
    isBidTypeSimple.value = false;
  }
};

const uploadImages = async (data: any) => {
  const headerConfig = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  data.forEach(async (fileItem: any) => {
    const body = new FormData();
    body.append("image", fileItem.file);
    const image = await AuthService.uploadImage(body, headerConfig);
    const imageDetails: IBidImageDetails = {
      imgUrl: image.data.url,
      imgName: image.data.originalname,
      imgDescription: "test",
    };
    allImages.value.push(imageDetails);
  });
};

const sellerRegister = async () => {
  sellerDetails.imageDetails = allImages.value;
  sellerDetails.startTime =
    sellerDetails.startDate + " " + sellerDetails.startTime;
  sellerDetails.endTime = sellerDetails.endDate + " " + sellerDetails.endTime;

  const details: any = localStorage.getItem("userDetails");
  const { userId } = JSON.parse(details);
  if (userId) {
    sellerDetails.userId = userId;
  } else {
    notify({
      title: "Failure!",
      text: "Unable to pull user details!",
      type: "danger",
    });
    return;
  }
  try {
    await AuthService.postBidDetails(sellerDetails);
    router.push("/home");
    notify({
      title: "Successfull!",
      text: "Your Bid has been registered Successfully!",
      type: "success",
    });
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Opps Something went wrong!",
      type: "danger",
    });
  }
};

const triggerChange = async (val: string) => {
  cities.value = [];
  try {
    let response = await AuthService.getCities(val);
    for (let i = 0; i < response.data.length; i++) {
      cities.value.push({
        label: response.data[i].city,
        value: response.data[i].city,
      });
    }
  } catch (e) {
    console.error("Error in pulling cities");
  }
};
</script>

<style scoped>
.wid {
  max-width: 900px;
}
</style>
