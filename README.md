CycleSense: Predictive Health Analytics & Context-Aware Tracking
CycleSense is a full-stack, data-driven FemTech web application engineered to solve the friction between mathematical predictions and biological realities.

Traditional health tracking applications frequently rely on rigid forecasting algorithms that punish natural biological variance, often inducing anxiety by forcing cycle resets or flashing "Late" warnings. CycleSense solves this by decoupling the backend data state from the frontend user interface. By introducing an optimistic "Extended Luteal" masking layer and a context-aware AI chatbot, the application dynamically adapts to the user's real-time physiological state.

🚀 Key Features
Dynamic State Masking ("Extended Luteal"): Intercepts raw database predictions to prevent tracking anxiety. If a cycle is naturally delayed, the UI seamlessly extends the current luteal phase until explicit, two-step user confirmation is provided.

Context-Aware AI Chatbot: An integrated LLM assistant whose system prompt is perfectly synchronized with the frontend UI state, preventing AI "hallucinations" and ensuring empathetic, biologically accurate conversations.

Custom Medical Insights Engine: Evaluates historical cycle data against standard clinical parameters (cycle length, period length, and variance) to provide real-time reassurance or flag anomalies for medical consultation.

Phase-Mapped Lifestyle Engine: Dynamically renders highly specific Skincare, Exercise, Diet, and Social recommendations based on the user's exact physiological phase.

Robust Anomaly Detection (The "20-Day Rule"): The backend pipeline mathematically filters out mid-cycle spotting and data-entry errors to ensure predictive baselines are calculated using statistically pure medians, not skewed arithmetic means.

💻 System Architecture & Tech Stack
This project leverages a serverless cloud infrastructure designed for secure, scalable data handling:

Frontend: React.js, Tailwind CSS, hosted on Firebase.

Backend Data Warehouse: Google BigQuery.

Data Engineering (ETL): Python (Pandas) via Google Colab.

Cloud Security: Google Cloud IAM (Application Default Credentials and Service Accounts).

📊 The Data Model
A unique strength of CycleSense is its foundation. The predictive model was engineered, trained, and tested using a continuous 5+ year dataset of genuine historical cycle data exported from the Clue app. Handling a real-world dataset ensured the statistical forecasting model (utilizing rolling medians rather than means) was rigorously tested against actual human biological fluctuations, stress-induced delays, and missing data points.
