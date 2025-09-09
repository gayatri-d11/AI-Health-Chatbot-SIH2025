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
        
        location = tracker.get_slot("user_location") or "India"
        
        try:
            response = requests.get(f"http://localhost:3000/api/alerts?location={location}")
            alerts = response.json()
            
            if alerts:
                message = f"स्वास्थ्य अलर्ट ({location}):\n"
                for alert in alerts[:2]:
                    message += f"• {alert['message']}\n"
            else:
                message = "फिलहाल कोई स्वास्थ्य अलर्ट नहीं है।"
                
        except Exception:
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
        
        advice = {
            "fever": "बुखार में आराम करें, तरल पदार्थ पिएं। 102°F से ज्यादा हो तो डॉक्टर से मिलें।",
            "cough": "खांसी में गर्म पानी पिएं, भाप लें। 2 सप्ताह से ज्यादा हो तो जांच कराएं।",
            "headache": "सिरदर्द में आराम करें, पानी पिएं।"
        }.get(symptom, "कृपया अपने लक्षण स्पष्ट रूप से बताएं।")
        
        dispatcher.utter_message(text=advice)
        return []