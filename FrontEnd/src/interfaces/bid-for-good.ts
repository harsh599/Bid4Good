export interface ILoginDetails {
  email: string;
  password: string;
}

export interface ILoggedInUserDetails {
  email: string;
  isBuyer: boolean;
  isSeller: boolean;
  isVerified: boolean;
  sessionId: string;
  userId: number;
}

export interface ILogOutRequestPayload {
  sessionId: string;
}

export interface IRecentBidder {
  firstName: string;
  lastName: string;
  bidAmount: number;
  userId: number;
}

export interface ICurrentUserBlindBid{
  itemId: string;
  userId: string;
}
