# **App Name**: CycleSense

## Core Features:

- Interactive Cycle Dashboard: Displays current cycle day, upcoming period, and daily health status using an enlarged, glowing cycle circle with clickable day markers to reveal specific phase details. All data is live from BigQuery.
- AI Cycle Chatbot: A floating sparkle button activates a 25% width side-panel chatbot. Powered by Gemini API, this tool automatically understands the user's current cycle day and phase to provide contextual and personalized advice.
- Personalized Lifestyle Recommendations: Showcases phase-specific tips for skincare, exercise, diet, and social activities within prominent glassmorphism cards, each identified by large, centered Lucide Icons.
- BigQuery Data Integration: Establishes a direct connection to 'CycleSense-Analysis.cycle_data.historical_logs' in BigQuery to fetch live cycle statistics (e.g., average cycle length, variation) and historical data for interactive display.
- Cycle Calendar View: Provides a clear, grid-style calendar for tracking cycle events, visually reminiscent of the Clue app, with a centered and screen-width restricted layout.
- Intuitive Navigation System: A bottom navigation bar with icons that feature a 'Rose' colored active state and incorporate soft animations for a premium user experience when switching tabs.

## Style Guidelines:

- Background: A very pale, nearly white rose shade (#FFF9FB), providing a soft, clean base for the 'Girly-Premium' aesthetic.
- Primary Color: A vibrant, elegant rose-pink (#DE3F8F), chosen for its sophistication and ability to contrast beautifully against the light background.
- Accent Color: A delicate lavender (#DE8FE6), which is analogous to the primary hue and offers a complementary highlight for interactive elements and features.
- Headline font: 'Belleza' (humanist sans-serif) for its elegant, fashion-forward appeal. Body text font: 'Alegreya' (humanist serif) to ensure readability for detailed phase-specific tips and content, adding an intellectual yet contemporary feel.
- Utilize clean, modern Lucide Icons for clarity and consistency across the app, specifically assigning Sparkles for skincare, Dumbbell for exercise, Salad for diet, and Heart for social recommendations. Navigation icons will have a distinctive rose-colored active state.
- All cards throughout the application will employ a sophisticated Glassmorphism effect. The dashboard will feature a prominent, 1.5x larger 'Cycle Circle' with a soft outer glow, a 'Next Period' card, and a 'Daily Health Status' bar. Lifestyle cards will be large, centered, and visually striking. The calendar view will be centered and restricted to 75% screen width, adopting a grid-like appearance similar to the Clue app.
- Soft animations will be incorporated when navigating between tabs and for subtle UI elements, contributing to a premium, smooth, and interactive user experience. The 'Cycle Circle' will feature a soft outer glow animation.