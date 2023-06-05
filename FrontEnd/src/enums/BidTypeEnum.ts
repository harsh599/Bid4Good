export enum BidTypeEnum {
  liveBidding = 1,
  blindBidding = 2,
  simpleSell = 3,
}

export enum BidDescriptionEnum {
  "Live Bidding" = BidTypeEnum.liveBidding,
  "Blind Bidding" = BidTypeEnum.blindBidding,
  "Simple Sell" = BidTypeEnum.simpleSell,
}
