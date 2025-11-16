const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event, context) {
    
    // 1. Sprawdź, czy to zapytanie POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // 2. Pobierz klucz API z "ukrytych" zmiennych Netlify
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return { statusCode: 500, body: 'API Key not configured.' };
    }

    try {
        // 3. Pobierz prompt wysłany z przeglądarki
        const body = JSON.parse(event.body);
        const userPrompt = body.prompt;

        if (!userPrompt) {
            return { statusCode: 400, body: 'No prompt provided.' };
        }

        // 4. Skonfiguruj i wywołaj API Google (TUTAJ JEST POPRAWKA)
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        // 5. Odeślij odpowiedź z powrotem do przeglądarki
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error('Błąd Gemini API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate content.' })
        };
    }
};
