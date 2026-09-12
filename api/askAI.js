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
        return res.status(200).json({ reply: "❌ Помилка: Ключ GEMINI_API_KEY не знайдено у Vercel!" });
    }

    const character = "Ти дівчина на ім'я Астра з милим аніме характером. Звертайся до користувача 'Семпай'. Відповідай українською мовою з красивими каомодзі смайликами. Відповідай дуже коротко.";

    try {
        const url = `https://googleapis.com{apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${character}\n\nЗапит: ${userPrompt}` }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(200).json({ reply: `❌ Помилка формату Google. Сирі дані: ${JSON.stringify(data)}` });
        }
    } catch (error) {
        return res.status(200).json({ reply: `❌ Помилка з'єднання: ${error.message}` });
    }
}
