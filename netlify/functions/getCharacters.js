export async function handler() {
  try {
    const res = await fetch('https://the-one-api.dev/v2/character', {
      headers: {
        Authorization: `Bearer ${process.env.LOTR_API_KEY}`
      }
    });

    const data = await res.json();
    console.log("Fetched characters:", data); // helpful for debugging

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong." }),
    };
  }
}
