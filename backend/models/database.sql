-- Health Chatbot Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    age INTEGER,
    location VARCHAR(100),
    language VARCHAR(5) DEFAULT 'hi',
    medical_conditions JSONB DEFAULT '[]',
    total_quiz_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Alert subscriptions
CREATE TABLE alert_subscriptions (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    location VARCHAR(100),
    language VARCHAR(5) DEFAULT 'hi',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz scores
CREATE TABLE quiz_scores (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    points INTEGER NOT NULL,
    topic VARCHAR(50),
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Chat conversations (for analytics)
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_phone VARCHAR(15),
    message TEXT,
    response TEXT,
    confidence DECIMAL(3,2),
    language VARCHAR(5),
    channel VARCHAR(20), -- whatsapp, sms, voice, web
    created_at TIMESTAMP DEFAULT NOW()
);

-- Health alerts log
CREATE TABLE health_alerts (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50), -- outbreak, seasonal, vaccination
    disease VARCHAR(100),
    message TEXT,
    severity VARCHAR(20), -- low, medium, high, critical
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Vaccination reminders
CREATE TABLE vaccination_reminders (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    vaccine_name VARCHAR(100),
    due_date DATE,
    is_completed BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_conversations_user_phone ON conversations(user_phone);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_health_alerts_location ON health_alerts(location);
CREATE INDEX idx_health_alerts_created_at ON health_alerts(created_at);
CREATE INDEX idx_vaccination_reminders_due_date ON vaccination_reminders(due_date);

-- Sample data
INSERT INTO health_alerts (alert_type, disease, message, severity, location) VALUES
('seasonal', 'Dengue', 'मानसून में डेंगू से बचाव करें। पानी जमा न होने दें।', 'high', 'Mumbai'),
('outbreak', 'Chikungunya', 'चिकनगुनिया के मामले बढ़े हैं। मच्छरों से बचें।', 'medium', 'Delhi'),
('vaccination', 'COVID-19', 'कोविड बूस्टर डोज़ लगवाएं।', 'medium', 'All India');

-- Health FAQ data for training
CREATE TABLE health_faqs (
    id SERIAL PRIMARY KEY,
    question_en TEXT,
    question_hi TEXT,
    answer_en TEXT,
    answer_hi TEXT,
    category VARCHAR(50),
    keywords TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO health_faqs (question_en, question_hi, answer_en, answer_hi, category, keywords) VALUES
('What to do for fever?', 'बुखार में क्या करें?', 'Rest, drink fluids, take paracetamol if needed. See doctor if fever is above 102°F.', 'आराम करें, तरल पदार्थ पिएं, जरूरत हो तो पैरासिटामोल लें। 102°F से ज्यादा बुखार हो तो डॉक्टर से मिलें।', 'symptoms', ARRAY['fever', 'बुखार', 'temperature']),
('How to prevent dengue?', 'डेंगू से कैसे बचें?', 'Prevent water stagnation, use mosquito nets, wear full sleeves.', 'पानी जमा न होने दें, मच्छरदानी का उपयोग करें, पूरी बाजू के कपड़े पहनें।', 'prevention', ARRAY['dengue', 'डेंगू', 'mosquito']),
('COVID vaccination schedule?', 'कोविड टीकाकरण कब?', 'First dose at 18+, second dose after 28 days, booster after 6 months.', 'पहली डोज़ 18+ में, दूसरी डोज़ 28 दिन बाद, बूस्टर 6 महीने बाद।', 'vaccination', ARRAY['covid', 'vaccine', 'टीका', 'vaccination']);