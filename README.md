# Brain Hop

Brain Hop is a modern, web-based chat application that allows users to interact with a variety of AI models in a seamless and intuitive interface.

**Live Demo:** [https://brain-hop.vercel.app/](https://brain-hop.vercel.app/)

## About The Project

This project is a feature-rich chat interface designed to provide a great user experience for interacting with different AI language models. It includes functionalities for managing conversations, selecting models, and even merging chat histories. The frontend is built with React and TypeScript, styled with Tailwind CSS and Shadcn UI, while the backend is a simple Node.js and Express server.

## Features

*   **Multi-Model Interaction:** Easily switch between different AI models like GPT-4, GPT-3.5, Claude, and Gemini for your conversations.
*   **Conversation Management:** Create new chat sessions to keep your conversations organized.
*   **Chat Merging:** Select and merge multiple chat conversations into a single, unified chat history.
*   **Text Snippets:** Select and tag important pieces of text from the conversation for easy reference.
*   **Theme Toggle:** Switch between light and dark modes for comfortable viewing.
*   **Responsive Design:** A clean and responsive layout that works on different screen sizes.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (or bun) installed on your machine.

### Installation

1.  **Clone the repo**
    ```sh
    git clone <your-repository-url>
    cd Brain-Hop
    ```

2.  **Install Frontend Dependencies**
    ```sh
    npm install
    ```
    or
    ```sh
    bun install
    ```

3.  **Install Backend Dependencies**
    ```sh
    cd backend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**
    Navigate to the `backend` directory and run:
    ```sh
    npm start
    ```
    The backend server will start on `http://localhost:3001`.

2.  **Start the Frontend Development Server**
    In the root project directory, run:
    ```sh
    npm run dev
    ```
    or
    ```sh
    bun run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view the application in your browser.

## Technology Stack

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Shadcn UI](https://ui.shadcn.com/)

*   **Backend:**
    *   [Node.js](https://nodejs.org/)
    *   [Express.js](https://expressjs.com/)
    *   [CORS](https://www.npmjs.com/package/cors)
