

export async function getAccessToken() {

  try {
    const response = await fetch(import.meta.env.VITE_SF_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: import.meta.env.VITE_SF_CLIENT_ID,
        client_secret: import.meta.env.VITE_SF_CLIENT_SECRET,
        refresh_token: import.meta.env.VITE_SF_REFRESH_TOKEN,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error("Error fetching access token:", err);
    return null;
  }
}
