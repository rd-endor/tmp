# ✉️ Email Signature Studio

A full-stack email signature generator featuring a **Node.js (React + Vite + Tailwind CSS)** frontend, a **Python (FastAPI + SQLite)** backend, user authentication, credit card tokenization & vault, live multi-template rendering, and 1-click rich-text export for Gmail, Apple Mail, and Outlook.

---

## 🌟 Key Features

- **🎨 Multi-Template Email Signature Engine**:
  - *Modern Horizon*: Sleek horizontal layout with accent bar, headshot, logo, and inline social badges.
  - *Corporate Classic*: High-compatibility 2-column layout with vertical divider.
  - *Minimalist Clean*: Text-focused, clean typography for everyday emails.
  - *Branded Card*: Framed card format with header logo and call-to-action button.
  - *Compact Pro*: Single-line compact style optimized for mobile reply chains.
- **🔐 User Authentication & Strong Passwords**:
  - Username & password sign-up and sign-in with PBKDF2 cryptographic hashing and JWT session tokens.
  - Enforced strong password policy (8+ chars, uppercase, lowercase, numbers, special characters) with real-time UI strength meter.
- **💳 Credit Card Tokenization & Vault**:
  - PCI DSS-compliant tokenization vault (`tok_<brand>_<hash>`).
  - Card number Luhn algorithm validation & brand detection (Visa, Mastercard, Amex, Discover).
  - Safe masked storage (only token, brand, expiry, and `last4` are stored).
- **💾 Cloud/Database Persistence**:
  - Save, edit, duplicate, browse, and delete custom signatures backed by **SQLite** via SQLAlchemy.
- **🖼️ Logo & Branding Integration**:
  - Preloaded repository assets (`endor-labs-logo-2.png`, `endor-labs-logo-ss.png`).
  - Custom logo and avatar upload capability.
- **📋 1-Click Export**:
  - **Copy Rich Signature**: Direct rich-text clipboard copy for instant pasting into Gmail, Outlook, or Apple Mail.
  - **Copy Raw HTML**: For CMS or email tool templates.
  - **Download HTML File**: Standalone `.html` file export.
- **📱 Live Simulated Email Client**:
  - Real-time preview with Gmail and Outlook mock composer windows, plus desktop/mobile view toggle.

---

## 📁 Repository Structure

```text
.
├── backend/
│   ├── Dockerfile           # Backend container definition
│   ├── auth.py              # PBKDF2 password hashing & JWT token handling
│   ├── database.py          # SQLite engine & session setup
│   ├── main.py              # FastAPI app, CORS, routes & static mounts
│   ├── models.py            # SQLAlchemy models (User, Signature, PaymentMethod)
│   ├── requirements.txt     # Python backend dependencies
│   ├── schemas.py           # Pydantic request/response models & password rules
│   ├── static/              # Served static files (logos & user uploads)
│   ├── test_api.py          # Automated API test suite
│   └── tokenization.py      # Luhn check, card brand detector & token vault
├── frontend/
│   ├── Dockerfile           # Multi-stage frontend container (Node build -> Nginx)
│   ├── nginx.conf           # Nginx reverse proxy configuration
│   ├── index.html           # HTML entry point
│   ├── package.json         # Node.js dependencies (React, Vite, Tailwind)
│   ├── vite.config.js       # Vite configuration with API proxy
│   └── src/
│       ├── api/             # Axios API client (Auth, Signatures, Payments, Logos)
│       ├── components/      # UI components (Header, BillingModal, Auth, Preview)
│       ├── context/         # AuthContext state management
│       ├── templates/       # Bulletproof HTML signature generators
│       └── types/           # Template definitions & color palettes
├── docker-compose.yml       # Multi-container orchestration (Backend + Frontend)
├── endor-labs-logo-2.png     # Logo asset
├── endor-labs-logo-ss.png    # Square/Compact logo asset
├── start.sh                 # One-click start script for local dev
└── README.md
```

---

## 🚀 Quick Start

### 1. Docker Compose (Recommended for Containers)

Spin up both containerized services with Docker Compose:

```bash
docker compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Launch with `start.sh` (Local Development)

Run the convenient local start script:

```bash
./start.sh
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 3. Manual Setup & Running

#### Backend (Python + FastAPI + SQLite)

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend (Node.js + React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests

To run the automated backend test suite:

```bash
PYTHONPATH=backend ./backend/venv/bin/pytest backend/test_api.py -v
```

To run the frontend production build test:

```bash
cd frontend && npm run build
```

---

## 💡 How to Use the Generated Signatures

1. Customize your details (Name, Job Title, Department, Company, Social Profiles, Logo).
2. Choose your preferred template and brand colors in the **Design** tab.
3. In the live preview pane, click **"Copy Rich Signature"**.
4. Open your email client:
   - **Gmail**: Go to *Settings &rarr; See all settings &rarr; General &rarr; Signature*, click *Create new*, and press **Ctrl+V / Cmd+V**.
   - **Outlook**: Go to *Settings &rarr; Mail &rarr; Signatures*, click *New*, and paste into the editor.
   - **Apple Mail**: Go to *Mail &rarr; Settings &rarr; Signatures*, add a new signature, and paste.
5. Save your email client settings and you're ready to go!