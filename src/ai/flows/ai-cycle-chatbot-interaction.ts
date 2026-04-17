'use server';
/**
 * @fileOverview This file implements a Genkit flow for the CycleSense AI Chatbot.
 *
 * - aiCycleChatbotInteraction - A function that handles the AI chatbot interaction.
 * - AiCycleChatbotInteractionInput - The input type for the aiCycleChatbotInteraction function.
 * - AiCycleChatbotInteractionOutput - The return type for the aiCycleChatbotInteraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCycleChatbotInteractionInputSchema = z.object({
  chatMessage: z.string().describe("The user's message to the chatbot."),
  currentCycleDay: z
    .number()
    .int()
    .min(1)
    .describe('The current day of the user\u0027s menstrual cycle.'),
  currentCyclePhase: z
    .string()
    .describe(
      'The current phase of the user\u0027s menstrual cycle (e.g., Follicular, Ovulatory, Luteal, Menstrual, Extended Luteal).'
    ),
  daysLate: z
    .number()
    .int()
    .min(0)
    .describe("How many days the user's period is late. 0 if not late."),
});
export type AiCycleChatbotInteractionInput = z.infer<
  typeof AiCycleChatbotInteractionInputSchema
>;

const AiCycleChatbotInteractionOutputSchema = z.object({
  response: z.string().describe('The chatbot\u0027s personalized response.'),
});
export type AiCycleChatbotInteractionOutput = z.infer<
  typeof AiCycleChatbotInteractionOutputSchema
>;

export async function aiCycleChatbotInteraction(
  input: AiCycleChatbotInteractionInput
): Promise<AiCycleChatbotInteractionOutput> {
  return aiCycleChatbotInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCycleChatbotInteractionPrompt',
  input: {schema: AiCycleChatbotInteractionInputSchema},
  output: {schema: AiCycleChatbotInteractionOutputSchema},
  prompt: `You are CycleSense, an empathetic and knowledgeable health assistant specialized in menstrual health. You provide personalized advice and information based on the user's current cycle context.

User's current cycle details:
- Current Cycle Day: {{{currentCycleDay}}}
- Current Cycle Phase: {{{currentCyclePhase}}}
- Days Period is Late: {{{daysLate}}}

The user is currently on day {{{currentCycleDay}}} in the {{{currentCyclePhase}}} phase. If their period is late, they are {{{daysLate}}} days late. Use these provided values as the source of truth, as they may be dynamically adjusted from raw database values.

User's question: {{{chatMessage}}}

Provide a helpful and personalized response based on the user's question and their current cycle context. Your response should be supportive and informative.`,
});

const aiCycleChatbotInteractionFlow = ai.defineFlow(
  {
    name: 'aiCycleChatbotInteractionFlow',
    inputSchema: AiCycleChatbotInteractionInputSchema,
    outputSchema: AiCycleChatbotInteractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
