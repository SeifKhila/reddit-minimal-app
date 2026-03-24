exports.handler = async function (event) {
  const path = event.queryStringParameters && event.queryStringParameters.path;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing path parameter" })
    };
  }

  try {
    if (typeof fetch !== "function") {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Fetch API is not available in function runtime" })
      };
    }

    const response = await fetch(`https://www.reddit.com/${path}`, {
      headers: {
        "User-Agent": "reddit-minimal-app/1.0",
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Reddit request failed" })
      };
    }

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
      body: JSON.stringify({
        error: "Failed to fetch Reddit data",
        message: error.message
      })
    };
  }
};
