import {
  BuyerDetails,
  IssueTrack,
  OrderDetails,
  ReportIssue,
} from "../components/component";
import store from "../store";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: () => import("../components/login/user-login.vue"),
    },
    {
      path: "/buyer",
      name: "buyer",
      component: () =>
        import("../components/registration/buyer-registration.vue"),
      children: [
        { path: "", name: "Buyer Details", component: BuyerDetails },
        { name: "buyer-order", path: "/buyer/orders", component: OrderDetails },
        {
          name: "buyer-report-issue",
          path: "/buyer/report-issue",
          component: ReportIssue,
        },
        {
          name: "buyer-issue-history",
          path: "/buyer/issues",
          component: IssueTrack,
        },
      ],
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../components/homepage-latest.vue"),
    },
    {
      path: "/admin-dashboard",
      name: "Admin Dashboard",
      component: () => import("../components/admin-dashboard.vue"),
    },
    {
      path: "/admin-issue-details",
      name: "Admin Issues",
      component: () => import("../../src/components/admin-issue-details.vue"),
    },
    {
      path: "/make-bid",
      name: "Make Bidding",
      component: () => import("../components/auction/online-bidding.vue"),
    },
    {
      path: "/make-blind-auction",
      name: "Blind Auction",
      component: () => import("../components/auction/blind-auction.vue"),
    },
    {
      path: "/make-sell",
      name: "Simply Sell",
      component: () => import("../components/auction/simple-sell.vue"),
    },
    {
      path: "/reg-seller",
      name: "User Registration",
      component: () =>
        import("../components/registration/seller-registration.vue"),
    },
    {
      path: "/post-bid",
      name: "Post Bid",
      component: () => import("../components/post-bid.vue"),
    },
    {
      path: "/add-card",
      name: "Add Card",
      component: () => import("../components/card-details.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "Error",
      component: () => import("../components/misc pages/not-found.vue"),
    },
    {
      path: "/No-access",
      name: "No Access",
      component: () => import("../components/misc pages/not-found.vue"),
    },

    {
      path: "/congratulations",
      name: "congratulations",
      component: () => import("../components/misc pages/congratulations.vue"),
    },
    {
      path: "/wishlist",
      name: "wishlist",
      component: () => import("../components/misc pages/wishlist.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userDetailsObject: any = localStorage.getItem("userDetails");
  const userDetail = JSON.parse(userDetailsObject);
  const isLoggedIn = !!(userDetail && userDetail.sessionId);
  const isSeller = !!(userDetail && userDetail.isSeller);
  const isVerified = !!(userDetail && userDetail.isVerified);
  const isBuyer = !!(userDetail && userDetail.isBuyer);
  const adminID = !!(userDetail && userDetail.email == "admin@bid4good.ca");
  if (isLoggedIn) {
    store.commit("setSessionId", userDetail.sessionId);
  }
  store.commit("setCurrentRoute", to);
  const adminPages =
    to.name === "Admin Dashboard" || to.name === "Admin Issues";

  if (adminID) {
    next();
  } else if (
    to.name !== "Login" &&
    to.name !== "User Registration" &&
    !isLoggedIn
  ) {
    next({ name: "Login" });
  } else if (isLoggedIn) {
    if (to.name === "Login") {
      next({ name: "Home" });
    }
    if (to.name === "Post Bid" && !isVerified) {
      next({ name: "Home" });
    }
    if (!adminID && adminPages) {
      next({ name: "No Access" });
    } else if (!isSeller && to.name === "Post Bid") {
      next({ name: "No Access" });
    } else if (!isBuyer && to.name === "buyer-order") {
      next({ name: "No Access" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
