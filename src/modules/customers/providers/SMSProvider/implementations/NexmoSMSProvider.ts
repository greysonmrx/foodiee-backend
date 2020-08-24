import Nexmo from 'nexmo';

import smsConfig from '@config/sms';

import ISMSProvider from '../models/ISMSProvider';
import ISendSMSDTO from '../dtos/ISendSMSDTO';

class NexmoSMSProvider implements ISMSProvider {
  private client: Nexmo;

  constructor() {
    const { credentials, options } = smsConfig.nexmo;

    this.client = new Nexmo(credentials, options);
  }

  public async sendSMS({ to, text }: ISendSMSDTO): Promise<void> {
    this.client.message.sendSms('Foodiee', to, text, { type: 'unicode' }, (err, response) => {
      if (err) {
        // Deal with the error
      } else if (response.messages[0].status !== '0') {
        // Deal with the error
      }
    });
  }
}

export default NexmoSMSProvider;
