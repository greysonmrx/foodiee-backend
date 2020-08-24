import ISMSProvider from '../models/ISMSProvider';
import ISendSMSDTO from '../dtos/ISendSMSDTO';

class FakeSMSProvider implements ISMSProvider {
  private messages: ISendSMSDTO[] = [];

  public async sendSMS({ to, text }: ISendSMSDTO): Promise<void> {
    this.messages.push({ to, text });
  }
}

export default FakeSMSProvider;
