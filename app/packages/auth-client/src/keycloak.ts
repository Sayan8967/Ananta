import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

export interface TokenPayload {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: Record<string, { roles: string[] }>;
  ananta_patient_id?: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat: number;
}

let jwksClient: jwksRsa.JwksClient | null = null;

function getJwksClient(keycloakUrl: string, realm: string): jwksRsa.JwksClient {
  if (!jwksClient) {
    jwksClient = jwksRsa({
      jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 minutes
    });
  }
  return jwksClient;
}

export async function getPublicKey(keycloakUrl: string, realm: string, kid: string): Promise<string> {
  const client = getJwksClient(keycloakUrl, realm);
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}

export async function verifyToken(
  token: string,
  keycloakUrl: string,
  realm: string,
): Promise<TokenPayload> {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header.kid) {
    throw new Error('Invalid token: missing kid');
  }

  const publicKey = await getPublicKey(keycloakUrl, realm, decoded.header.kid);

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      publicKey,
      {
        algorithms: ['RS256'],
        issuer: `${keycloakUrl}/realms/${realm}`,
      },
      (err, payload) => {
        if (err) reject(err);
        else resolve(payload as TokenPayload);
      },
    );
  });
}
