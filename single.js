const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const ollamaApiUrl = process.env.OLLAMA_API_URL;

const model_names = {
    'llama3': 'llama3.1:latest',
    'llama2': 'llama2:latest',
    'llama2-uncensored': 'llama2-uncensored:latest',
    'mistral': 'mistral:latest',
};

app.use(express.static('public'));  // Serve static files like HTML
app.use(express.json());

app.post('/api/query', async (req, res) => {
    const { prompt, model } = req.body;

    if (!prompt || !model) {
        return res.status(400).json({ error: 'Prompt and model are required' });
    }
    try {
        const response = await axios.post(ollamaApiUrl, {
            model: model,  // Use the selected model
            prompt: prompt
        });

        const jsonChunks = response.data.split('\n');
        let fullResponse = '';

        jsonChunks.forEach(chunk => {
            if (chunk.trim()) {
                try {
                    const parsedChunk = JSON.parse(chunk);
                    fullResponse += parsedChunk.response;
                } catch (error) {
                    console.error("Error parsing chunk:", error);
                }
            }
        });

        let htmlFormattedResponse = fullResponse
            .replace(/\n\n/g, '<p></p>') 
            .replace(/\n/g, '<br>') 
            .replace(/(\*\*[^*]+\*\*)/g, '<strong>$1</strong>') 
            .replace(/(\d+\. )/g, '<br>$1')
            .replace(/([^*])\*\*([^*]+)\*\*([^*])/g, '$1$2$3');

        res.status(200).json({ response: htmlFormattedResponse });
    } catch (error) {
        console.error('Error querying Ollama:', error.message);
        res.status(500).json({ error: 'Error querying the Ollama model' });
    }
});

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});