<template>
  <div class="card mx-auto mb-3 w-100 wid shadow">
    <div class="form-header top-header">
      <h3>Registration</h3>
    </div>
    <div class="card-body left-border">
      <FormKit
        type="form"
        :actions="false"
        @submit="sellerRegister"
        @submit-invalid="InvalidSignup"
        enctype="multipart/form-data"
      >
        <div class="mb-3 w-100 wid">
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
              />
              <FormKit
                id="fileUpload"
                name="idproof"
                type="file"
                label="Photo of Government ID"
                accept=".jpg,.jpeg,.png"
                help="Upload a goverment approved ID such as Driving License or Passport. 
                Only .pdf,.jpg,.jpeg,.png files allowed"
                validation="required"
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
                @blur="checkUserExists(userDetails.email)"
                validation="required|email"
              />
              <div class="error" v-if="isUserAlreadyRegistered">
                User Already Registered.
              </div>

              <FormKit
                type="password"
                name="password"
                validation="required"
                label="Password"
                placeholder="Password"
                v-model="userDetails.password"
              />
            </div>

            <div class="col-md-6">
              <FormKit
                type="password"
                name="password_confirm"
                validation="required|confirm"
                label="Confirm Password"
                placeholder="Re-Enter Password"
              />

              <FormKit
                type="checkbox"
                label="Register as Buyer/Seller or Both"
                name="terms"
                :options="['Buyer', 'Seller']"
                validation="required"
                v-model="buyerSeller"
                @input="checkIsBuyerIsSeller()"
              />
            </div>
            <FormKit
              type="checkbox"
              label="Terms and Conditions"
              help="Do you agree to our terms of service?"
              name="terms"
              validation="accepted"
              :value="false"
              v-model="userDetails.termsCondition"
            />
          </div>
          <div class="text-center">
            <button class="btn btn-primary">Submit</button>
          </div>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  IGetUserDetails,
  ISelectResponse,
} from "../../interfaces/seller-registration";
import router from "@/router";
import AuthService from "../../services/AuthService";
import { computed, onMounted, reactive, ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";

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

let buyerSeller: string[] = [];
const isUserAlreadyRegistered = ref<boolean>(false);

onMounted(async () => {
  try {
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

const InvalidSignup = () => {
  notify({
    title: "Failure!",
    text: "Registration Failed! Please Contact Help Desk.",
    type: "error",
  });
};

const sellerRegister = async (data: any) => {
  const body = new FormData();
  data.idproof.forEach((fileItem: any) => {
    body.append("image", fileItem.file);
  });

  const headerConfig = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  try {
    let uploadImageData = await (
      await AuthService.uploadImage(body, headerConfig)
    ).data;
    userDetails.govtIdUrl = uploadImageData.url;
    await AuthService.register(userDetails);
    notify({
      title: "Success!",
      text: "User Logged In Successfully! Wait for Admins approval",
      type: "success",
    });

    router.push("/");
  } catch (e) {
    notify({
      title: "Failure!",
      text: "Registration Failed! Please Contact Help Desk.",
      type: "error",
    });
  }
};

const checkUserExists = async (email: string) => {
  try {
    await AuthService.checkUserExist(email)
      .then((res) => {
        isUserAlreadyRegistered.value = res.data.isUserAlreadyPresent;
      })
      .catch(() => {
        isUserAlreadyRegistered.value = false;
      });
  } catch {
    console.error("Error in checking user existence");
  }
};
const checkIsBuyerIsSeller = async () => {
  if (buyerSeller.length == 0) {
    userDetails.isBuyer = false;
    userDetails.isSeller = false;
  } else if (buyerSeller.length == 2) {
    userDetails.isSeller = true;
    userDetails.isBuyer = true;
  } else if (buyerSeller.length == 1) {
    if (buyerSeller[0] == "Buyer") {
      userDetails.isBuyer = true;
      userDetails.isSeller = false;
    }
    if (buyerSeller[0] == "Seller") {
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
<style scoped>
.wid {
  max-width: 900px;
}
</style>
