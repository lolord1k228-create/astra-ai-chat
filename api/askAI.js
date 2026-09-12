const axios = require("axios");

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const userPrompt = req.body.prompt;
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(200).json({ reply: "❌ Помилка: Сервер не бачить змінну GEMINI_API_KEY в Vercel!" });
    }

    const character = "Ти дівчина на ім'я Астра. У тебе милий аніме характер. Звертайся до користувача 'Семпай'. Відповідай українською мовою з красивими каомодзі смайликами. Відповідай коротко.";

    try {
        // УВАГА: Ось повна, залізобетонно правильна адреса для запиту до Google Gemini API
        const url = "https://googleapis.com" + apiKey;
        
        const response = await axios.post(url, { 
            contents: [{ parts: [{ text: `${character}\n\nЗапит від Семпая: ${userPrompt}` }] }] 
        }, { 
            headers: { 'Content-Type': 'application/json' } 
        });

        // Правильний розбір масивів [0] у відповіді Google API
        if (response.data && response.data.candidates && response.data.candidates[0].content && response.data.candidates[0].content.parts) {
            const aiReply = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(200).json({ reply: `⚠️ Дивний формат відповіді: ${JSON.stringify(response.data)}` });
        }
    } catch (error) {
        let errorDetails = error.message;
        if (error.response && error.response.data) {
            errorDetails += " -> Деталі від Google: " + JSON.stringify(error.response.data);
        }
        return res.status(200).json({ reply: `❌ Квантовий збій! Код помилки: ${errorDetails}` });
    }
}
