import ISendSMSDTO from '../dtos/ISendSMSDTO';

interface ISMSProvider {
  sendSMS(data: ISendSMSDTO): Promise<void>;
}

export default ISMSProvider;
