# 🩺 YOGIC.ai - Rasa Health Assistant

**Government-validated health responses with emergency detection capabilities**

## 🌟 Features

- **Emergency Detection** - Immediate 108 referrals for critical symptoms
- **Government Validated** - Responses based on Ministry of Health guidelines
- **Multilingual Support** - Hindi and English with regional language support
- **Safe Medication Guidance** - No risky suggestions, official dosage guidelines
- **Formatted Responses** - Bold highlighting for important medical information
- **Age-specific Advice** - Pediatric, adult, and elderly care recommendations

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the Model
```bash
python train_and_run.py
```

### 3. Run YOGIC.ai
```bash
# Terminal 1: Start action server
rasa run actions

# Terminal 2: Start Rasa server
rasa run --enable-api --cors "*"

# Terminal 3: Test in shell
rasa shell
```

## 🏥 Health Capabilities

### Emergency Detection
- **Chest Pain** → Immediate 108 referral
- **Breathing Difficulty** → Emergency protocol
- **Severe Symptoms** → Critical care guidance

### Medical Guidance
- **Fever Management** (Ministry of Health guidelines)
- **Headache Relief** (AIIMS protocols)
- **Cough Treatment** (National Health Portal)
- **Diabetes Care** (National Diabetes Programme)
- **Vaccination Info** (CoWIN integration)

### Safety Features
- **No Risky Suggestions** - Conservative medical advice
- **Professional Referrals** - Always recommends doctor consultation
- **Emergency Numbers** - 108, 1075, mental health helplines
- **Age Validation** - Specialized advice for children/elderly

## 🔧 Integration with YOGIC.ai Backend

### API Integration
```python
# Replace existing chat route with Rasa integration
import requests

def get_rasa_response(message, user_id):
    rasa_url = "http://localhost:5005/webhooks/rest/webhook"
    payload = {
        "sender": user_id,
        "message": message
    }
    response = requests.post(rasa_url, json=payload)
    return response.json()
```

### Update Backend Route
```javascript
// In backend/routes/chat.js
const axios = require('axios');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    const userId = req.user._id;

    // Send to Rasa
    const rasaResponse = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
      sender: userId,
      message: message
    });

    const aiResponse = rasaResponse.data[0]?.text || "I'm here to help with your health questions.";

    // Save to user history
    const user = await User.findById(userId);
    if (user) {
      user.chatHistory.push({
        message: message.trim(),
        response: aiResponse,
        timestamp: new Date()
      });
      await user.save();
    }

    res.json({
      response: aiResponse,
      confidence: 0.95,
      source: 'YOGIC.ai Rasa Model',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Rasa chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'Sorry, I\'m having technical difficulties. For emergencies, please call 108.'
    });
  }
});
```

## 📊 Training Data Sources

- **Ministry of Health & Family Welfare** guidelines
- **AIIMS** medical protocols
- **National Health Portal** recommendations
- **CoWIN** vaccination data
- **WHO** international standards
- **Emergency Services** protocols (108, 1075)

## 🛡️ Safety Protocols

1. **Emergency Keywords** → Immediate 108 referral
2. **Critical Symptoms** → Hospital recommendation
3. **Medication Queries** → Safe dosage only
4. **Age Validation** → Specialized care referrals
5. **Mental Health** → Crisis helpline numbers

## 🌐 Multilingual Support

- **English** - Primary language
- **Hindi** - Full translation support
- **Regional Languages** - Basic support (expandable)

## 📱 Testing Examples

```
User: "I have chest pain"
YOGIC.ai: "🚨 CHEST PAIN - EMERGENCY PROTOCOL
CALL 108 NOW - Don't delay!
• Sit upright, don't lie down
• Loosen tight clothing..."

User: "मुझे बुखार है"
YOGIC.ai: "**Fever Management Guidelines**
**Immediate Care:**
• **Rest** and stay hydrated
• Take **Paracetamol** (500mg)..."
```

## 🔄 Continuous Learning

The model can be retrained with new health data:
```bash
# Add new training examples to data/nlu.yml
# Retrain model
rasa train

# Test improvements
rasa shell
```

## 📞 Emergency Integration

- **108** - National Emergency
- **1075** - COVID Helpline  
- **1091** - Women Helpline
- **9152987821** - Mental Health

---

**Made with ❤️ for Smart India Hackathon 2024**
**Validated by Government Health Guidelines**