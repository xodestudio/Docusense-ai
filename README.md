# 📄 Docusense AI – Chat with your PDFs

![Project Banner](https://via.placeholder.com/1280x640.png?text=Docusense+AI+Preview)
_(Note: Replace this link with a screenshot of your actual dashboard)_

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![NeonDB](https://img.shields.io/badge/Neon-Serverless_Postgres-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Docusense AI** is a production-ready SaaS application that leverages the power of Large Language Models (LLMs) to transform lengthy PDF documents into concise, actionable insights. Built with a focus on scalability, security, and user experience.

---

## ⚡ Key Features

### 🧠 AI & Logic

- **Smart Summarization:** Utilizes **Google Gemini AI** via **LangChain** to understand context and generate accurate summaries.
- **Vector Embeddings:** Efficient text chunking and parsing for handling large documents.
- **RAG Implementation:** Retrieval-Augmented Generation flow for precise data extraction.

### 🏗️ Architecture & UI

- **Next.js 16 (App Router):** Leveraging Server Actions, React Server Components (RSC), and Turbopack for lightning-fast performance.
- **Responsive Design:** Beautifully crafted UI using **ShadCN UI** and **Tailwind CSS 4**.
- **Interactive Viewer:** A polished PDF viewer and summary reel experience.

### 🔐 Security & Database

- **Robust Auth:** Enterprise-grade authentication via **Clerk** (Social Logins, MFA protection).
- **Serverless Database:** Scalable PostgreSQL storage using **NeonDB**.
- **Secure Uploads:** File handling managed by **UploadThing** with strict type validation.

### 💰 Monetization (SaaS)

- **Subscription Model:** Integrated **Stripe** checkout for Basic vs. Pro plans.
- **Webhook Handling:** Real-time synchronization of payment status and user access rights.
- **Usage Limits:** Logic to restrict Free tier usage vs. Pro tier capabilities.

---

## 🛠️ Tech Stack

| Category           | Technology                              |
| ------------------ | --------------------------------------- |
| **Framework**      | Next.js 16 (App Router)                 |
| **Language**       | TypeScript                              |
| **Styling**        | Tailwind CSS 4, ShadCN UI, Lucide Icons |
| **Authentication** | Clerk                                   |
| **Database**       | NeonDB (PostgreSQL)                     |
| **AI Model**       | Google Gemini Pro                       |
| **Orchestration**  | LangChain                               |
| **Payments**       | Stripe                                  |
| **File Storage**   | UploadThing                             |
| **Deployment**     | Vercel                                  |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository

```bash
git clone [https://github.com/xodestudio/Docusense-ai.git](https://github.com/xodestudio/Docusense-ai.git)
cd Docusense-ai
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory and set the following environment variables:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Neon)
DATABASE_URL=postgresql://user:password@ep-xyz.aws.neon.tech/neondb?sslmode=require

# AI & Processing
GOOGLE_API_KEY=AIzaSy...

# File Uploads
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📦 Screenshots

### Dashboard

![Dashboard Screenshot](https://via.placeholder.com/800x400.png?text=Dashboard+Screenshot)

### PDF Viewer

![PDF Viewer Screenshot](https://via.placeholder.com/800x400.png?text=PDF+Viewer+Screenshot)

### Summary Reel

![Summary Reel Screenshot](https://via.placeholder.com/800x400.png?text=Summary+Reel+Screenshot)

---

## 🤝 Contributing

Contributions are always welcome! This project is open-source.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or suggestions, reach out to **[Ali Haider](https://github.com/xodestudio)**.

- **LinkedIn:** [Ali Haider](https://www.linkedin.com/in/xodestudio)
- **Email:** [alidevofficial@gmail.com](mailto:alidevofficial@gmail.com)
- **Twitter:** [Ali Haider](https://twitter.com/xodestudio)
