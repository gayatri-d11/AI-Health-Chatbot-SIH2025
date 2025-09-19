import React, { useState, useRef, useEffect } from 'react';

const VoiceInterface = ({ onVoiceMessage, selectedLanguage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Complete language mapping for all supported languages
      const langMap = {
        'hi': 'hi-IN',     // Hindi
        'en': 'en-US',     // English
        'te': 'te-IN',     // Telugu
        'ta': 'ta-IN',     // Tamil
        'bn': 'bn-IN',     // Bengali
        'gu': 'gu-IN',     // Gujarati
        'mr': 'mr-IN',     // Marathi
        'pa': 'pa-IN',     // Punjabi
        'kn': 'kn-IN',     // Kannada
        'ml': 'ml-IN',     // Malayalam
        'or': 'or-IN',     // Odia
        'as': 'as-IN',     // Assamese
        'ur': 'ur-IN'      // Urdu
      };
      
      recognitionRef.current.lang = langMap[selectedLanguage] || 'hi-IN';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        onVoiceMessage(transcript);
        stopRecording();
      };
      
      recognitionRef.current.onerror = (event) => {
        setError('Voice recognition error: ' + event.error);
        stopRecording();
      };
      
      recognitionRef.current.onend = () => {
        stopRecording();
      };
    }
  }, [selectedLanguage, onVoiceMessage]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setError('');
      setTranscript('');
      setIsRecording(true);
      setRecordingTime(0);
      recognitionRef.current.start();
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop after 30 seconds
          if (newTime >= 30) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } else {
      setError('Voice recognition not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Complete language mapping for TTS
      const langMap = {
        'hi': 'hi-IN',     // Hindi
        'en': 'en-US',     // English
        'te': 'te-IN',     // Telugu
        'ta': 'ta-IN',     // Tamil
        'bn': 'bn-IN',     // Bengali
        'gu': 'gu-IN',     // Gujarati
        'mr': 'mr-IN',     // Marathi
        'pa': 'pa-IN',     // Punjabi
        'kn': 'kn-IN',     // Kannada
        'ml': 'ml-IN',     // Malayalam
        'or': 'or-IN',     // Odia
        'as': 'as-IN',     // Assamese
        'ur': 'ur-IN'      // Urdu
      };
      
      utterance.lang = langMap[selectedLanguage] || 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        setError('Speech synthesis error');
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="voice-interface bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-purple-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Voice Assistant
        </h3>
        <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
          {selectedLanguage.toUpperCase()}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isPlaying}
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-300' 
              : 'bg-purple-500 hover:bg-purple-600'
          } text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50`}
        >
          {isRecording ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>

        {/* Stop Button (when recording) */}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          </button>
        )}

        {/* Status Text */}
        <div className="flex-1">
          {isRecording && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">Recording... ({recordingTime}s)</span>
              </div>
              <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                Click STOP or wait
              </div>
            </div>
          )}
          {isPlaying && (
            <div className="flex items-center text-purple-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Speaking...</span>
            </div>
          )}
          {!isRecording && !isPlaying && (
            <span className="text-sm text-gray-600">🎤 Tap to speak • Fast & Easy</span>
          )}
        </div>

        {/* Stop Speaking Button */}
        {isPlaying && (
          <button
            onClick={stopSpeaking}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          </button>
        )}
      </div>

      {transcript && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
          <p className="text-sm text-gray-700">
            <strong>You said:</strong> {transcript}
          </p>
        </div>
      )}

      {/* Voice Instructions */}
      <div className="mt-4 text-xs text-purple-600 space-y-1">
        <p>• 🎤 Click microphone → Speak → Click STOP (or auto-stops)</p>
        <p>• 🔊 AI responses spoken automatically in your language</p>
        <p>• ⏱️ Auto-stops after 30 seconds • Manual stop anytime</p>
        <p>• 🌐 Works in Hindi, English & 11 other Indian languages</p>
      </div>
    </div>
  );
};

// Hook to use voice in ChatInterface
export const useVoiceResponse = (selectedLanguage) => {
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Clean text for better speech
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/•/g, '') // Remove bullets
        .replace(/\n/g, '. ') // Replace newlines
        .substring(0, 300); // Limit length for faster speech
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const langMap = {
        'hi': 'hi-IN', 'en': 'en-US', 'te': 'te-IN', 'ta': 'ta-IN',
        'bn': 'bn-IN', 'gu': 'gu-IN', 'mr': 'mr-IN', 'pa': 'pa-IN',
        'kn': 'kn-IN', 'ml': 'ml-IN', 'or': 'or-IN', 'as': 'as-IN', 'ur': 'ur-IN'
      };
      
      utterance.lang = langMap[selectedLanguage] || 'hi-IN';
      utterance.rate = 1.1; // Faster speech
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return { speakResponse };
};

export default VoiceInterface;