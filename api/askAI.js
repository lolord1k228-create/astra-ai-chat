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

    // Спеціальна перевірка: чи взагалі Vercel бачить ваш ключ
    if (!apiKey) {
        return res.status(200).json({ reply: "❌ Помилка налаштування Vercel: Сервер взагалі не бачить змінну GEMINI_API_KEY. Перевірте вкладку Environment Variables!" });
    }

    const character = "Ти дівчина на ім'я Астра. У тебе милий аніме характер. Звертайся до користувача 'Семпай'. Відповідай українською мовою з каомодзі.";

    try {
        const response = await axios.post(
            `https://googleapis.com{apiKey}`,
            { contents: [{ parts: [{ text: `${character}\n\nЗапит: ${userPrompt}` }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts[0]) {
            const aiReply = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: aiReply });
        } else {
            // Якщо формат відповіді змінився, показуємо що саме прислав Google
            return res.status(200).json({ reply: `⚠️ Дивний формат відповіді від Google. Сирі дані: ${JSON.stringify(response.data)}` });
        }
    } catch (error) {
        let errorDetails = error.message;
        if (error.response && error.response.data) {
            errorDetails += " -> Справжня причина від Google: " + JSON.stringify(error.response.data);
        }
        // Надсилаємо точну помилку прямо в екран чату користувачу!
        return res.status(200).json({ reply: `❌ Квантовий збій системи! Код помилки: ${errorDetails}` });
    }
}
