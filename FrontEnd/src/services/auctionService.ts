import axios from "axios";
import apiClient from "../axios";
import type { ICurrentUserBlindBid } from "../interfaces/bid-for-good";

export default {
  getAuctionEndTime(auction: number) {
    return apiClient.post("api/auction/auctionEndTime", { auction });
  },

  getAuctionDetails(auction: number | string) {
    return apiClient.post("api/auction/auctionDetails", { bidId: auction });
  },

  getItemDetails(auction: number | string) {
    return apiClient.post("api/auction/auctionItemDetails", {
      itemId: auction,
    });
  },

  getTopFiveUser(auction: number | string) {
    return apiClient.post("api/auction/topFiveUsers", {
      auctionId: auction,
    });
  },

  getNewItemDetails(requestPayload: any) {
    return apiClient.post("api/auction/auctionItemDetails", requestPayload);
  },

  getImages(auction: number) {
    return apiClient.post("api/auction/auctionImages", { itemId: auction });
  },

  getCurrentMax(auction: number | string) {
    return apiClient.post("api/auction/highestPrice", { auctionId: auction });
  },

  getCurrentUserBid(userId: number, auction: number | string) {
    return apiClient.post("api/auction/myBidValue", {
      userId: userId,
      auctionId: auction,
    });
  },

  makeBlindBid(payload: any) {
    return apiClient.post("api/bid/placeBid", payload);
  },

  getAllBidDetails() {
    return apiClient.get("api/bid/fetchDetails");
  },
  getWishlist(userId: number) {
    return apiClient.get("api/wishlist/getWishlist?user_id=" + userId);
  },
  postWishlist(item_id: number, user_id: number) {
    console.log(item_id, user_id);
    return apiClient.post(
      "api/wishlist/addWishlist?item_id=" + item_id + "&user_id=" + user_id
    );
  },

  deleteWishlist(item_id: number, user_id: number) {
    return apiClient.delete(
      "api/wishlist/deleteWishlist?item_id=" + item_id + "&user_id=" + user_id
    );
  },

  getReport(user_id: number) {
    console.log(user_id);
    return apiClient.get("api/report/getReport?user_id=" + user_id);
  },

  getAllReports() {
    return apiClient.get("api/report/getAllReports");
  },
  postReport(user_id: number, issue: string, concern: string, status: string) {
    return apiClient.post(
      "api/report/addReport?user_id=" +
        user_id +
        "&issueType=" +
        issue +
        "&description=" +
        concern +
        "&status=" +
        status
    );
  },

  updateReport(ticketId: number, isResolved: boolean) {
    console.log(ticketId, isResolved);
    return apiClient.put(
      "api/report/updateReport?ticketId=" +
        ticketId +
        "&isResolved=" +
        isResolved
    );
  },

  getCurrentUserBlindBid(requestPayload: ICurrentUserBlindBid) {
    return apiClient.get(
      "api/auction/fetchBlindBidAmount?itemId=" +
        requestPayload.itemId +
        "&userId=" +
        requestPayload.userId
    );
  },
};
