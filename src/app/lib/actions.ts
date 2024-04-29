import axios from 'axios';
import Cookies from 'js-cookie';


const baseURL = 'https://api.mewt.in/backend/v1/';

export const generateOTP = (phone: string) => {
  console.log('//from phone', phone);
  // Make a POST request to the API endpoint
  return axios
    .post(
      baseURL + 'authentication/otp-authentication/generate-token/',
      {
        phone: '+91' + phone
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        console.log('OTP successfully generated');
        return response.data;
      } else {
        console.log('OTP generation failed');
        return null;
      }
    })
    .catch(error => {
      console.error('Error generating OTP:', error);
      return null;
    });
};

export const validateOTPToken = (phone: string, otp: string) => {
  console.log('phone', phone);
  console.log('otp', otp);
  return axios
    .post(
      baseURL + 'authentication/otp-authentication/validate-token/',
      {
        phone: '+91' + phone,
        token: otp
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      console.log('response', response);
      if (response.status === 200) {
        console.log('OTP successfully verified');
        console.log(response.data.data.sessionId);

        return response.data.data.sessionId;
      } else {
        console.log('OTP verification failed');
        return null;
      }
    })
    .catch(error => {
      console.error('Error validating OTP token:', error);
      return null;
    });
};

export const getMerchantId = (phone, sessionId) => {
  return axios
    .post(
      baseURL + 'merchant/',
      {
        phone: '+91' + phone
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'session-id': sessionId
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        console.log('Fetched merchant id', response.data.merchantId);
        return response.data.merchantId;
      }
    })
    .catch(error => {
      console.error('Error getting merchant ID:', error);
      return null; // or throw an error
    });
};

export const addBusinessDetails = (
  cardBgImg: string,
  merchantId: string,
  gstin: string,
  accountNumber: string,
  ifsc: string,
  sessionId: string
) => {
  // Request body
  const data = {
    cardBgImg: cardBgImg,
    merchantId: merchantId,
    gstin: gstin,
    accountNumber: accountNumber,
    ifsc: ifsc
  };
  console.log("base 64 image",cardBgImg);

  return axios
    .post(baseURL + 'merchant/add-business-details', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'session-id': sessionId,
        'merchant-id': merchantId
      }
    })
    .then(response => {
      console.log("response from business creation ",response);

      Cookies.set('beneId', response.data.bene_id);
      Cookies.set('merchantId', response.data.merchant_id);
      // revalidatePath('/dashboard');
      // redirect('/dashboard');
      window.location.reload();
      // return {
      //   beneId: response.data.bene_id,
      //   merchantId: response.data.merchant_id
      // };
    })
    .catch(error => {
      console.error('Error adding business details:', error);
      return null;
    });
};


export const getGstinDetails = (
  merchantId: string,
  gstin: string,
  sessionId: string
) => {
  // Request body

  // Make a POST request to the API endpoint
  console.log('gstin',gstin)
  return axios
    .post(baseURL + 'merchant/verify-gstin/'+ gstin,{}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'session-id': sessionId,
        'merchant-id': merchantId
      }
    })
    .then(response => {
      console.log("gstin details", response);
      console.log("gstin details inside", response.data.trade_name_of_business);
      return {
        gstin_trade_name: response.data.trade_name_of_business
      };
    })
    .catch(error => {
      console.error('Error getting gstin details:', error);
      return null;
    });
};

export const verifyBankAccount =  async(
  accountNumber:string, 
  ifscCode:string,
  merchantId:string,
  sessionId:string
) => {
  console.log("came to veriy account details")
  const url = 'https://api.mewt.in/backend/v1/account-verification/';
  const apiKey = 'S1wNkFBuj58vw7EZoRIxo48PwKfsv7Np8Z6hoOfy';
  const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'session-id': sessionId,
      'merchant-id': merchantId
  };
  const data = {
      type: "account",
      accountNumber: accountNumber,
      ifscCode: ifscCode
  };

  try {
      const response = await axios.post(url, data, { headers });
      console.log("response from veriy account details ",response);
      return response.data.nameOnBank;
  } catch (error) {
      console.error('Error verifying bank account:', error);
      return null;
  }
};

export const fetchEmailsBene = (beneId:string) => {
  unstable_noStore();
  console.log('came to fetch emails for bene',beneId)
  

  return axios
    .get(baseURL + 'merchant/get-business-details-emails/'+ beneId, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log("email fetched details", response);
      return {
        emails: response.data
      };
    })
    .catch(error => {
      console.error('Error fetching emails:', error);
      return null;
    });
};

export const markEmailsReadBene = (beneId : string ,merchantId: string , sessionId: string,emailId:string) => {
  console.log('came to fetch emails for bene',beneId)
  return axios
    .post(baseURL + 'merchant/mark-email-as-read/'+ beneId + '/' + emailId,{}, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'session-id': sessionId,
        'merchant-id': merchantId
      }
    })
    .then(response => {
      console.log("email marked as read", response);
      return {
        response: response.data
      };
    })
    .catch(error => {
      console.error('Error marked as email as read:', error);
      return null;
    });
};