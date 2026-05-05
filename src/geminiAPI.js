/**
 * Groq API Integration (Replaces Gemini for this implementation)
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Generate a personalized Jyotish reading using Groq API
 */
export const generatePrediction = async (birthData, locale = 'en') => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Reusing the same env variable for the Groq key
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY (Groq Key) is not set.");
  }

  const isHindi = locale === 'hi';
  
  const systemPrompt = `You are an expert Vedic Astrologer (Jyotish). Analyze the provided birth data and return a personalized reading.
${isHindi ? 'IMPORTANT: Return all values in Hindi (Devanagari script).' : 'Return all values in English.'}

Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "summaryTagline": "A short, poetic summary (1 sentence).",
  "personalityInsight": "Detailed overview of their nature based on Vedic principles.",
  "currentPhase": "Current life phase/Dasha insight.",
  "careerFinance": "Career and finance advice.",
  "relationshipsHealth": "Relationship and family/health insight.",
  "keyRemedies": ["Remedy 1", "Remedy 2"],
  "auspiciousAdvice": "One final auspicious piece of guidance."
}`;

  const userPrompt = `Birth Data:
Name: ${birthData.name}
Date: ${birthData.dob}
Time: ${birthData.tob}
Place: ${birthData.pob}
Gender: ${birthData.gender}`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error('Groq Prediction error:', err);
    throw err;
  }
};

/**
 * Generate daily Vedic horoscope snippets for all 12 zodiac signs using Groq API
 */
export const generateDailyHoroscopes = async (locale) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY (Groq Key) is not set.");
  }
  
  const isHindi = locale === 'hi';
  const today = new Date().toISOString().split('T')[0];

  const prompt = `Today is ${today}. Generate daily Vedic horoscope snippets for all 12 zodiac signs.
${isHindi ? 'Write ALL horoscopes in Hindi (Devanagari script). Keep each one warm, specific, and actionable.' : 'Write in English. Keep each one warm, specific, and actionable.'}

Return ONLY a valid JSON object (no markdown, no backticks) in this exact format:
{
  "date": "${today}",
  "horoscopes": {
    "Aries": "One sentence daily insight. Max 20 words.",
    "Taurus": "...",
    "Gemini": "...",
    "Cancer": "...",
    "Leo": "...",
    "Virgo": "...",
    "Libra": "...",
    "Scorpio": "...",
    "Sagittarius": "...",
    "Capricorn": "...",
    "Aquarius": "...",
    "Pisces": "..."
  }
}

Each horoscope must be exactly 1 sentence, maximum 20 words. Reference Vedic planetary movements.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error('Groq Daily Horoscope error:', err);
    throw err;
  }
};
