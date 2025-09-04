


export async function getAccessToken() {
  // Detect deployed domain (customize this check for your domain)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const isProd = window.location.hostname === "keeclub.lockated.com" || window.location.hostname === "www.keeclub.com";

  let env;
  if (isProd && !isLocal) {
    // Only attempt import if running on production domain and not local
    try {
      const prodModule = await import("/src/env.prod.js");
      env = prodModule.PROD_ENV;
      console.log("Using PROD_ENV variables", env);
    } catch (e) {
      console.error("Failed to load PROD_ENV from env.prod.js", e);
      throw new Error("Production environment variables missing. Please check src/env.prod.js.");
    }
  } else {
    env = import.meta.env;
    console.log("Using local .env variables", env);
  }

  const baseUrl = env.VITE_API_BASE_URL;
  const clientId = env.VITE_CLIENT_ID;
  const clientSecret = env.VITE_CLIENT_SECRET;
  const refreshToken = env.VITE_REFRESH_TOKEN;

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
