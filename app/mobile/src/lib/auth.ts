import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const KEYCLOAK_URL = process.env.EXPO_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.EXPO_PUBLIC_KEYCLOAK_REALM || 'ananta';
const KEYCLOAK_CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || 'ananta-mobile';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_info';

export interface UserInfo {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  realm_access: { roles: string[] };
  ananta_patient_id?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

function getRedirectUri(): string {
  return Linking.createURL('auth/callback');
}

function getKeycloakUrl(path: string): string {
  return `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect${path}`;
}

export async function login(): Promise<AuthTokens | null> {
  const redirectUri = getRedirectUri();

  const authUrl =
    `${getKeycloakUrl('/auth')}?` +
    `client_id=${KEYCLOAK_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=openid profile email`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type !== 'success' || !result.url) {
    return null;
  }

  const url = new URL(result.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return null;
  }

  return exchangeCode(code, redirectUri);
}

async function exchangeCode(code: string, redirectUri: string): Promise<AuthTokens> {
  const tokenUrl = getKeycloakUrl('/token');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: KEYCLOAK_CLIENT_ID,
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error('Token exchange failed');
  }

  const tokens: AuthTokens = await response.json();
  await storeTokens(tokens);
  return tokens;
}

export async function refreshAccessToken(): Promise<AuthTokens | null> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const tokenUrl = getKeycloakUrl('/token');
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: KEYCLOAK_CLIENT_ID,
      refresh_token: refreshToken,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      await clearTokens();
      return null;
    }

    const tokens: AuthTokens = await response.json();
    await storeTokens(tokens);
    return tokens;
  } catch {
    await clearTokens();
    return null;
  }
}

export async function logout(): Promise<void> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  if (refreshToken) {
    try {
      const logoutUrl = getKeycloakUrl('/logout');
      const body = new URLSearchParams({
        client_id: KEYCLOAK_CLIENT_ID,
        refresh_token: refreshToken,
      });

      await fetch(logoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
    } catch {
      // Ignore logout errors
    }
  }

  await clearTokens();
}

async function storeTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, tokens.access_token);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh_token);

  const userInfo = parseJwt(tokens.access_token);
  if (userInfo) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userInfo));
  }
}

async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function getStoredUser(): Promise<UserInfo | null> {
  try {
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded) return false;

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    const refreshed = await refreshAccessToken();
    return refreshed !== null;
  }

  return true;
}

function parseJwt(token: string): (UserInfo & { exp?: number }) | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
