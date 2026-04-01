const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get AI insights for a given set of data
 * @param {String} task - The task name (e.g., 'inventory_optimization', 'lead_scoring')
 * @param {Object} data - The data to analyze
 * @returns {Promise<String>} - AI generated insights
 */
const getAIInsights = async (task, data) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (task === "inventory_optimization") {
      prompt = `Analyze this automotive inventory data and provide top 3 actionable insights to improve sales or stock management. Data: ${JSON.stringify(data)}. Return a clean bulleted list.`;
    } else if (task === "lead_scoring") {
      prompt = `Review these sales leads and score them from 1 to 10 based on conversion probability. Also, suggest which one requires immediate follow-up. Data: ${JSON.stringify(data)}. Return a short paragraph with the score for each and a recommendation.`;
    } else if (task === "service_scheduling") {
      prompt = `Analyze these service appointments and suggest ways to optimize the schedule or improve customer experience. Data: ${JSON.stringify(data)}. Return 2 tips.`;
    } else {
      prompt = `Provide business insights based on this data: ${JSON.stringify(data)}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "AI insights currently unavailable. Please check back later.";
  }
};

module.exports = { getAIInsights };
