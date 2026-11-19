export type GoogleReview = {
  id: string;
  name: string;
  photoUrl?: string;
  rating: 4 | 5;
  body: string;
};

export const googleProfileRating = 4.7;
export const googleReviewsUrl = "https://www.google.com/maps?cid=8473537349498944094&hl=pt-BR";
export const googleReviews: readonly GoogleReview[] = [];
