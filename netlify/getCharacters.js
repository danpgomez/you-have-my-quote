export async function handler() {
    const res = await fetch('https://the-one-api.dev/v2/character', {
        headers: {
            Authorization: `Bearer ${process.env.LOTR_API_KEY}`
        }
    })

    const data = await res.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

