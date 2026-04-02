import keytar from "keytar";

const SERVICE = "printit";

enum KeychainKey {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
  VENDOR_EMAIL = "vendorEmail",
}

export const KeychainService = {
  async getRefreshToken(): Promise<string | null> {
    return keytar.getPassword(SERVICE, KeychainKey.REFRESH_TOKEN);
  },
  async setRefreshToken(token: string): Promise<void> {
    await keytar.setPassword(SERVICE, KeychainKey.REFRESH_TOKEN, token);
  },
  async clearAll(): Promise<void> {
    await keytar.deletePassword(SERVICE, KeychainKey.ACCESS_TOKEN);
    await keytar.deletePassword(SERVICE, KeychainKey.REFRESH_TOKEN);
    await keytar.deletePassword(SERVICE, KeychainKey.VENDOR_EMAIL);
  },
  async setEmail(email: string): Promise<void> {
    await keytar.setPassword(SERVICE, KeychainKey.VENDOR_EMAIL, email);
  },
  async getAccessToken(): Promise<string | null> {
    return keytar.getPassword(SERVICE, KeychainKey.ACCESS_TOKEN);
  },
  async setAccessToken(token: string): Promise<void> {
    await keytar.setPassword(SERVICE, KeychainKey.ACCESS_TOKEN, token);
  },
  async clearAccessToken(): Promise<void> {
    await keytar.deletePassword(SERVICE, KeychainKey.ACCESS_TOKEN);
  },
};
