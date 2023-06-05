<template>
  <div class="container p-0">
    <div class="card px-4">
      <FormKit type="form" @submit="approvePayment" submit-label="Make payment">
        <p class="h8 py-3">Payment Details</p>
        <div class="row gx-3">
          <div class="col-12">
            <div class="d-flex flex-column">
              <p class="text mb-1">Person Name</p>
              <FormKit type="text" name="name" />
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex flex-column">
              <p class="text mb-1">Card Number</p>
              <FormKit
                type="text"
                name="card number"
                validation="required|number|length:16,16"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex flex-column">
              <p class="text mb-1">Expiry</p>
              <FormKit
                type="text"
                name="Expiry date"
                placeholder="MM/YYYY"
                :validation="[
                  ['required'],
                  ['matches', /^((0[1-9])|(1[0-2]))\/((2023)|(20[1-2][0-9]))$/],
                ]"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex flex-column">
              <p class="text mb-1">CVV</p>
              <FormKit
                type="password"
                placeholder="***"
                name="CVV"
                validation="required|number|length:3,3"
              />
            </div>
          </div>
        </div>
      </FormKit>
      <FormKit type="submit" label="Cancel Payment" @click="cancelPayment" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import router from "@/router";
import AuthService from "../services/AuthService";
import { useNotification } from "@kyvg/vue3-notification";
import { useRoute } from "vue-router";

const { notify } = useNotification();
const route = useRoute();
const approvePayment = async () => {
  try {
    const requestPayload = Object.assign({ isSold: true }, { ...route.query });
    await AuthService.createSimpleSellOrder(requestPayload);
    router.push("/congratulations");
    notify({
      title: "Successfull!",
      text: "Your Order has been placed Successfully!",
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

const cancelPayment = () => {
  notify({
    title: "Failure!",
    text: "Payment Cancelled. Redirecting!",
    type: "danger",
  });
  setTimeout(() => {
    router.push("/home");
  }, 2000);

};
</script>
<style scoped>


.card {
  max-width: 500px;
  margin: auto;
  color: black;
  border-radius: 20 px;
}

p {
  margin: 0px;
}

.container .h8 {
  font-size: 30px;
  font-weight: 800;
  text-align: center;
}

.btn.btn-primary-card {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-image: linear-gradient(
    to right,
    #77a1d3 0%,
    #79cbca 51%,
    #77a1d3 100%
  );
  border: none;
  transition: 0.5s;
  background-size: 200% auto;
}

.btn.btn-primary-card:hover {
  background-position: right center;
  color: #fff;
  text-decoration: none;
}

.btn.btn-primary-card:hover .fas.fa-arrow-right {
  transform: translate(15px);
  transition: transform 0.2s ease-in;
}

.btn.btn-danger-card {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background-image: linear-gradient(
    to right,
    #cf5555 0%,
    #d97d4f 51%,
    #d3c477 100%
  );
  border: none;
  transition: 0.5s;
  background-size: 200% auto;
}

.btn.btn-danger-card:hover {
  background-position: right center;
  color: #fff;
  text-decoration: none;
}

.btn.btn-danger-card:hover .fas.fa-arrow-right {
  transform: translate(15px);
  transition: transform 0.2s ease-in;
}

.form-control {
  color: white;
  background-color: #223c60;
  border: 2px solid transparent;
  height: 60px;
  padding-left: 20px;
  vertical-align: middle;
}

.form-control:focus {
  color: white;
  background-color: #0c4160;
  border: 2px solid #2d4dda;
  box-shadow: none;
}

.text {
  font-size: 14px;
  font-weight: 600;
}

::placeholder {
  font-size: 14px;
  font-weight: 600;
}

.formkit-wrapper,
.formkit-fieldset {
  max-width: none !important;
}
</style>
