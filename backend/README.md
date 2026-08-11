# ⚙️ x402 Agentic Commerce — Backend Service

The backend core API service for **x402 Agentic Commerce**, providing AI agent research planning, Algorand TestNet blockchain micropayments, Policy Decision Point (PDP) spend enforcement, and real-time Socket.IO telemetry.

---

## 🚀 Technologies

- **Node.js & Express 4** (TypeScript)
- **MongoDB & Mongoose ODM**
- **Socket.IO** (Real-time events)
- **Google Gemini API** (`@google/genai`, `gemini-2.5-flash`)
- **Algorand SDK** (`algosdk`)
- **Swagger UI** (API documentation at `/api-docs`)

---

## 🔒 Security & Secrets Warning

> ⚠️ **DO NOT COMMIT SECRETS**: `.env` and all private key files (`*.pem`, `*.key`) are strictly ignored in `.gitignore`. Always keep credentials secure.

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure Environment
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, and WALLET_MNEMONIC

# 3. Seed initial database data
npm run seed

# 4. Start development server
npm run dev
```

The server will run on `http://localhost:5000`. Swagger documentation is available at `http://localhost:5000/api-docs`.

---

## 📄 Full Project Documentation

For complete architecture details, API specs, and frontend integration, see the root [README.md](../README.md).
