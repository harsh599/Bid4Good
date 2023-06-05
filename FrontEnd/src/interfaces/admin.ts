export interface IVerfiedSeller {
  address: string;
  cityName: string;
  dateOfBirth: string | Date;
  firstName: string;
  govtIdUrl: string;
  isBuyer: boolean;
  isSeller: boolean;
  lastName: string;
  loginDetail: IVerifiedSellerLoginDetails;
  phone: string;
  postalCode: string;
  provinceName: string;
  userId: number;
  editInProgress: boolean;
  isVerified?: boolean;
  email?: string;
}

export interface IVerifiedSellerLoginDetails {
  email: string;
  isVerified: boolean;
}

export interface IApproveOrDeclineReqPayload {
  userId: number;
  isVerified: boolean;
}
