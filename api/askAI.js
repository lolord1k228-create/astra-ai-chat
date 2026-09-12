const axios = require("axios");

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const userPrompt = req.body.prompt;
    const character = "Ти дівчина на ім'я Астра. У тебе милий аніме характер. Звертайся до користувача 'Семпай'. Відповідай українською мовою з красивими каомодзі смайликами. Відповідай дуже коротко.";

    try {
        const response = await axios.post("https://openrouter.ai", {
            model: "qwen/qwen-2.5-7b-instruct:free",
            messages: [
                { role: "system", content: character },
                { role: "user", content: userPrompt }
            ]
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // ІСПРАВЛЕНО: Додано точні індекси, щоб прочитати текст з масиву OpenRouter
        if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
            const aiReply = response.data.choices[0].message.content;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(200).json({ reply: `⚠️ Помилка формату. Дані: ${JSON.stringify(response.data)}` });
        }

    } catch (error) {
        let details = error.message;
        if (error.response && error.response.data) {
            details += " -> " + JSON.stringify(error.response.data);
        }
        return res.status(200).json({ reply: `❌ Помилка підключення: ${details}` });
    }
}
