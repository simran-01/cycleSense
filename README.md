<h1> CycleSense: Predictive Health Analytics & Context-Aware Tracking </h1> <br>
CycleSense is a full-stack, data-driven FemTech web application engineered to solve the friction between mathematical predictions and biological realities.

Traditional health tracking applications frequently rely on rigid forecasting algorithms that punish natural biological variance, often inducing anxiety by forcing cycle resets or flashing "Late" warnings. CycleSense solves this by decoupling the backend data state from the frontend user interface. By introducing an optimistic "Extended Luteal" masking layer and a context-aware AI chatbot, the application dynamically adapts to the user's real-time physiological state.

🚀 Key Features
Dynamic State Masking ("Extended Luteal"): Intercepts raw database predictions to prevent tracking anxiety. If a cycle is naturally delayed, the UI seamlessly extends the current luteal phase until explicit, two-step user confirmation is provided.

Context-Aware AI Chatbot: An integrated LLM assistant whose system prompt is perfectly synchronized with the frontend UI state, preventing AI "hallucinations" and ensuring empathetic, biologically accurate conversations.

Custom Medical Insights Engine: Evaluates historical cycle data against standard clinical parameters (cycle length, period length, and variance) to provide real-time reassurance or flag anomalies for medical consultation.

Phase-Mapped Lifestyle Engine: Dynamically renders highly specific Skincare, Exercise, Diet, and Social recommendations based on the user's exact physiological phase.

Robust Anomaly Detection (The "20-Day Rule"): The backend pipeline mathematically filters out mid-cycle spotting and data-entry errors to ensure predictive baselines are calculated using statistically pure medians, not skewed arithmetic means.

💻 System Architecture & Tech Stack
This project leverages a serverless cloud infrastructure designed for secure, scalable data  handling:
Frontend: React.js, Tailwind CSS, hosted on Firebase.

Backend Data Warehouse: Google BigQuery.

Data Engineering (ETL): Python (Pandas) via Google Colab.

Cloud Security: Google Cloud IAM (Application Default Credentials and Service Accounts). <br>

<img width="2816" height="1536" alt="Gemini_Generated_Image_nerfh2nerfh2nerf" src="https://github.com/user-attachments/assets/a30f0e7f-8e6d-4854-9b65-29e280505356" />

📊 The Data Model
A unique strength of CycleSense is its foundation. The predictive model was engineered, trained, and tested using a continuous 5+ year dataset of genuine historical cycle data exported from the Clue app. Handling a real-world dataset ensured the statistical forecasting model (utilizing rolling medians rather than means) was rigorously tested against actual human biological fluctuations, stress-induced delays, and missing data points.

<img width="2217" height="1328" alt="Screenshot 2026-04-17 7 54 02 PM" src="https://github.com/user-attachments/assets/f045ff7b-d012-49c4-8560-a07b4d203d49" /> <br>
<img width="2217" height="1328" alt="Screenshot 2026-04-17 7 55 12 PM" src="https://github.com/user-attachments/assets/c78f5369-d313-4224-9d45-d2ad1a017218" /> <br>
<img width="2217" height="1328" alt="Screenshot 2026-04-17 7 53 56 PM" src="https://github.com/user-attachments/assets/5a4d5395-dd8b-4ce9-a70d-307ddc7ef0c9" /> <br>
<img width="2217" height="1328" alt="Screenshot 2026-04-17 7 55 26 PM" src="https://github.com/user-attachments/assets/8f13a8b5-a81a-4431-be6c-4d45c4f30f35" /> <br>
<img width="2217" height="1328" alt="Screenshot 2026-04-17 7 53 48 PM" src="https://github.com/user-attachments/assets/b8308934-bd83-4e5b-a7ad-a8011c5afa72" /> <br>
<img width="1822" height="1328" alt="Screenshot 2026-04-17 7 53 30 PM" src="https://github.com/user-attachments/assets/76feea66-3090-4421-afba-a72eee75951d" /> <br>

