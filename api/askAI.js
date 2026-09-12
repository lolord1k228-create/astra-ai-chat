const axios = require("axios");

export default async function handler(req, res) {
    // Налаштування CORS (щоб телефон не блокував запити)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const userPrompt = req.body.prompt;
    const apiKey = process.env.GEMINI_API_KEY; 

    const character = "Ти дівчина на ім'я Астра. У тебе милий аніме характер. Звертайся до користувача 'Семпай'. Відповідай українською мовою з красивими каомодзі смайликами. Відповідай коротко.";

    try {
        // ОНОВЛЕНО: Нова офіційна адреса Google API для моделей серії Gemini 2.5
        const response = await axios.post(
            `https://googleapis.com{apiKey}`,
            { 
                contents: [{ parts: [{ text: `${character}\n\nЗапит: ${userPrompt}` }] }] 
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // Точний розбір нової структури відповіді Google
        if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
            const aiReply = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(500).json({ error: "Неправильний формат відповіді Google" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Помилка сервера ШІ" });
    }
}
