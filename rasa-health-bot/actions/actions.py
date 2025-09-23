from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.forms import FormAction
import requests
import json

class ActionSymptomChecker(Action):
    def name(self) -> Text:
        return "action_symptom_checker"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Get user's latest message
        user_message = tracker.latest_message.get('text', '').lower()
        
        # Emergency keywords detection
        emergency_keywords = [
            'chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding',
            'heart attack', 'stroke', 'poisoning', 'severe burn', 'choking',
            'छाती में दर्द', 'सांस लेने में तकलीफ', 'बेहोश', 'दिल का दौरा'
        ]
        
        # Check for emergency symptoms
        for keyword in emergency_keywords:
            if keyword in user_message:
                dispatcher.utter_message(text="🚨 **MEDICAL EMERGENCY DETECTED** 🚨\n\n"
                                            "**CALL 108 IMMEDIATELY**\n\n"
                                            "This requires urgent medical attention. "
                                            "Do not delay seeking professional help.")
                return []
        
        # Symptom analysis based on keywords
        if any(word in user_message for word in ['fever', 'temperature', 'बुखार']):
            dispatcher.utter_message(response="utter_fever_advice")
        elif any(word in user_message for word in ['headache', 'head pain', 'सिरदर्द']):
            dispatcher.utter_message(response="utter_headache_advice")
        elif any(word in user_message for word in ['cough', 'खांसी']):
            dispatcher.utter_message(response="utter_cough_advice")
        else:
            dispatcher.utter_message(text="Based on your symptoms, I recommend consulting "
                                        "a healthcare professional for proper diagnosis. "
                                        "For emergencies, call **108**.")
        
        return []

class ActionEmergencyAssessment(Action):
    def name(self) -> Text:
        return "action_emergency_assessment"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        user_message = tracker.latest_message.get('text', '').lower()
        
        # Critical emergency indicators
        critical_symptoms = [
            'chest pain', 'difficulty breathing', 'severe headache', 'unconscious',
            'bleeding heavily', 'can\'t breathe', 'heart attack', 'stroke symptoms',
            'छाती में दर्द', 'सांस नहीं आ रही', 'तेज सिरदर्द', 'बेहोश'
        ]
        
        # High priority symptoms
        high_priority = [
            'high fever', 'severe pain', 'vomiting blood', 'severe bleeding',
            'तेज बुखार', 'बहुत दर्द', 'खून की उल्टी'
        ]
        
        if any(symptom in user_message for symptom in critical_symptoms):
            dispatcher.utter_message(text="🚨 **CRITICAL EMERGENCY** 🚨\n\n"
                                        "**CALL 108 NOW - DO NOT WAIT**\n\n"
                                        "• Sit upright if conscious\n"
                                        "• Loosen tight clothing\n"
                                        "• Stay calm\n"
                                        "• Get to nearest hospital immediately")
        elif any(symptom in user_message for symptom in high_priority):
            dispatcher.utter_message(text="⚠️ **HIGH PRIORITY MEDICAL ATTENTION NEEDED**\n\n"
                                        "Please consult a doctor immediately or visit "
                                        "the nearest hospital. If condition worsens, "
                                        "call **108** for emergency assistance.")
        else:
            dispatcher.utter_message(text="Based on your symptoms, I recommend "
                                        "consulting a healthcare professional. "
                                        "Monitor your condition and seek immediate "
                                        "help if symptoms worsen.")
        
        return []

class ActionProvideHealthTips(Action):
    def name(self) -> Text:
        return "action_provide_health_tips"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        health_tips = [
            {
                "category": "General Wellness",
                "tips": [
                    "**Drink 8-10 glasses of water daily** (Source: WHO Guidelines)",
                    "**Exercise 30 minutes daily** - walking, yoga, or light activities",
                    "**Sleep 7-8 hours** for optimal health recovery",
                    "**Eat balanced diet** - include fruits, vegetables, whole grains",
                    "**Wash hands frequently** with soap for 20 seconds"
                ]
            },
            {
                "category": "Immunity Boosting",
                "tips": [
                    "**Vitamin C rich foods** - citrus fruits, amla, guava",
                    "**Turmeric milk** - natural anti-inflammatory",
                    "**Ginger tea** - boosts immunity and digestion",
                    "**Adequate sunlight** - 15-20 minutes for Vitamin D",
                    "**Stress management** - meditation, deep breathing"
                ]
            },
            {
                "category": "Preventive Care",
                "tips": [
                    "**Regular health checkups** - annual blood tests",
                    "**Vaccination schedule** - stay updated with immunizations",
                    "**Blood pressure monitoring** - check monthly if over 40",
                    "**Diabetes screening** - annual glucose tests",
                    "**Dental hygiene** - brush twice daily, floss regularly"
                ]
            }
        ]
        
        # Select random category
        import random
        selected_category = random.choice(health_tips)
        
        message = f"**{selected_category['category']} Tips** 🌟\n\n"
        for tip in selected_category['tips']:
            message += f"• {tip}\n"
        
        message += "\n💡 **Remember**: These are general wellness tips. " \
                  "Consult healthcare professionals for personalized advice."
        
        dispatcher.utter_message(text=message)
        return []

class ValidateSymptomForm(FormAction):
    def name(self) -> Text:
        return "validate_symptom_form"

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        return ["user_symptom", "user_age"]

    def slot_mappings(self) -> Dict[Text, Any]:
        return {
            "user_symptom": self.from_entity(entity="symptom"),
            "user_age": self.from_entity(entity="age")
        }

    def validate_user_symptom(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:
        
        if slot_value and len(slot_value) > 3:
            return {"user_symptom": slot_value}
        else:
            dispatcher.utter_message(text="Please describe your symptoms in more detail.")
            return {"user_symptom": None}

    def validate_user_age(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> Dict[Text, Any]:
        
        try:
            age = int(slot_value)
            if 0 <= age <= 120:
                return {"user_age": slot_value}
            else:
                dispatcher.utter_message(text="Please provide a valid age between 0-120.")
                return {"user_age": None}
        except ValueError:
            dispatcher.utter_message(text="Please provide your age as a number.")
            return {"user_age": None}

    def submit(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        
        symptom = tracker.get_slot("user_symptom")
        age = tracker.get_slot("user_age")
        
        # Age-specific advice
        if int(age) < 18:
            dispatcher.utter_message(text="For children's health concerns, please consult "
                                        "a pediatrician immediately. Child health requires "
                                        "specialized medical attention.")
        elif int(age) > 65:
            dispatcher.utter_message(text="For elderly health concerns, regular monitoring "
                                        "is important. Please consult your doctor for "
                                        "age-appropriate medical advice.")
        else:
            dispatcher.utter_message(text=f"Thank you for providing your symptoms: {symptom}. "
                                        "Based on your age ({age}), I recommend consulting "
                                        "a healthcare professional for proper evaluation.")
        
        return []