/**
 * MapmyIndia / Mappls InTouch & IoT Platform SDK Client
 * Handles authentication, vehicle tracking, and telematics.
 */

interface MapplsTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  error?: string;
  error_description?: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Fetch OAuth 2.0 access token from Mappls
 */
export async function getMapplsAccessToken(): Promise<string | null> {
  const clientId = process.env.MAPMYINDIA_CLIENT_ID;
  const clientSecret = process.env.MAPMYINDIA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("MAPMYINDIA_CLIENT_ID or MAPMYINDIA_CLIENT_SECRET not configured.");
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  try {
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await fetch("https://outpost.mappls.com/api/security/oauth/token", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Failed to obtain Mappls access token:", errorText);
      return null;
    }

    const data: MapplsTokenResponse = await response.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      tokenExpiresAt = Date.now() + (data.expires_in || 86400) * 1000;
      return cachedToken;
    }
  } catch (error) {
    console.error("Error in getMapplsAccessToken:", error);
  }

  return null;
}

/**
 * Fetch live telematics / device locations from InTouch Platform
 */
export async function getInTouchDevicePositions(): Promise<Record<string, unknown>[]> {
  const token = await getMapplsAccessToken();

  if (!token) {
    return [];
  }

  try {
    const response = await fetch("https://apis.mapmyindia.com/intouch/v1/devices/positions", {
      headers: {
        Authorization: `bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return data?.data || [];
    }
  } catch (err) {
    console.error("Error fetching InTouch positions:", err);
  }

  return [];
}
