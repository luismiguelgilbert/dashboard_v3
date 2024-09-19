import CryptoJS from 'crypto-js';

export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, process.env.DATABASE_PWD).toString();
};

export const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, process.env.DATABASE_PWD);
  return bytes.toString(CryptoJS.enc.Utf8);
};