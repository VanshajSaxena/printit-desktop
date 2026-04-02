import keytar from "keytar";

const SERVICE = "printit";

enum KeychainKey {
  REFRESH_TOKEN = "refreshToken",
  VENDOR_EMAIL = "vendorEmail", // convenience for display
}

export const KeychainService = {
  async getRefreshToken(): Promise<string | null> {
    return keytar.getPassword(SERVICE, KeychainKey.REFRESH_TOKEN);
  },
  async setRefreshToken(token: string): Promise<void> {
    await keytar.setPassword(SERVICE, KeychainKey.REFRESH_TOKEN, token);
  },
  async clearAll(): Promise<void> {
    await keytar.deletePassword(SERVICE, KeychainKey.REFRESH_TOKEN);
    await keytar.deletePassword(SERVICE, KeychainKey.VENDOR_EMAIL);
  },
  async setEmail(email: string): Promise<void> {
    await keytar.setPassword(SERVICE, KeychainKey.VENDOR_EMAIL, email);
  },
};
