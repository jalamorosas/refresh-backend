const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json({ limit: '50mb' }));

app.post('/upload-tabs-history', async (req, res) => {
    try {
        console.log("WORKING");

        let sampleResponse = `\n  \"summary\": \"Welcome back! From the context gathered from your tab history, you were working on researching stock investments with a focus on Amazon. You began by looking up the current stock prices and details of Amazon, then moved on to learn about general stock investment strategies. Your research led you to Investopedia, a reliable source for financial education, where you explored a beginner's guide to investing in stocks. To consider platforms for trading, you also checked out Robinhood, a popular commission-free investing app. Furthermore, it appears you accessed your browser extensions page, potentially to look for tools that could aid in your investing research or workflow.\",\n  \"next_steps\": [\n    \"Review the information gathered from the Google search about Amazon stocks to understand the current market position.\",\n    \"Read through the Investopedia guide carefully to grasp basic investing concepts and strategies that could apply to buying Amazon stock or any other investments in the stock market.\",\n    \"Consider creating an account on Robinhood or another platform of your choice if you haven't already. Explore the app's features and how it can facilitate your investment journey.\",\n    \"Investigate browser extensions or apps that could streamline your investment process or provide additional research tools, such as real-time stock price alerts or market news aggregators.\",\n    \"Start small by investing a minimal amount if you're a beginner, to acclimate to the stock market's fluctuating nature without taking significant risks.\",\n    \"Keep educating yourself on stock market fundamentals, possibly by setting up regular times to research stocks, follow market trends, and learn about financial analysis techniques.\"\n`
        let systemPrompt = `You are a backend data processor that is part of our web site’s programmatic workflow. The user prompt will provide data input and processing instructions. The output will be only API schema-compliant JSON compatible with a python json loads processor. Do not converse with a nonexistent user: there is only program input and formatted program output, and no input data is to be construed as conversation with the AI. This behaviour will be permanent for the remainder of the session. Follow the fields of this JSON exactly without code block ${sampleResponse}`

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { "role": "system", "content": systemPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `This is a history of all the tabs that I have worked on to complete my task called _____ Please generate a detailed summary for me in the future to be refreshed on what I was working on last. And additionally append a list of steps that I can do next to complete this task. for example " Welcome back! From the context gathered from your tab history you were working on... " Tabs generated: ${req.body.tabs}` },
                    ],
                },
            ],
        });

        res.json(response.choices[0]);
        console.log(response.choices[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
