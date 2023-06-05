import type { BidTypeEnum } from "./../enums/BidTypeEnum";

export interface IGetState {
  state: string;
}

export interface ISelectResponse<T> {
  label: string;
  value: T;
}

export interface IGetStateDetails {
  province: string;
}

export interface IGetAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

export interface IGetUserDetails {
  firstName: string,
  lastName: string,
  dateOfBirth: Date|string,
  gender: string,
  isBuyer:boolean;
  isSeller:boolean;
  phone: string;
  email: string;

  address: string;
  cityName: string;
  password: string;
  postalCode: string;

  provinceName: string;
  govtIdUrl?: string;

  termsCondition: boolean;
}

export interface IGetSellerBidDetails {
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
  startDate:Date|string;
  endDate: Date|string;
  userId: number | null;
  auctionType?: string;
}

export interface IBidImageDetails {
  imgName: string;
  imgUrl: string;
  imgDescription: string;
}
