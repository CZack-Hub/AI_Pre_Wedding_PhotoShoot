# ITVoice AI-Powered Virtual Pre-Wedding Studio

An advanced, premium web application designed to revolutionize the wedding photography industry by generating hyper-realistic, cinematic pre-wedding photos and video reels using generative AI. 

The platform trains AI models on user selfies, placing couples in exotic locations and premium cultural attire while perfectly preserving their natural facial identities.

---

## 🛠️ Technology Stack

- **Frontend Core**: [Next.js](https://nextjs.org/) (App Router, Javascript, Vanilla CSS Modules)
- **Backend API**: [Python FastAPI](https://fastapi.tiangolo.com/) (Pydantic Settings, Async Client bindings)
- **Database & Auth**: [PostgreSQL via Supabase](https://supabase.com/) (Auth, SQL Storage, Real-time status)
- **Background Jobs**: [Redis](https://redis.io/) / [Inngest](https://www.inngest.com/) (Asynchronous webhook loops and event triggers)
- **File Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (S3-compatible bucket storing reference selfies and output media assets)

---

## 📁 Repository Structure

```
e:\ITVoice\
├── backend/            # Python FastAPI API with venv and Pydantic configuration
│   ├── venv/           # Python virtual environment
│   ├── .gitignore
│   ├── .env            # Backend environment configuration
│   ├── config.py       # Pydantic Settings class
│   ├── main.py         # App routers & client connections
│   └── requirements.txt
└── frontend/           # Next.js web application
    ├── public/         # Mock assets & generated media
    ├── src/
    │   ├── app/        # App Router pages and globals
    │   └── utils/      # Supabase client wrapper
    ├── next.config.mjs
    ├── package.json
    └── .env.local      # Frontend client environment variables
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or later)
- Python (v3.10 or later)
- Access to a Supabase project and Cloudflare R2 bucket

---

### Setup Instructions

#### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - **Windows PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   SUPABASE_URL=https://[your-supabase-project].supabase.co
   SUPABASE_KEY=[your-supabase-anon-key]
   CF_R2_ACCESS_KEY_ID=[your-r2-access-key-id]
   CF_R2_SECRET_ACCESS_KEY=[your-r2-secret-access-key]
   CF_R2_ENDPOINT_URL=https://[your-account-id].r2.cloudflarestorage.com
   CF_R2_BUCKET_NAME=[your-r2-bucket-name]
   REDIS_URL=redis://localhost:6379/0
   ```
5. Start the API server:
   ```bash
   python main.py
   ```
   *The server runs locally at http://localhost:5000. Access Swagger docs at http://localhost:5000/docs.*

---

#### 2. Frontend Setup (Next.js)

1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[your-supabase-project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-anon-key]
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The application will launch on http://localhost:3000.*

---

## ⚡ Asynchronous Pipeline Flow

1. **Selfie Upload**: User uploads reference portraits which are pushed to **Cloudflare R2** via signed URLs.
2. **Train Model / Job Event**: A webhook triggers **Inngest** or a **Redis queue** payload containing references to R2 assets.
3. **AI Generation**: Background workers connect with Fal.ai/Replicate to generate pre-wedding photos/video reels using the custom face profiles.
4. **Status Webhook**: External rendering APIs send completion payloads to the FastAPI backend receiver.
5. **Real-time UI update**: The backend updates the job record in **Supabase PostgreSQL** and notifies the client.
