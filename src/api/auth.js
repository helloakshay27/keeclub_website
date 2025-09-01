

export async function getAccessToken() {
    console.log(`${import.meta.env.VITE_API_BASE_URL}/services/oauth2/token`);
    
const url = `${import.meta.env.VITE_API_BASE_URL}/services/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      refresh_token: import.meta.env.VITE_REFRESH_TOKEN,
    })
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

    const data = await res.json();
    console.log("🔑 Token Data:", data); // includes access_token & instance_url
    return data; // return full object
  } catch (err) {
    console.error("Error fetching access token:", err);
    return null;
  }
}
