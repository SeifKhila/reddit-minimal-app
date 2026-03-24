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

    const requestHeaders = {
      "User-Agent": "Mozilla/5.0 (compatible; reddit-minimal-app/1.0)",
      Accept: "application/json,text/plain,*/*"
    };

    let response = await fetch(`https://www.reddit.com/${path}`, {
      headers: requestHeaders
    });

    // some runtimes get blocked on www, so try old.reddit as fallback
    if (!response.ok) {
      response = await fetch(`https://old.reddit.com/${path}`, {
        headers: requestHeaders
      });
    }

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
