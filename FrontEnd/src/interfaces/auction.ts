import type { IBidImageDetails } from "./seller-registration";

export interface IPostBidDetails {
  itemName: string;
  startTime: Date | string;
  endTime: Date | string;
  startPrice: string;
  provinceName: string;
  cityName: string;
  postalCode: string;
  address: string;
  itemDes: string;
  imageDetails: IBidImageDetails[];
  bidType: string;
  isSold: number;
  startDate: Date | string;
  endDate: Date | string;
}

export interface itemImageDetails {
  imgDescription: string;
  imgId: number;
  imgName: string;
  imgUrl: string;
  itemId?: number;
}

export interface IGetAuctionItemDetails {
  imageDetails: itemImageDetails[];
  createdAt: string;
  isSold: boolean;
  itemDes: string;
  itemId: number;
  itemName: string;
  startPrice: number;
  updatedAt: string;
  user_id: number;
  bidAmount?: number | null;
  createdTime ?: string;
}
export interface IGetAuctionItemsDetails {
  itemID: number;
  itemName: string;
  itemDes: string;
  startPrice: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  user_id: null;
}
export interface IGetAuctionDetails {
  address: string;
  auctionID: number;
  auctionType: string;
  cityName: string;
  createdAt: Date | string;
  endTime: Date | string;
  isSold: boolean;
  postalCode: string;
  provinceName: string;
  startTime: Date | string;
  updatedAt: Date | string;
  user_id: null;
}

export interface IBlindAuctionQueryPayload {
  itemId: string | null;
  auctionId: string | null;
}

export interface IGeneralAuctionDetails {
  imageDetails: itemImageDetails[];
  auctionId: number | null;
  auctionType: string;
  itemId: number | null;
  itemName: string;
  imgUrl: string;
  startTime: Date | string;
  endTime: Date | string;
}
