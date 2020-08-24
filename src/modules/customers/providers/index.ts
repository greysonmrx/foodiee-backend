import { container } from 'tsyringe';

import smsConfig from '@config/sms';

import ISMSProvider from './SMSProvider/models/ISMSProvider';
import NexmoSMSProvider from './SMSProvider/implementations/NexmoSMSProvider';

const providers = {
  nexmo: NexmoSMSProvider,
};

container.registerSingleton<ISMSProvider>('SMSProvider', providers[smsConfig.driver] || NexmoSMSProvider);
