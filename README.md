# Bet AI Analyzer ⚽️🤖

A Node.js/TypeScript backend that leverages Google Gemini 2.5 Flash to extract betting data from images (soccer betting slips) and automatically post formatted summaries to a Telegram Channel.

## 🚀 Features

### OCR & AI Analysis

- Uses Gemini 2.5 Flash to accurately read match details, odds, and potential winnings from photos.

### Modular Architecture

- Clean separation between the main server logic and the API routing.

### Dynamic System Prompt

- Customize the AI behavior and message style via a dedicated Markdown file without changing the code.

### Telegram Integration

- Instant reporting to your chosen Telegram channel using a Bot.

### TypeScript Core

- Fully typed for better reliability and maintenance.

## 🛠 Prerequisites

- Node.js (v18 or higher recommended)
- Gemini API Key: Get it for free at [Google AI Studio](https://aistudio.google.com/)
- Telegram Bot Token: Create one via [@BotFather](https://t.me/botfather)

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd bet-analyzer-ai
```

2. Install dependencies:

```bash
npm install
```

3. Setup the directory structure:

```bash
mkdir uploads
mkdir prompts
```

4. Create your prompt file in `prompts/bet_instructions.md`.

## ⚙️ Configuration

Open `server.ts` and replace the placeholder values with your credentials:

```typescript
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN";
const TELEGRAM_CHANNEL_ID = "@your_channel_name";
```

## 🚀 Running the App

### Development Mode

```bash
npx ts-node server.ts
```

## Production Mode

1. Compile to JavaScript:

```bash
npx tsc
```

2. Run the server:

```bash
node dist/server.js
```

## 📝 API Usage

Analyze a Betting

Send a `POST` request to `/api/analyze-bet` with the image in the `multipart/form-data` body.

- **URL**: `http://localhost:3000/api/analize-bet`
- **Method**: POST
- **Body**: `bet` (file)

Example with cURL:

```bash
curl -X POST -F "bet=@/path/to/your/image.jpg" http://localhost:3000/api/analyze-bet?channel=<public|vip>
```

## 📂 Project Structure

- `server.ts`: Entry point and global configuration.
- `analyze-router.ts`: API routes and logic for image processing and AI interaction.
- `prompts/`: Contains .md files for the AI System Prompt.
- `uploads/`: Temporary storage for uploaded images (auto-cleaned).

## 📄 License

This project is licensed under the MIT License.
