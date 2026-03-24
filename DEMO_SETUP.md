# ProofMind Demo Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+
- Python 3.8+ (for SDK testing)
- Git

### 2. Clone & Install
```bash
cd d:\hackathon\Open-track-projects\proofmind-lov
npm install
cd backend && npm install
```

### 3. Environment Setup (Mock Mode)
```bash
# Backend
cd backend
cp .env.example .env
```

Edit `.env` with mock values:
```env
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_KEY=mock_key_for_demo
SUPABASE_URL=https://demo.supabase.co
SUPABASE_KEY=mock_key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=mock_aws_key
AWS_SECRET_ACCESS_KEY=mock_aws_secret
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
PORT=3001
```

### 4. Start Demo Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd ..
npm run dev
```

### 5. Access Demo
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Dashboard: http://localhost:5173/dashboard

## Demo Video Script (10 minutes)

### Scene 1: Problem Introduction (2 min)
**Script:** "Enterprise AI is everywhere - banks approving loans, hospitals diagnosing patients, insurance companies processing claims. But when regulators ask 'prove your AI made this decision', companies can only show internal logs that they control and can modify. ProofMind solves this with immutable, blockchain-anchored audit trails."

**Show:** 
- Landing page hero section
- Problem section with regulatory requirements

### Scene 2: Solution Overview (2 min)
**Script:** "ProofMind creates cryptographic fingerprints of AI decisions and anchors them to Hedera blockchain in real-time. The enterprise keeps all data private - only hashes leave their infrastructure. These records cannot be altered by anyone, creating a neutral source of truth for regulators."

**Show:**
- Architecture diagram
- Data flow visualization
- "What leaves vs stays" section

### Scene 3: SDK Integration (2 min)
**Script:** "Integration is one line of code. Wrap any AI inference with our SDK decorator, and every decision gets automatically notarized to the blockchain."

**Show:**
- Code showcase section
- Python SDK example
- Interactive demo

### Scene 4: Live Dashboard (2 min)
**Script:** "The enterprise dashboard shows real-time AI activity, model versions in use, and any anomalies detected. Compliance officers can monitor everything from one place."

**Show:**
- Dashboard with live metrics
- Model registry
- Anomaly alerts

### Scene 5: Regulator Portal (2 min)
**Script:** "Regulators get direct access to verify any AI decision independently. They can query the blockchain directly without going through the enterprise, ensuring complete transparency."

**Show:**
- Regulator portal
- Verification interface
- Query results

## Demo Data Generator

Create realistic demo data: