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
        // Викликаємо безкоштовний хмарний сервер Hugging Face (модель Llama 3)
        const response = await axios.post("https://huggingface.co", {
            inputs: `<|system|>\n${character}\n<|user|>\n${userPrompt}\n<|assistant|>\n`
        }, {
            headers: { "Content-Type": "application/json" }
        });

        // Простий та надійний розбір відповіді від Hugging Face
        if (response.data && response.data[0] && response.data[0].generated_text) {
            let fullText = response.data[0].generated_text;
            // Прибираємо технічний текст промпту, залишаючи тільки чисту відповідь ШІ
            let aiReply = fullText.split("<|assistant|>\n")[1] || fullText;
            return res.status(200).json({ reply: aiReply.trim() });
        } else {
            return res.status(200).json({ reply: `⚠️ Сталася помилка відповіді системи... (⁠＞⁠﹏⁠＜⁠)` });
        }

    } catch (error) {
        return res.status(200).json({ reply: `❌ Квантовий збій! Астра оновлює модулі зв'язку... (⁠｡⁠✖⁠╭⁠╮⁠✖⁠｡⁠)` });
    }
}
