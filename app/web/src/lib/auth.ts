import Keycloak from "keycloak-js";

// =============================================================================
// Keycloak OIDC Configuration
// =============================================================================

const KEYCLOAK_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8080";
const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "ananta";
const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "ananta-web";

let keycloakInstance: Keycloak | null = null;

/**
 * Initialize Keycloak instance (singleton pattern).
 * Creates and initializes the Keycloak adapter for SSO/OIDC authentication.
 */
export async function initKeycloak(): Promise<Keycloak> {
  if (keycloakInstance) {
    return keycloakInstance;
  }

  const kc = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
  });

  try {
    await kc.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        typeof window !== "undefined"
          ? `${window.location.origin}/silent-check-sso.html`
          : undefined,
      pkceMethod: "S256",
      checkLoginIframe: false,
    });

    keycloakInstance = kc;

    // Set up token refresh
    if (kc.authenticated) {
      setInterval(async () => {
        try {
          await kc.updateToken(30);
        } catch {
          console.warn("Token refresh failed");
        }
      }, 60000);
    }

    return kc;
  } catch (error) {
    console.error("Keycloak initialization failed:", error);
    // Return an uninitialized instance so the app can still render
    keycloakInstance = kc;
    return kc;
  }
}

/**
 * Get the current access token from Keycloak.
 */
export function getToken(kc?: Keycloak): string | undefined {
  const instance = kc ?? keycloakInstance;
  return instance?.token;
}

/**
 * Extract user roles from the Keycloak token.
 * Checks both realm-level and client-level roles.
 */
export function getUserRoles(kc?: Keycloak): string[] {
  const instance = kc ?? keycloakInstance;
  if (!instance?.tokenParsed) return [];

  const realmRoles = instance.tokenParsed.realm_access?.roles ?? [];
  const clientRoles =
    instance.tokenParsed.resource_access?.[KEYCLOAK_CLIENT_ID]?.roles ?? [];

  return [...new Set([...realmRoles, ...clientRoles])];
}

/**
 * Check if the user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  return keycloakInstance?.authenticated ?? false;
}

/**
 * Logout the user and redirect to the origin.
 */
export async function logout(): Promise<void> {
  if (keycloakInstance) {
    await keycloakInstance.logout({
      redirectUri: window.location.origin,
    });
  }
}

/**
 * Get primary role for routing purposes.
 * Priority: patient > doctor > admin
 */
export function getPrimaryRole(roles: string[]): string {
  if (roles.includes("patient")) return "patient";
  if (roles.includes("doctor") || roles.includes("provider")) return "doctor";
  if (roles.includes("admin")) return "admin";
  return "patient"; // default
}
