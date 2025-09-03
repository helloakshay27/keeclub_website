

import { PROD_ENV } from "../env.prod";

export async function getAccessToken() {
  // Detect deployed domain (customize this check for your domain)
  const isProd = window.location.hostname === "keeclub.com" || window.location.hostname === "www.keeclub.com";

  // Use env variables accordingly
  const env = isProd ? PROD_ENV : import.meta.env;
  const baseUrl = env.VITE_API_BASE_URL;
  const clientId = env.VITE_CLIENT_ID;
  const clientSecret = env.VITE_CLIENT_SECRET;
  const refreshToken = env.VITE_REFRESH_TOKEN;

  console.log(isProd ? "Using PROD_ENV variables" : "Using local .env variables", "env data`",{
    VITE_API_BASE_URL: baseUrl,
    VITE_CLIENT_ID: clientId,
    VITE_CLIENT_SECRET: clientSecret,
    VITE_REFRESH_TOKEN: refreshToken,
  });

  if (!baseUrl || !clientId || !clientSecret || !refreshToken) {
    console.error("Missing required environment variables for Salesforce authentication.", {
      VITE_API_BASE_URL: baseUrl,
      VITE_CLIENT_ID: clientId,
      VITE_CLIENT_SECRET: clientSecret,
      VITE_REFRESH_TOKEN: refreshToken,
    });
    throw new Error("One or more Salesforce environment variables are missing. Please check your deployment environment settings or src/env.prod.js.");
  }

  const url = `${baseUrl}/services/oauth2/token`;
  console.log("🔗 Salesforce token URL:", url);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔑 Token Data:", data); // includes access_token & instance_url
    return data; // return full object
  } catch (err) {
    console.error("Error fetching access token:", err);
    return null;
  }
}
