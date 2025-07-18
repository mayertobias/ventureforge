import { geminiModel } from './gemini';

interface RetryConfig {
  maxRetries: number;
  timeoutMs: number;
  backoffMs: number;
}

interface AIRequest {
  prompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  retryConfig?: Partial<RetryConfig>;
}

interface AIResponse {
  content: string;
  tokens?: number;
  retryCount: number;
  successful: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  timeoutMs: 300000, // 5 minutes
  backoffMs: 2000,   // 2 seconds
};

export class AIService {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async makeGeminiRequest(
    prompt: string, 
    userPrompt: string, 
    timeoutMs: number
  ): Promise<string> {
    const requestPromise = geminiModel.generateContent([prompt, userPrompt]);
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    );

    const result = await Promise.race([requestPromise, timeoutPromise]);
    const response = (result as any).response;
    return response.text();
  }

  static async generateWithRetry(request: AIRequest): Promise<AIResponse> {
    const config: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...request.retryConfig };
    
    let lastError: Error | null = null;
    let retryCount = 0;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        console.log(`[AI_SERVICE] Attempt ${attempt + 1}/${config.maxRetries + 1}`);
        
        const content = await this.makeGeminiRequest(
          request.prompt,
          request.userPrompt,
          config.timeoutMs
        );

        if (!content) {
          throw new Error('Empty response from AI service');
        }

        console.log(`[AI_SERVICE] Success on attempt ${attempt + 1}`);
        return {
          content,
          retryCount: attempt,
          successful: true
        };

      } catch (error) {
        lastError = error as Error;
        retryCount = attempt;
        
        console.warn(`[AI_SERVICE] Attempt ${attempt + 1} failed:`, lastError.message);
        
        // Don't retry on the last attempt
        if (attempt < config.maxRetries) {
          const backoffDelay = config.backoffMs * Math.pow(2, attempt); // Exponential backoff
          console.log(`[AI_SERVICE] Retrying in ${backoffDelay}ms...`);
          await this.delay(backoffDelay);
        }
      }
    }

    console.error(`[AI_SERVICE] All ${config.maxRetries + 1} attempts failed. Last error:`, lastError?.message);
    
    return {
      content: '',
      retryCount,
      successful: false
    };
  }

  /**
   * For very large responses, break them into phases
   */
  static async generateInPhases(
    phases: Array<{ prompt: string; userPrompt: string; context?: any }>,
    retryConfig?: Partial<RetryConfig>
  ): Promise<{ phases: AIResponse[]; combinedContent: string; successful: boolean }> {
    const phaseResults: AIResponse[] = [];
    let combinedContent = '';
    let overallSuccess = true;

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      console.log(`[AI_SERVICE] Starting phase ${i + 1}/${phases.length}`);

      // Include context from previous phases if available
      let enhancedPrompt = phase.prompt;
      if (phase.context || combinedContent) {
        enhancedPrompt += `\n\n**CONTEXT FROM PREVIOUS PHASES:**\n${JSON.stringify(phase.context || combinedContent.substring(0, 1000))}`;
      }

      const result = await this.generateWithRetry({
        prompt: enhancedPrompt,
        userPrompt: phase.userPrompt,
        retryConfig
      });

      phaseResults.push(result);

      if (result.successful) {
        combinedContent += result.content + '\n\n';
      } else {
        console.error(`[AI_SERVICE] Phase ${i + 1} failed, continuing with partial results`);
        overallSuccess = false;
      }
    }

    return {
      phases: phaseResults,
      combinedContent: combinedContent.trim(),
      successful: overallSuccess
    };
  }

  /**
   * Parse JSON response with error handling
   */
  static parseJSONResponse(content: string): { parsed: any; success: boolean; error?: string } {
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanResponse = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return { parsed, success: true };
    } catch (error) {
      console.error('[AI_SERVICE] JSON parsing error:', error);
      console.error('[AI_SERVICE] Raw response:', content.substring(0, 500));
      
      return { 
        parsed: null, 
        success: false, 
        error: `JSON parsing failed: ${(error as Error).message}` 
      };
    }
  }

  /**
   * Create a fallback response structure when AI fails
   */
  static createFallbackResponse(moduleType: string, originalPrompt: string): any {
    const timestamp = new Date().toISOString();
    
    const fallbacks: Record<string, any> = {
      research: {
        marketLandscape: {
          totalAddressableMarket: "Analysis in progress - AI service temporarily unavailable",
          serviceableAddressableMarket: "To be determined when service recovers",
          marketGrowthRate: "Pending analysis",
          keyTrends: "Market research will be completed when AI service is restored"
        },
        targetCustomerAnalysis: {
          primarySegment: "Customer analysis pending",
          customerPainPoints: ["Analysis interrupted - will complete when service is restored"],
          buyingBehavior: "Research in progress"
        },
        competitiveLandscape: {
          mainCompetitors: ["Analysis will be completed when AI service recovers"],
          competitiveGap: "Detailed analysis pending service restoration"
        },
        _fallback: true,
        _timestamp: timestamp,
        _reason: "AI service timeout - analysis will be completed when service is restored"
      },
      
      blueprint: {
        executiveSummary: {
          businessConcept: "Business analysis interrupted - will be completed when AI service is restored",
          marketOpportunity: "Analysis pending",
          uniqueAdvantage: "To be determined",
          revenueProjection: "Financial analysis will be completed when service recovers"
        },
        _fallback: true,
        _timestamp: timestamp,
        _reason: "AI service timeout - blueprint will be completed when service is restored"
      },
      
      financials: {
        keyAssumptions: [{
          assumption: "Analysis Pending",
          value: "To be calculated when AI service is restored",
          justification: "Financial modeling interrupted - will complete when service is available"
        }],
        _fallback: true,
        _timestamp: timestamp,
        _reason: "AI service timeout - financial projections will be completed when service is restored"
      },
      
      pitch: {
        executiveSummary: "Pitch development interrupted - will be completed when AI service is restored",
        pitchDeckSlides: {
          problemSlide: {
            headline: "Analysis in Progress",
            problemStatement: "Pitch development will be completed when AI service is restored"
          }
        },
        _fallback: true,
        _timestamp: timestamp,
        _reason: "AI service timeout - investor pitch will be completed when service is restored"
      },
      
      gtm: {
        strategicOverview: {
          gtmThesis: "Go-to-market analysis interrupted - will be completed when AI service is restored",
          marketEntryStrategy: "Analysis pending",
          primaryObjective: "Strategy development will resume when service is available"
        },
        _fallback: true,
        _timestamp: timestamp,
        _reason: "AI service timeout - GTM strategy will be completed when service is restored"
      }
    };

    return fallbacks[moduleType] || {
      message: "Analysis in progress - will be completed when AI service is restored",
      _fallback: true,
      _timestamp: timestamp,
      _moduleType: moduleType
    };
  }
}