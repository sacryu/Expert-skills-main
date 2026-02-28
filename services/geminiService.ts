import { GoogleGenAI, Type } from "@google/genai";
import { ParsedTask } from "../types";

// Safe wrapper to avoid crashing if no key is present during demo
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const parseTaskIntent = async (taskText: string): Promise<ParsedTask> => {
  const ai = getClient();
  
  // Fallback if no API key
  if (!ai) {
    console.warn("No API Key found. Using mock parser.");
    await new Promise(r => setTimeout(r, 600)); // Simulate delay
    const lower = taskText.toLowerCase();
    const intents: string[] = [];
    
    // Core Logic Keywords
    if (lower.includes("forecast") || lower.includes("predict") || lower.includes("预测") || lower.includes("预估")) intents.push("prediction");
    if (lower.includes("stock") || lower.includes("inventory") || lower.includes("库存") || lower.includes("存货")) intents.push("inventory");
    if (lower.includes("safety") || lower.includes("risk") || lower.includes("安全") || lower.includes("风险")) intents.push("safety");
    if (lower.includes("route") || lower.includes("delivery") || lower.includes("路由") || lower.includes("配送") || lower.includes("物流")) intents.push("routing");
    if (lower.includes("defect") || lower.includes("quality") || lower.includes("check") || lower.includes("缺陷") || lower.includes("质量") || lower.includes("检测") || lower.includes("判定")) intents.push("quality");
    
    // New Scenarios Keywords
    if (lower.includes("repair") || lower.includes("fix") || lower.includes("breakdown") || lower.includes("维修") || lower.includes("故障") || lower.includes("工单")) intents.push("maintenance");
    if (lower.includes("rul") || lower.includes("life") || lower.includes("lifetime") || lower.includes("寿命") || lower.includes("健康")) intents.push("maintenance");
    if (lower.includes("plan") || lower.includes("sop") || lower.includes("production") || lower.includes("计划") || lower.includes("产销") || lower.includes("排程")) intents.push("planning");

    return {
      original_text: taskText,
      intents: intents.length > 0 ? intents : ["general_query"],
      entities: ["Equipment_001", "Line_A"],
      extracted_params: { simulated: true }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an intelligent task parser for a manufacturing skills platform.
      Analyze the following user task (which may be in Chinese or English) and extract the intents (actions required) and entities (objects involved).
      
      User Task: "${taskText}"
      
      Return JSON with:
      - intents: array of strings (Standard keys: 'prediction', 'inventory', 'safety', 'routing', 'quality', 'maintenance', 'planning'). Map Chinese intents to these keys.
      - entities: array of strings (Extract relevant entities like SKU numbers, locations, dates).
      - extracted_params: key-value pairs of specific parameters identified.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intents: { type: Type.ARRAY, items: { type: Type.STRING } },
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            extracted_params: { type: Type.OBJECT }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      original_text: taskText,
      intents: result.intents || [],
      entities: result.entities || [],
      extracted_params: result.extracted_params || {}
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback on error
    return {
        original_text: taskText,
        intents: ["unknown"],
        entities: [],
        extracted_params: {}
    };
  }
};