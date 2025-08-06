# BrainBank 🧠

Welcome to **BrainBank**, a powerful and intelligent knowledge management platform designed for both individuals and teams. It allows users to save, organize, search, and share various types of content, from simple notes and links to complex information. With a robust backend built on Node.js and Express, it leverages AI to provide deep, semantic search and content analysis capabilities.

The platform is architected around two main concepts: a **Personal Brain** for individual users and an **Organizational Brain** for collaborative teams, complete with role-based access control and administrative features.

---

## ✨ Key Features

### 👤 User & Organization Management
* **Personal & Org Accounts 💼**: Seamlessly switch between a personal workspace and multiple organizational workspaces.
* **Secure Authentication 🔐**: JWT-based authentication for users and organizations with bcrypt-hashed passwords.
* **Organization Creation 🏢**: Users can create their own organizations and become the 'Creator'.
* **Role-Based Access Control 👑**:
    * **Creator**: Full ownership and control over the organization.
    * **Admins**: Can manage members, content, and send invitations.
    * **Members**: Can contribute and access content within the organization.
* **Team Management 👨‍👩‍👧‍👦**: Promote, demote, and remove members within an organization.
* **Email Invitations 📧**: Securely invite new members to an organization via unique, expiring email links using Nodemailer and Google OAuth2.

### 🧠 Content & Knowledge Management
* **Add Diverse Content 📝**: Save anything from articles, links, documents, to simple notes.
* **Rich Metadata 🏷️**: Add titles, descriptions, links, and tags to each piece of content for better organization.
* **Fetch & Filter 🔍**: Efficiently retrieve content, filter by type, or fetch the most recent additions.
* **Public Sharing 🌐**: Generate unique, shareable links to broadcast your personal or organizational brain to the public.

### 🤖 AI-Powered Capabilities
* **Semantic Vector Search 🔎**: Automatically generates **768-dimensional** vector embeddings for all content using Google's `text-embedding-004` model. Perform incredibly accurate searches that go beyond keywords.
* **YouTube Video Analysis 🎬**: Provide a YouTube video link and ask questions to get detailed information and summaries directly from the video's content, powered by the `Gemini Model`.
* **Twitter Sentiment Analysis 🐦**: Analyze the sentiment of any tweet to get a quick summary (*Positive, Negative, Neutral*) and a justification for the analysis.

---

## 🛠️ Tech Stack
[![My Skills](https://skillicons.dev/icons?i=react,vite,tailwindcss,ts,nodejs,express,mongodb,gmail,ai,aws,nginx,ssl&perline=6&theme=dark)](https://skillicons.dev)
<p align="left">
<img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white" alt="Mongoose" />
<img src="https://img.shields.io/badge/JWT-black?style=flat-square&logo=json-web-tokens&logoColor=white" alt="JWT" />
<img src="https://img.shields.io/badge/Bcrypt-E9E9E9?style=flat-square&logo=hashnode&logoColor=black" alt="Bcrypt" />
<img src="https://img.shields.io/badge/Zod-blue?style=flat-square&logo=typescript&logoColor=white" alt="Zod" />
<img src="https://img.shields.io/badge/Recoil-purple?style=flat-square&logo=recoil&logoColor=white" alt="Recoil" />
<img src="https://img.shields.io/badge/Motion-yellow?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
<img src="https://img.shields.io/badge/PM2-purple?style=flat-square&logo=framer&logoColor=white" alt="PM2" />
</p>

* **Frontend**: React.js, TailwindCSS, Motion, Recoil
* **Backend**: Node.js, Express.js
* **Language**: TypeScript
* **Database**: MongoDB with Mongoose (and Atlas Vector Search)
* **AI & Vector Embeddings**: Google Generative AI (Gemini, text-embedding-004)
* **Authentication**: JSON Web Tokens (JWT), bcrypt
* **Emailing**: Nodemailer, GoogleAPIs (OAuth2)
* **API Clients**: Axios
* **Validation**: Zod
* **Environment Management**: dotenv

---

## 🚢 Deployment & Infrastructure

* **Backend Hosting (AWS EC2) ☁️**: The Node.js backend application is hosted on an Amazon EC2 instance. This provides a reliable and scalable virtual server environment to run the API.
* **Reverse Proxy (Nginx) 🛡️**:Nginx is used as a high-performance reverse proxy. It sits in front of the Node.js application, handling incoming HTTP requests and forwarding them to the appropriate pm2 process. This setup also facilitates load balancing and SSL termination.
Nginx is also configured to act as an object store, efficiently serving static assets and user-uploaded files, which reduces the load on the Node.js application.
* **Process Management (PM2) 🔄**: PM2 acts as the production process manager for Node.js application. It keeps the BrainBank API alive, reloading it without downtime, and helps manage application logging, monitoring, and clustering.
* **Content Delivery Network (Bunny CDN) 🐰**: To ensure fast content delivery to users worldwide, Bunny CDN is used. It caches static assets (like images, CSS, and JS files) at edge locations closer to the user, significantly reducing latency and improving the user experience.
