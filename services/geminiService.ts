import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedInfo, GeneratedSummary } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, one-paragraph summary of the abstract."
    },
    keyFindings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-4 of the most important findings or results reported in the abstract."
    },
    methodology: {
      type: Type.STRING,
      description: "A brief description of the primary methodology or experimental approach used."
    },
    clinicalSignificance: {
      type: Type.STRING,
      description: "A sentence explaining the potential clinical significance or implications of the research."
    }
  },
  required: ['summary', 'keyFindings', 'methodology', 'clinicalSignificance']
};

export const extractInfoFromAbstract = async (abstract: string): Promise<ExtractedInfo> => {
    try {
        const prompt = `You are an expert biomedical researcher. Analyze the following PubMed article abstract and extract the specified information. Return the information in a valid JSON object format that strictly adheres to the provided schema.

Abstract:
---
${abstract}
---`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as ExtractedInfo;

    } catch (error) {
        console.error("Error extracting information from abstract:", error);
        throw new Error("Failed to process abstract with Gemini API.");
    }
};

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        overallSummary: {
            type: Type.STRING,
            description: "A high-level summary synthesizing the findings from all provided abstracts."
        },
        commonThemes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-5 common themes or recurring findings observed across the different abstracts."
        },
        differingFindings: {
            type: Type.STRING,
            description: "A sentence or two noting any contradictory, differing, or unique findings. If none, state that the findings are consistent."
        }
    },
    required: ['overallSummary', 'commonThemes', 'differingFindings']
};

export const summarizeAbstracts = async (abstracts: string[]): Promise<GeneratedSummary> => {
    try {
        const abstractsText = abstracts.map((abstract, index) => `Abstract ${index + 1}:\n---\n${abstract}\n---`).join('\n\n');

        const prompt = `You are an expert biomedical researcher. Analyze the following collection of PubMed article abstracts on a similar topic. Synthesize the information to provide a consolidated overview. Return the information in a valid JSON object format that strictly adheres to the provided schema.

Abstracts:
${abstractsText}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: summarySchema,
                temperature: 0.3,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as GeneratedSummary;

    } catch (error) {
        console.error("Error summarizing abstracts:", error);
        throw new Error("Failed to process abstracts with Gemini API.");
    }
};
