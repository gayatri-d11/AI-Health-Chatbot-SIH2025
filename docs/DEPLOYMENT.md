# Deployment Guide - Health Chatbot

## Quick Deploy (Free Tier - 48 Hours)

### 1. Backend Deployment (Render.com)

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/health-chatbot.git
git push -u origin main

# 2. Deploy on Render
# - Connect GitHub repo
# - Build Command: cd backend && npm install
# - Start Command: cd backend && npm start
# - Environment: Node.js
```

**Environment Variables on Render:**
```
DATABASE_URL=postgresql://user:pass@hostname:5432/dbname
RASA_URL=http://your-rasa-server:5005
WHATSAPP_ACCESS_TOKEN=your_token
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

### 2. Database Setup (Render PostgreSQL)

```bash
# Create database on Render (Free tier: 1GB)
# Copy connection string to DATABASE_URL
# Run migrations:
psql $DATABASE_URL < backend/models/database.sql
```

### 3. Rasa Deployment (Railway.app)

```bash
# Create Dockerfile for Rasa
cat > rasa/Dockerfile << EOF
FROM rasa/rasa:3.6.0
COPY . /app
WORKDIR /app
USER root
RUN rasa train
EXPOSE 5005
CMD ["rasa", "run", "--enable-api", "--cors", "*", "--port", "5005"]
EOF

# Deploy on Railway
# - Connect GitHub repo
# - Select rasa folder
# - Auto-deploy on push
```

### 4. Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Or connect GitHub repo to Vercel dashboard
```

### 5. WhatsApp Setup (Meta Cloud API)

1. Go to developers.facebook.com
2. Create app → Business → WhatsApp
3. Get access token and phone number ID
4. Set webhook URL: `https://your-backend.onrender.com/api/whatsapp/webhook`
5. Verify token: `your_verify_token_123`

### 6. SMS Setup (Twilio Free Trial)

1. Sign up at twilio.com
2. Get Account SID, Auth Token, Phone Number
3. Configure webhook: `https://your-backend.onrender.com/api/sms/webhook`

## Production Scaling

### Cost-Effective Scaling Options

1. **Backend**: Render Pro ($7/month) or Railway Pro ($5/month)
2. **Database**: Render PostgreSQL ($7/month) or Supabase ($25/month)
3. **Rasa**: Self-hosted on DigitalOcean ($5/month droplet)
4. **Frontend**: Vercel Pro ($20/month) or Netlify Pro ($19/month)

### Performance Optimizations

```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache frequent responses
app.use('/api/chat', async (req, res, next) => {
  const cacheKey = `chat:${req.body.message}:${req.body.language}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  next();
});
```

### Monitoring Setup

```javascript
// Add basic monitoring
const monitoring = {
  requests: 0,
  errors: 0,
  responseTime: []
};

app.use((req, res, next) => {
  const start = Date.now();
  monitoring.requests++;
  
  res.on('finish', () => {
    monitoring.responseTime.push(Date.now() - start);
  });
  
  next();
});

app.get('/metrics', (req, res) => {
  res.json(monitoring);
});
```

## Security Checklist

- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Input validation implemented
- [ ] Database queries parameterized
- [ ] CORS configured properly
- [ ] API keys rotated regularly

## Backup Strategy

```bash
# Database backup (daily cron)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Upload to cloud storage
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-backup-bucket/
```

## Troubleshooting

### Common Issues

1. **Rasa not responding**: Check server logs, restart service
2. **WhatsApp webhook failing**: Verify SSL certificate, check logs
3. **Database connection timeout**: Check connection string, restart DB
4. **Translation API limits**: Implement fallback translations

### Health Checks

```bash
# Backend health
curl https://your-backend.onrender.com/health

# Rasa health
curl https://your-rasa.railway.app/

# Database health
psql $DATABASE_URL -c "SELECT 1;"
```

## Cost Breakdown (Monthly)

**Free Tier (MVP)**:
- Render Backend: $0 (750 hours/month)
- Render PostgreSQL: $0 (1GB limit)
- Railway Rasa: $0 (512MB RAM)
- Vercel Frontend: $0
- WhatsApp Cloud API: $0 (1000 messages)
- Twilio SMS: $0 (trial credits)
- **Total: $0/month**

**Production Ready**:
- Render Pro: $7
- PostgreSQL: $7
- Railway Pro: $5
- Vercel Pro: $20
- WhatsApp Business: $0 (pay per message)
- Twilio: $20 (SMS credits)
- **Total: $59/month**