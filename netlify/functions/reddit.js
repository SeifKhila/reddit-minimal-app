export async function handler(event) {
  const path = event.queryStringParameters.path;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing path parameter" })
    };
  }

  try {
    const response = await fetch(`https://www.reddit.com/${path}`);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Reddit data" })
    };
  }
}
