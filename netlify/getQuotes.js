export async function handler(event) {
    const characterId = event.queryStringParameters.characterId;

    const res = await fetch(`https://the-one-api.dev/v2/character/${characterId}/quote`, {
        headers: {
            Authorization: `Bearer ${process.env.LOTR_API_KEY}`
        }
    });

    const data = await res.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}