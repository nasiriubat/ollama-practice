const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const ollamaApiUrl = process.env.API_URL;

const model_names = {
    'llama3': 'llama3.1:latest',
    'llama2': 'llama2:latest',
    'llama2-uncensored': 'llama2-uncensored:latest',
    'mistral': 'mistral:latest',
};

app.use(express.static('public'));
app.use(express.json());

app.post('/api/query', async (req, res) => {
    const { prompt, model } = req.body;

    if (!prompt || !model) {
        return res.status(400).json({ error: 'Prompt and model are required' });
    }

    try {
        if (model === 'all') {
            // Query all models
            const allModelResponses = {};

            for (const modelName in model_names) {
                const response = await axios.post(ollamaApiUrl, {
                    model: model_names[modelName],
                    prompt: prompt,
                });

                allModelResponses[model_names[modelName]] = beautifyResponse(response.data.split('\n'));
            }

            res.status(200).json(allModelResponses);
        } else {
            // Query a single model
            const response = await axios.post(ollamaApiUrl, {
                model: model,
                prompt: prompt,
            });

            res.status(200).json({ response: beautifyResponse(response.data.split('\n')) });
        }
    } catch (error) {
        console.error('Error querying Ollama:', error.message);
        res.status(500).json({ error: 'Error querying the Ollama model' });
    }
});

// Function to beautify the response data for better HTML formatting
function beautifyResponse(jsonChunks) {
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

    let formattedResponse = fullResponse
        .replace(/\n\n/g, '<p></p>')
        .replace(/\n/g, '<br>')
        .replace(/(\*\*[^*]+\*\*)/g, '<strong>$1</strong>')
        .replace(/(\d+\. )/g, '<br>$1')
        .replace(/([^*])\*\*([^*]+)\*\*([^*])/g, '$1$2$3');


    return formattedResponse;
}

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});
