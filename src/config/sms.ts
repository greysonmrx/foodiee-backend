import { CredentialsObject } from 'nexmo';

interface ISMSConfig {
  driver: 'nexmo';

  nexmo: {
    credentials: CredentialsObject;
    options?: {
      [key: string]: any;
    };
  };
}

export default {
  driver: process.env.SMS_DRIVER || 'nexmo',

  nexmo: {
    credentials: {
      apiKey: process.env.API_KEY,
      apiSecret: process.env.API_SECRET,
    },
    options: {
      debug: process.env.NODE_ENV === 'development',
    },
  },
} as ISMSConfig;
