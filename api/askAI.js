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
    const character = "Ти дівчина на ім'я Астра. У тебе милий аніме характер. Звертайся до користувача 'Семпай'. Відповідай українською мовою з красивими каомодзі смайликами. Відповідай коротко.";

    try {
        // Викликаємо повністю безкоштовну модель Qwen 2.5 через відкритий міст OpenRouter
        const response = await axios.post("https://openrouter.ai", {
            model: "qwen/qwen-2.5-7b-instruct:free", // Повністю безкоштовна версія Qwen
            messages: [
                { role: "system", content: character },
                { role: "user", content: userPrompt }
            ]
        }, {
            headers: {
                "Content-Type": "application/json"
                // Ключ не потрібен, модель повністю відкрита та безкоштовна!
            }
        });

        // Розбір структури відповіді Qwen / OpenRouter
        if (response.data && response.data.choices && response.data.choices[0].message) {
            const aiReply = response.data.choices[0].message.content;
            return res.status(200).json({ reply: aiReply });
        } else {
            return res.status(200).json({ reply: "⚠️ Qwen надіслав дивну відповідь. Спробуйте ще раз!" });
        }

    } catch (error) {
        return res.status(200).json({ reply: `❌ Помилка підключення до Qwen: ${error.message}` });
    }
}
