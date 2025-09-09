# Rasa Training Guide - Health Chatbot

## Quick Training Setup (30 minutes)

### 1. Install Rasa

```bash
# Create virtual environment
python -m venv rasa-env
source rasa-env/bin/activate  # Windows: rasa-env\Scripts\activate

# Install Rasa
pip install rasa==3.6.0
pip install rasa[transformers]
```

### 2. Initialize and Train

```bash
cd rasa
rasa train

# Test the model
rasa shell
```

### 3. Start Rasa Server

```bash
# Start API server
rasa run --enable-api --cors "*" --port 5005

# In another terminal, start action server
rasa run actions --port 5055
```

## Training Data Enhancement

### Adding More Health Intents

```yaml
# Add to data/nlu.yml
- intent: ask_diabetes
  examples: |
    - diabetes symptoms
    - blood sugar high
    - मधुमेह के लक्षण
    - शुगर की बीमारी

- intent: ask_hypertension
  examples: |
    - high blood pressure
    - BP problem
    - उच्च रक्तचाप
    - हाई बीपी

- intent: ask_heart_disease
  examples: |
    - heart problem
    - chest pain
    - दिल की बीमारी
    - सीने में दर्द
```

### Custom Actions for Health Data

```python
# Create actions/actions.py
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

class ActionGetHealthAlerts(Action):
    def name(self) -> Text:
        return "action_get_health_alerts"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get user location
        location = tracker.get_slot("user_location") or "India"
        
        # Fetch alerts from backend
        try:
            response = requests.get(f"http://localhost:3000/api/alerts?location={location}")
            alerts = response.json()
            
            if alerts:
                message = f"स्वास्थ्य अलर्ट ({location}):\n"
                for alert in alerts[:3]:  # Show top 3
                    message += f"• {alert['message']}\n"
            else:
                message = "फिलहाल कोई स्वास्थ्य अलर्ट नहीं है।"
                
        except Exception as e:
            message = "अलर्ट जानकारी लेने में समस्या है।"
        
        dispatcher.utter_message(text=message)
        return []

class ActionSymptomChecker(Action):
    def name(self) -> Text:
        return "action_symptom_checker"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        symptom = tracker.get_slot("symptom")
        
        symptom_advice = {
            "fever": "बुखार में आराम करें, तरल पदार्थ पिएं। 102°F से ज्यादा हो तो डॉक्टर से मिलें।",
            "cough": "खांसी में गर्म पानी पिएं, भाप लें। 2 सप्ताह से ज्यादा हो तो जांच कराएं।",
            "headache": "सिरदर्द में आराम करें, पानी पिएं। तेज दर्द हो तो दवा लें।"
        }
        
        advice = symptom_advice.get(symptom, "कृपया अपने लक्षण स्पष्ट रूप से बताएं।")
        dispatcher.utter_message(text=advice)
        
        return []
```

### Training with Government Health Data

```python
# scripts/train_with_health_data.py
import pandas as pd
import yaml

def generate_training_data():
    # Load health FAQ data
    health_data = [
        {"intent": "ask_covid_vaccine", "examples": [
            "covid vaccine schedule",
            "when to get covid vaccine",
            "कोविड टीका कब लगवाएं",
            "कोरोना वैक्सीन"
        ]},
        {"intent": "ask_malaria", "examples": [
            "malaria symptoms",
            "malaria prevention",
            "मलेरिया के लक्षण",
            "मलेरिया से बचाव"
        ]}
    ]
    
    # Generate NLU data
    nlu_data = {"version": "3.1", "nlu": []}
    
    for item in health_data:
        nlu_data["nlu"].append({
            "intent": item["intent"],
            "examples": "|\n    - " + "\n    - ".join(item["examples"])
        })
    
    # Save to file
    with open("data/health_nlu.yml", "w", encoding="utf-8") as f:
        yaml.dump(nlu_data, f, allow_unicode=True, default_flow_style=False)

if __name__ == "__main__":
    generate_training_data()
```

## Model Optimization

### Hyperparameter Tuning

