import axios from 'axios';

const baseURL = 'https://api.mewt.in/backend/v1/';

export const generateOTP = (phone) => {
  // Make a POST request to the API endpoint
  return axios.post(
    baseURL + 'authentication/otp-authentication/generate-token/',
    {
      phone: phone
    },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    const responseData = response.data;
    if (response.status === 200) {
      console.log("OTP successfully generated");
      return 200;
    } else {
      console.log("OTP generation failed");
      return null; 
    }
  })
  .catch(error => {
    console.error("Error generating OTP:", error);
    return null;
  });
};


export const validateOTPToken = (phone, token) => {
  return axios.post(
    baseURL + 'authentication/otp-authentication/validate-token/',
    {
      phone: phone,
      token: token
    },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    const responseData = response.data;
    if (responseData.status === 200) {
      console.log("OTP successfully verified");
      return responseData.data.sessionId;
    } else {
      console.log("OTP verification failed");
      return null; 
    }
  })
  .catch(error => {
    console.error("Error validating OTP token:", error);
    return null; 
  });
};


export const getMerchantId = (phone,sessionId) => {
  return axios.post(
    baseURL + 'merchant/',
    {
      phone: phone
    },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session-id': sessionId
      }
    }
  )
  .then(response => {
    return response.data.merchantId;
  })
  .catch(error => {
    console.error("Error getting merchant ID:", error);
    return null; // or throw an error
  });
};

export const addBusinessDetails = (displayName, cardBgImg, merchantId, gstin, accountNumber, ifsc,sessionId) => {
  // Request body
  const data = {
    display_name: displayName,
    cardBgImg: cardBgImg,
    merchantId: merchantId,
    gstin: gstin,
    accountNumber: accountNumber,
    ifsc: ifsc
  };

  // Make a POST request to the API endpoint
  return axios.post(
    baseURL + 'merchant/add-business-details',
    data,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session-id': sessionId,
        'merchant-id': merchantId
      }
    }
  )
  .then(response => {
    return {
      beneId: response.data.bene_id,
      merchantId: response.data.merchant_id
    };
  })
  .catch(error => {
    console.error("Error adding business details:", error);
    return null;
  });
};