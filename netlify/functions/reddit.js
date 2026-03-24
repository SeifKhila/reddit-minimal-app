const cache = new Map();
const CACHE_MS = 120000;

export async function handler(event) {
  const path = event.queryStringParameters && event.queryStringParameters.path;

  if (!path) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Missing path parameter" })
    };
  }

  try {
    const cleanPath = decodeURIComponent(path).replace(/^\/+/, "");
    const pathWithoutQuery = cleanPath.split("?")[0];
    const apiPath = pathWithoutQuery.replace(/^\/+/, "");

    const cached = cache.get(apiPath);
    const now = Date.now();
    if (cached && now - cached.ts < CACHE_MS) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: cached.body
      };
    }

    const response = await fetch(`https://www.reddit.com/${apiPath}`, {
      headers: {
        "User-Agent": "web:redditminimalapp:v1.0 (by /u/redditminimalapp)",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: "Reddit request failed" })
      };
    }

    const body = await response.text();
    cache.set(apiPath, { ts: now, body });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Failed to fetch Reddit data" })
    };
  }
}
