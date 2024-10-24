# ChatGPT-like Interface with Multiple Models

This project is a ChatGPT-like interface built using HTML, JavaScript, and a backend API. Users can interact with different language models via a simple interface where they can type in a prompt and receive responses from the selected model. The project supports multiple language models and includes an "All" option that allows querying all available models simultaneously.

## Features

- **Multiple Models**: Choose from various language models like LLaMA 3.1, LLaMA 2, LLaMA 2 Uncensored, and Mistral.
- **User-Friendly Interface**: A clean, easy-to-use chat interface with real-time interaction.
- **Loading Indicator**: Display loading dots while the server is processing the request.
- **Scrollable Chat**: Previous conversations are scrollable, and both user queries and bot responses are preserved.
- **Support for Enter Key**: Users can submit the query by pressing the "Enter" key or clicking the "Send" button.

## Available Models

The following models are available for querying:

1. **LLaMA 3.1** (`llama3.1:latest`)
2. **LLaMA 2** (`llama2:latest`)
3. **LLaMA 2 Uncensored** (`llama2-uncensored:latest`)
4. **Mistral** (`mistral:latest`)
5. **All**: Query all the above models simultaneously and get their responses in a side-by-side format.

## How It Works

Users can select a model from the dropdown menu, type a prompt in the input box, and either press the **Enter** key or click the **Send** button to submit the query. The selected model processes the request, and the response is displayed in the chat window. If the user selects **"All"**, responses from all models are displayed in separate columns.

## Project Structure

/project-folder
    ├── public/                 # Public directory for client-side files
    │   ├── index.html          # Main HTML file for the user interface
    │   ├── styles.css          # External CSS file for styling
    │   └── script.js           # JavaScript file for client-side logic
    ├── server.js               # Express.js server to handle API requests
    ├── .env.example            # Example environment variables
    ├── .env                    # Actual environment variables (created after copying .env.example)
    └── README.md               # Project description and usage instructions


### Requirements

- **Node.js** (for the backend)
- **Express.js** (for the server)
- A backend API that serves requests to the selected models.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the `.env.example` file to `.env` and update it with your API base URL and the port:
   ```bash
   cp .env.example .env
   ```

3. Open the `.env` file and add your API base URL and port:
   ```
   API_URL=http://localhost:3000  # Example API base URL
   PORT=3000                              # Example port
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Open the `index.html` file in a web browser or visit `http://localhost:3000` if using an Express server.

## API Endpoints

The backend is an API that handles requests to the language models. The API accepts POST requests with a prompt and the selected model.

### API Endpoint

```
POST /api/query
```

### Request Format

The API expects a POST request with a JSON body containing the following parameters:

- `prompt`: The text prompt the user wants to send to the model.
- `model`: The model to query (e.g., `llama3.1:latest`, `llama2:latest`, `llama2-uncensored:latest`, `mistral:latest`, or `all`).

#### Sample Request

```bash
POST http://localhost:3000/api/query
Content-Type: application/json

{
  "prompt": "Explain the benefits of Node.js",
  "model": "llama3.1:latest"
}
```

### Sample Response (Single Model)

```json
{
  "response": "Node.js is a JavaScript runtime built on Chrome's V8 engine that enables server-side scripting, event-driven, and asynchronous programming."
}
```

### Sample Request for "All" Models

```bash
POST http://localhost:3000/api/query
Content-Type: application/json

{
  "prompt": "What is the capital of France?",
  "model": "all"
}
```

### Sample Response (All Models)

```json
{
  "llama3.1:latest": "The capital of France is Paris.",
  "llama2:latest": "The capital city of France is Paris.",
  "llama2-uncensored:latest": "Paris is the capital of France.",
  "mistral:latest": "The capital of France is Paris."
}
```

## Client-Side Flow

1. **User Input**: The user selects a model and types a prompt in the input box.
2. **Submit Request**: The user can submit by pressing **Enter** or clicking the **Send** button.
3. **Loading Dots**: Loading dots are displayed while the server processes the query.
4. **Response**: Once the response is received, it is displayed in the chat window. For the **"All"** option, responses are shown side by side in different columns.

## Future Enhancements

- **Error Handling**: Improve error handling for network issues or invalid model selections.
- **Model Descriptions**: Add tooltips or descriptions for each model in the UI.
- **Mobile Optimization**: Enhance the UI to be more responsive on mobile devices.

## License

This project is open-source and licensed under the [MIT License](LICENSE).

