import axios from 'axios';

const prompt = 'Explain the benefits of Node.js';

async function queryOllama(prompt) {
    try {
        // Initialize an empty array to collect responses
        let fullResponse = '';
        let done = false;

        // Loop until we receive the complete response
        while (!done) {
            const response = await axios.post('http://127.0.0.1:11434/api/generate', {
                model: 'tinyllama',
                prompt: prompt
            });
            
            // Append the current fragment to fullResponse
            fullResponse += response.data.response;

            // Check if it's done generating
            done = response.data.done;
        }

        // Log the complete response
        console.log('Complete Ollama Response:', fullResponse);
    } catch (error) {
        console.error('Error querying Ollama:', error);
    }
}

queryOllama(prompt);
