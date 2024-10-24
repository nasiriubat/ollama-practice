let isLoading = false;

// Listen for the 'click' event on the submit button
document.getElementById('send-btn').addEventListener('click', async () => {
    handleSubmit();
});

// Listen for the 'keydown' event on the input field and trigger submit on 'Enter'
document.getElementById('prompt-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent default form submission behavior
        handleSubmit();
    }
});

async function handleSubmit() {
    if (isLoading) return; // Prevent multiple clicks/entries while loading

    const prompt = document.getElementById('prompt-input').value;
    const model = document.getElementById('model').value;  // Get the selected model

    // Display user input in the chat box
    if (prompt.trim() !== '') {
        appendMessage(prompt, 'user', 'User');
        document.getElementById('prompt-input').value = '';

        // Show loading dots
        showLoadingDots();

        // Send user input and selected model to the server
        try {
            isLoading = true;
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, model }),  // Send both prompt and model
            });
            const data = await response.json();
            isLoading = false;

            // Hide loading dots
            hideLoadingDots();

            if (model === 'all') {
                // Display responses in the respective columns
                appendMessage(data['llama3.1:latest'], 'bot', 'LLaMA 3.1');
                appendMessage(data['llama2:latest'], 'bot', 'LLaMA 2');
                appendMessage(data['llama2-uncensored:latest'], 'bot', 'LLaMA 2 Uncensored');
                appendMessage(data['mistral:latest'], 'bot', 'Mistral');
            } else {
                // Display the server response in the chat box for single model
                appendMessage(data.response, 'bot', model);
            }
        } catch (error) {
            isLoading = false;
            hideLoadingDots();
            appendMessage('Error fetching response from the server.', 'bot');
            console.error('Error:', error);
        }
    }
}

function appendMessage(message, sender, model) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.innerHTML = '<b>' + model + ' :</b> ' + message.replace(/\n/g, '<br>');  // Preserve line breaks in the response
    chatBox.appendChild(messageElement);

    // Scroll to the bottom after adding a new message
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoadingDots() {
    const chatBox = document.getElementById('chat-box');
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-dots';
    loadingElement.className = 'loading-dots';
    loadingElement.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    chatBox.appendChild(loadingElement);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

function hideLoadingDots() {
    const loadingElement = document.getElementById('loading-dots');
    if (loadingElement) {
        loadingElement.remove();
    }
}
