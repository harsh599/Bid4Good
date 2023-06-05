<template>
  <loader v-if="isLoading"></loader>
  <div v-else>
    <section>
      <div
        class="card bg-white rounded-lg shadow-sm mb-2"
        style="border-left: 4px solid #007bff; padding-left: 10px"
      >
        <div class="card-body d-flex justify-content-between">
          <h1>User Details</h1>
        </div>
      </div>
    </section>
    <FormKit
      type="form"
      :actions="false"
      @submit="sellerRegister"
      @submit-invalid="InvalidSignup"
      enctype="multipart/form-data"
    >
      <div class="card mb-3 w-100 wid">
        <div
          class="card-body"
          style="border-left: 4px solid #007bff; padding-left: 10px"
        >
          <h5 class="card-title">Hello: {{ userDetails.firstName }}</h5>
          <div class="row">
            <div class="col-md-6">
              <FormKit
                type="text"
                label="First Name"
                v-model="userDetails.firstName"
                style="color: black"
                validation="required|alpha"
              />

              <FormKit
                type="text"
                label="Last Name"
                v-model="userDetails.lastName"
                style="color: black"
                validation="required|alpha"
              />

              <FormKit
                type="tel"
                label="Phone Number"
                v-model="userDetails.phone"
                style="color: black"
                validation="required|number|length:10,10"
                validation-visibility="dirty"
              />

              <FormKit
                type="date"
                label="Date of birth"
                style="color: black"
                validation="required"
                v-model="userDetails.dateOfBirth"
              />
            </div>

            <div class="col-md-6">
              <FormKit
                type="text"
                label="Address"
                v-model="userDetails.address"
                style="color: black"
                validation="required"
              />

              <FormKit
                type="select"
                label="State"
                placeholder="Select a State"
                :options="states"
                v-model="userDetails.provinceName"
                validation="required"
                @change="triggerChange(userDetails.provinceName)"
              >
              </FormKit>

              <FormKit
                type="select"
                label="City"
                placeholder="Select City"
                :options="cityOptions"
                validation="required"
                v-model="userDetails.cityName"
              ></FormKit>

              <FormKit
                type="text"
                label="Postal Zip Code"
                help="format: a1b-2c3 | a1b2c3 | a1b 2c3"
                :validation="[
                  ['required'],
                  ['matches', /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/i],
                ]"
                v-model="userDetails.postalCode"
                style="color: black"
              />
            </div>
            <hr class="hr hr-blurry" />
            <h5 class="card-title">User Credentials</h5>
            <div class="col-md-6">
              <FormKit
                type="email"
                label="Email"
                placeholder="Email"
                v-model="userDetails.email"
                disabled
                help="Once Registered Can't be Changed"
              />
            </div>

            <div class="col-md-6">
              <FormKit
                type="checkbox"
                label="Role"
                name="terms"
                :options="['Buyer', 'Seller']"
                validation="required"
                v-model="buyerSeller"
                @input="
                  checkIsBuyerIsSeller(
                    userDetails.isSeller,
                    userDetails.isBuyer
                  )
                "
                help="Contact BidForGood"
                disabled
              />
            </div>
          </div>
          <div class="text-center">
            <button class="btn btn-primary">Update</button>
          </div>
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import type {
  IGetUserDetails,
  ISelectResponse,
} from "../../interfaces/seller-registration";
import AuthService from "../../services/AuthService";
import { computed, onMounted, reactive, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import Loader from "../loader.vue";

const states = ref<ISelectResponse<string>[]>([]);
const cities = ref<ISelectResponse<string>[]>([]);
let cityOptions = computed(() => {
  return cities.value.map((city) => {
    return {
      label: city.label,
      value: city.value,
    };
  });
});
let userDetails = reactive<IGetUserDetails>({
  firstName: "",
  lastName: "",
  dateOfBirth: new Date(),
  gender: "male",
  isBuyer: false,
  isSeller: false,
  phone: "",
  address: "",
  cityName: "",
  provinceName: "",
  govtIdUrl: "",
  email: "",
  password: "",
  postalCode: "",
  termsCondition: false,
});
const { notify } = useNotification();
const isLoading = ref<boolean>(true);

let buyerSeller = reactive<any>(["", ""]);
const userDetailsObject: any = localStorage.getItem("userDetails");
const userDetail = JSON.parse(userDetailsObject);

onMounted(async () => {
  try {
    isLoading.value = true;
    let response = await AuthService.getStates();
    states.value = [];
    for (let i = 0; i < response.data.length; i++) {
      states.value.push({
        label: response.data[i].province_name,
        value: response.data[i].province_name,
      });
    }
    const userResponse = await AuthService.getCurrentUserDetails(
      userDetail.userId
    );
    userDetails = Object.assign(
      {},
      { ...userResponse.data },
      { ...userResponse.data.loginDetail }
    );
    if (userResponse.data.isBuyer) {
      buyerSeller.push("Buyer");
    }
    if (userResponse.data.isSeller) {
      buyerSeller.push("Seller");
    }
    cities.value.push({
      label: userResponse.data.cityName,
      value: userResponse.data.cityName,
    });
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Error in fetching States.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
});

const InvalidSignup = () => {
  notify({
    title: "Failure!",
    text: "Registration Failed! Please Contact Help Desk.",
    type: "error",
  });
};

const sellerRegister = async (data: any) => {
  try {
    isLoading.value = true;
    await AuthService.updateCurrentUserDetails(userDetails);
    notify({
      title: "Success!",
      text: "User Details Updated Successfully!",
      type: "success",
    });
  } catch (e) {
    notify({
      title: "Failure!",
      text: "User Details Updation Failed! Please Contact Help Desk.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const checkIsBuyerIsSeller = async (val: any, val2: any) => {
  if (buyerSeller.length == 0) {
    userDetails.isBuyer = false;
    userDetails.isSeller = false;
  }
  if (buyerSeller.length == 2) {
    userDetails.isSeller = true;
    userDetails.isBuyer = true;
  } else if (buyerSeller.length == 1) {
    if (buyerSeller[0] == "buyer") {
      userDetails.isBuyer = true;
      userDetails.isSeller = false;
    }
    if (buyerSeller[0] == "seller") {
      userDetails.isSeller = true;
      userDetails.isBuyer = false;
    }
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
