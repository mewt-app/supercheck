import axios from 'axios';

const baseURL = 'https://api.mewt.in/backend/v1/';

export const generateOTP = (phone: string) => {
  axios
    .post(
      baseURL + 'merchant/add-business-details',
      {},
      {
        headers: {}
      }
    )
    .then(() => {});
};