```yaml
# config.yml optimization
pipeline:
  - name: WhitespaceTokenizer
  - name: RegexFeaturizer
  - name: LexicalSyntacticFeaturizer
  - name: CountVectorsFeaturizer
    analyzer: char_wb
    min_ngram: 1
    max_ngram: 4
  - name: DIETClassifier
    epochs: 200  # Increased for better accuracy
    constrain_similarities: true
    model_confidence: linear_norm
    batch_size: 64
    embedding_dimension: 20
  - name: EntitySynonymMapper
  - name: ResponseSelector
    epochs: 200
    batch_size: 64

policies:
  - name: MemoizationPolicy
    max_history: 5
  - name: RulePolicy
    core_fallback_threshold: 0.4  # Adjusted threshold
  - name: UnexpecTEDIntentPolicy
    max_history: 5
    epochs: 200
  - name: TEDPolicy
    max_history: 5
    epochs: 200
    batch_size: 64
```

### Cross-Validation

```bash
# Test model accuracy
rasa test nlu --cross-validation

# Generate confusion matrix
rasa test nlu --cross-validation --config config.yml
```

## Multilingual Training

### Using IndicBERT for Indian Languages

```yaml
# config_multilingual.yml
language: multi

pipeline:
  - name: WhitespaceTokenizer
  - name: LanguageModelFeaturizer
    model_name: "ai4bharat/indic-bert"
    model_weights: "ai4bharat/indic-bert"
  - name: RegexFeaturizer
  - name: LexicalSyntacticFeaturizer
  - name: CountVectorsFeaturizer
  - name: DIETClassifier
    epochs: 100
  - name: EntitySynonymMapper
  - name: ResponseSelector
    epochs: 100
```

### Training Script

```bash
#!/bin/bash
# train_multilingual.sh

echo "Training multilingual health chatbot..."

# Train with English data
rasa train --config config.yml --domain domain.yml --data data/

# Train with Hindi data
rasa train --config config_multilingual.yml --domain domain.yml --data data/

# Test both models
rasa test nlu --model models/

echo "Training completed!"
```

## Performance Monitoring

### Training Metrics

```python
# scripts/monitor_training.py
import json
import matplotlib.pyplot as plt

def plot_training_metrics():
    # Load training results
    with open('results/intent_report.json', 'r') as f:
        results = json.load(f)
    
    # Plot accuracy by intent
    intents = list(results.keys())
    accuracies = [results[intent]['precision'] for intent in intents]
    
    plt.figure(figsize=(12, 6))
    plt.bar(intents, accuracies)
    plt.title('Intent Classification Accuracy')
    plt.xticks(rotation=45)
    plt.ylabel('Precision')
    plt.tight_layout()
    plt.savefig('training_metrics.png')
    plt.show()

if __name__ == "__main__":
    plot_training_metrics()
```

## Continuous Learning

### Feedback Loop

```python
# Add to backend/routes/chat.js
router.post('/feedback', async (req, res) => {
  const { message, response, rating, userId } = req.body;
  
  // Store feedback for retraining
  await pool.query(`
    INSERT INTO chat_feedback (user_id, message, response, rating, created_at)
    VALUES ($1, $2, $3, $4, NOW())
  `, [userId, message, response, rating]);
  
  // If rating is low, flag for review
  if (rating < 3) {
    await pool.query(`
      INSERT INTO training_queue (message, response, needs_review)
      VALUES ($1, $2, true)
    `, [message, response]);
  }
  
  res.json({ success: true });
});
```

### Automated Retraining

```bash
#!/bin/bash
# retrain_weekly.sh (cron job)

cd /app/rasa

# Export new training data from feedback
python scripts/export_feedback_data.py

# Retrain model
rasa train --config config.yml

# Test new model
rasa test nlu

# Deploy if accuracy improved
if [ $? -eq 0 ]; then
    echo "Retraining successful, deploying new model..."
    # Restart Rasa server with new model
    pkill -f "rasa run"
    nohup rasa run --enable-api --cors "*" --port 5005 &
fi
```

## Training Checklist

- [ ] NLU data covers all health intents
- [ ] Multilingual examples added
- [ ] Custom actions implemented
- [ ] Model accuracy > 80%
- [ ] Cross-validation performed
- [ ] Fallback responses configured
- [ ] Performance monitoring setup
- [ ] Continuous learning pipeline ready