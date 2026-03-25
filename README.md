# Haikal Mumtaz - Personal Portfolio

<div align="center">

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[**Live Demo**](https://haikalmumtaz.com) · [**Report Bug**](https://github.com/haikalmumtaz233/haikalmumtaz-com/issues)

</div>

---

## About The Project

Welcome to the source code of my personal portfolio.

This website serves as a **digital archive** and a central hub to document my journey as a developer. I built this platform not only to display my projects but also to connect with others and share what I've learned along the way.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/haikalmumtaz233/haikalmumtaz-com.git
   cd haikalmumtaz-com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

---

## Configuration

To enable the **Contact Form** functionality, you need to set up environment variables for EmailJS and Cloudflare Turnstile.

### Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your API keys:**
   ```env
   # Cloudflare Turnstile (https://dash.cloudflare.com/turnstile)
   VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key_here

   # EmailJS (https://www.emailjs.com/)
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

3. **Restart the development server** after adding the environment variables.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
