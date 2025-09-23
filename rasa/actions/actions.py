from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import json

class ActionSymptomChecker(Action):
    def name(self) -> Text:
        return "action_symptom_checker"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        symptoms = tracker.get_slot("symptom")
        
        if symptoms:
            # Send to Gemini for detailed analysis
            response = self.analyze_symptoms_with_gemini(symptoms)
            dispatcher.utter_message(text=response)
        else:
            dispatcher.utter_message(text="कृपया अपने लक्षण बताएं / Please describe your symptoms")
        
        return []

    def analyze_symptoms_with_gemini(self, symptoms):
        # This would integrate with your Gemini service
        return f"आपके लक्षण '{symptoms}' के आधार पर सुझाव दिया जा रहा है..."

class ActionFindHospital(Action):
    def name(self) -> Text:
        return "action_find_nearby_hospital"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = tracker.get_slot("user_location")
        
        if location:
            response = f"आपके क्षेत्र {location} में निकटतम अस्पताल खोजे जा रहे हैं..."
        else:
            response = "कृपया अपना स्थान बताएं / Please provide your location"
        
        dispatcher.utter_message(text=response)
        return []

class ActionVaccinationReminder(Action):
    def name(self) -> Text:
        return "action_vaccination_reminder"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        response = """
टीकाकरण अनुस्मारक:
- कोविड बूस्टर: हर 6 महीने
- फ्लू वैक्सीन: वार्षिक
- हेपेटाइटिस बी: जीवनभर सुरक्षा

Vaccination Reminder:
- COVID Booster: Every 6 months  
- Flu Vaccine: Annual
- Hepatitis B: Lifetime protection
        """
        
        dispatcher.utter_message(text=response)
        return []