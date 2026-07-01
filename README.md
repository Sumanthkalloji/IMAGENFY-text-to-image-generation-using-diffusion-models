# Imagenify: Photorealistic Text-to-Image Generation 🎨✨

[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Streamlit](https://img.shields.io/badge/Studio-Streamlit-FF4B4B?style=for-the-badge&logo=streamlit)](https://streamlit.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![Freepik](https://img.shields.io/badge/AI-Freepik%20Mystic-blue?style=for-the-badge)](https://www.freepik.com/ai/image-generator)

**Imagenify** is a dual-platform AI ecosystem designed for high-fidelity image generation. It combines a sleek, interactive **React-based Chatbot** for conversational image creation and a powerful **Streamlit-based Designer Studio** for advanced image synthesis and editing.

---

## � Project Overview

This project explores the intersection of **Diffusion Models** and **Large Language Models (LLMs)** to provide a seamless user experience for generating photorealistic art. By leveraging cutting-edge APIs from Google Gemini and Freepik, Imagenify transforms simple textual descriptions into stunning visual masterpieces.

### 🌟 Key Platforms

#### 1. 💬 The Chatbot (React Interface)
A modern, conversational UI that feels like talking to an artist.
- **Glassmorphic Design:** A premium, translucent interface with fluid animations.
- **Real-time Generation:** Integrated with Freepik AI via a secure Node.js proxy.
- **Actionable Chat:** Download or view full-size images directly within the conversation.

#### 2. 🖌️ The Studio (Streamlit App)
A professional-grade designer tool for advanced workflows.
- **Style Presets:** Choose from Cyberpunk, Anime, Oil Painting, and more.
- **Image Editing:** Upload reference images and describe modifications with AI precision.
- **Ultra-UI:** Custom CSS themes with neon accents and animated logo-style headers.

---

## ✨ Features

- **Multi-Model Support:** Uses Freepik Mystic for realistic synthesis and Gemini 1.5 Flash for prompt intelligence.
- **Premium Aesthetics:** Advanced CSS featuring glassmorphism, floating animations, and shimmering logos.
- **Smart Prompting:** Automatic style enhancement based on user-selected vibes.
- **History & Gallery:** Persistent session history to track your creative journey.
- **High-Res Downloads:** One-click PNG exports with custom naming conventions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Web Frontend** | React 19, Vite, Vanilla CSS (Glassmorphism) |
| **Designer Studio** | Streamlit, Python 3.10+ |
| **Backend (Proxy)** | Express.js, Node.js |
| **Generative Models** | Google Gemini 1.5 Flash, Freepik Mystic |
| **Image Processing** | Pillow (PIL), BytesIO |

---

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- API Keys: [Freepik AI](https://freepik.com/api), [Google Gemini](https://aistudio.google.com/)

### 1. Web/Chatbot Setup
```bash
cd Imagen
npm install
node server.js   # Run the proxy server
npm run dev      # Launch the React app
```

### 2. Studio Setup
```bash
cd imgenifiy
pip install -r requirements.txt
streamlit run app.py
```

---

## 📂 Folder Structure

```text
├── Imagen/              # React Web Chatbot
│   ├── src/             # Component logic & Styles
│   ├── server.js        # Node.js Proxy Server
│   └── ...
├── imgenifiy/           # Streamlit Designer Studio
│   ├── app.py           # Main application logic
│   └── requirements.txt # Python dependencies
└── README.md            # You are here!
```

---

## 🛡️ Security Note

This project uses local environment variables (`.env`) for API keys. **Never commit your `.env` file to public repositories.**

---

## 🤝 Acknowledgments

Generated as a **Major Project** focused on Diffusion Models and Modern UI/UX. Special thanks to the Google DeepMind team and the Streamlit community for providing the underlying frameworks.

---
<p align="center">Made with ❤️ by <b>Mr.Ram-RCH</b></p>


