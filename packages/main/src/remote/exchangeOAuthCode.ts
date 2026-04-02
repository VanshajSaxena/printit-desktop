import { KeychainService } from "src/services/kyechain.service.js";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function exchangeOAuthCode(code: string): Promise<TokenPair> {
  const response = await fetch("/auth/exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(
      `Error in exchangeOAuthCode ${response.status.toString()} ${await response.text()}`,
    );
  }

  const tokens: TokenPair = (await response.json()) as TokenPair;

  await KeychainService.setRefreshToken(tokens.refreshToken);

  return tokens;
}
