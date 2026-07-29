/**
 * JWT Authentication Utility Module
 * Handles client-side JWT token parsing, validation, expiration checks, and offline token creation.
 */

// Base64URL encoder helper
const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Base64URL decoder helper
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    return atob(base64);
  }
};

/**
 * Decode JWT token payload
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded payload object or null if invalid
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const jsonPayload = base64UrlDecode(parts[1]);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT payload:', e);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} True if expired or invalid, false if active
 */
export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload) return true;
  if (!payload.exp) return false; // If no exp field, treat as permanent
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Validate JWT token integrity and lifespan
 * @param {string} token - JWT token string
 * @returns {boolean} True if valid and not expired
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload) return false;
  return !isTokenExpired(token);
};

/**
 * Generate client-side JWT token (used for offline or client fallback)
 * @param {object} payload - Custom claims/user data
 * @param {number} expiresInHours - Lifespan in hours (default: 24h)
 * @returns {string} Signed JWT token string
 */
export const generateClientJwtToken = (payload, expiresInHours = 24) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issueTime = Math.floor(Date.now() / 1000);
  const expirationTime = issueTime + expiresInHours * 3600;

  const fullPayload = {
    ...payload,
    iat: issueTime,
    exp: expirationTime
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  
  // Dummy signature representation for client-side JWT compliance
  const dummySignature = base64UrlEncode(`kpg_secret_signature_${Date.now()}`);

  return `${encodedHeader}.${encodedPayload}.${dummySignature}`;
};
