# n8n Environment Variables Setup

## Required API Keys & Tokens

### 1. WhatsApp Business API
```bash
# Get from Meta Business Manager
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

### 2. Google Gemini AI
```bash
# Get from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key
```

### 3. n8n Configuration
```bash
# n8n settings
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=https://your-n8n-domain.com
```

## Setup Steps

### Step 1: WhatsApp Business API Setup
1. Go to Meta Business Manager
2. Create WhatsApp Business Account
3. Get Phone Number ID and Access Token
4. Set webhook URL: `https://your-n8n-domain.com/webhook/whatsapp-webhook`

### Step 2: n8n Installation & Configuration
```bash
# Install n8n
npm install n8n -g

# Set environment variables
export GEMINI_API_KEY="your_key_here"
export WHATSAPP_ACCESS_TOKEN="your_token_here"
export WHATSAPP_PHONE_NUMBER_ID="your_phone_id_here"

# Start n8n
n8n start
```

### Step 3: Import Workflow
1. Open n8n at http://localhost:5678
2. Go to Workflows → Import from File
3. Upload the `n8n-whatsapp-workflow.json` file
4. Activate the workflow

### Step 4: Test Integration
```bash
# Send test message to your WhatsApp Business number
# Message: "मुझे बुखार है" (I have fever)
# Expected: AI response in Hindi with medical advice
```

## Webhook URLs
- **WhatsApp Webhook:** `https://your-domain.com/webhook/whatsapp-webhook`
- **Verification:** Use the verify token from Meta Business Manager
- **n8n Webhook:** Automatically generated when workflow is active

## Troubleshooting
- Check n8n logs: `n8n start --log-level debug`
- Verify webhook URL is accessible publicly
- Ensure all environment variables are set
- Test API keys individually before integration