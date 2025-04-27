# News Aggregator App

A **React-based** news aggregation app that fetches and displays news from [**NewsAPI.org**](https://newsapi.org/). The app allows users to search for news articles with autocomplete suggestions and view top headlines from various categories.

**Live Demo:** [News Aggregator on Vercel](https://news-aggregator-react-nine.vercel.app/)

---
## V1.5 Updates
- Improved UI & Mobile experience
- Added article navigation in modal (Previous / Next)
- Use of local storage for caching fetched articles
- Cloud Convert Integration ( In - Progress)
---

## Features

**News Search Bar** - Provides real-time suggestions and autocomplete for news queries.  
**Top Headlines** - Displays the latest headlines from different categories.  
**Responsive UI** - Built using **Material UI (MUI)** and **Tailwind CSS** for a modern and user-friendly design.  

---

## Tech Stack

### **Backend**

- **Node.js**
- **Express.js**
- **Axios** (for making API requests)
- **Vercel Serverless Functions**

### **Frontend**

- **React.js (TypeScript)**
- **Material UI (MUI)**
- **Tailwind CSS**
- **React Query** (for API data management)

---

## Installation & Setup for local deployment

### **1. Clone the Repository**

```sh
git clone -b development https://github.com/Killersea/news-aggregator-react.git
cd news-aggregator-react
```
### **2. Setup Backend**

```sh
cd backend
npm install
```
Run the backend locally:
```sh
npm run dev
```
### **3. Setup Frontend**

```sh
cd ../frontend
npm install
```
Create a .env file in the frontend directory:
```sh
VITE_APP_API_KEY = "Your NewsAPI Key"
```
Run the frontend locally:
```sh
npm run dev
```
The app should now be running at http://localhost:5173
