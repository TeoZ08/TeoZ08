from pathlib import Path

readme = r'''<div align="center">

# Hi, I'm Matteo 👋

### Computer Science @ UFMS • Backend Development • C# / .NET

Building backend systems, integrations, automation and applied AI — while turning academic ideas into real projects.

[![GitHub](https://img.shields.io/badge/GitHub-TeoZ08-181717?style=for-the-badge&logo=github)](https://github.com/TeoZ08)
[![Profile views](https://komarev.com/ghpvc/?username=TeoZ08&style=for-the-badge&label=PROFILE+VIEWS)](https://github.com/TeoZ08)
<!-- Replace the URL below with your LinkedIn profile -->
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Matteo%20Lima%20Scotti-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](YOUR_LINKEDIN_URL)

</div>

---

## `$ whoami`

```txt
name      Matteo Lima Scotti
location  Campo Grande, MS — Brazil
degree    Computer Science @ UFMS
role      Backend Development Intern
focus     C# • .NET • APIs • integrations • software engineering
```

I like projects that connect **software engineering with something tangible**: backend services, device/system integrations, automation, AI-assisted workflows and interactive experiences.

Right now, most of my attention is on **C#/.NET backend development**, while I keep experimenting with web, infrastructure and applied AI.

---

## ⚙️ Core stack

<div align="center">

![C#](https://img.shields.io/badge/C%23-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

### Also building with

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

---

## 🧭 What I'm working on

- **Backend engineering** with C# and the .NET ecosystem.
- **REST APIs, business rules and persistence** in real systems.
- **System/device integrations** and data flows between software and external equipment.
- **Automation and AI workflows** for practical tasks.
- **Computer Science at UFMS**, connecting theory with projects whenever possible.

---

## 🚀 Selected projects

<table>
<tr>
<td width="50%" valign="top">

### 🤖 JARVIS Acadêmico
Academic assistant built around **RAG, LLMs and tool calling**, combining retrieval with a web interface.

`React` `FastAPI` `Python` `RAG` `LLMs` `Docker`

[View repository →](https://github.com/TeoZ08/jarvis-academico)

</td>
<td width="50%" valign="top">

### 👵 UNAPI
Technology and digital inclusion work connected to UFMS extension activities, including interactive materials and practical workshops.

`Web` `Accessibility` `Digital Inclusion` `Education`

[Explore my repositories →](https://github.com/TeoZ08?tab=repositories)

</td>
</tr>

<tr>
<td width="50%" valign="top">

### 💧 AquaIA
Academic project combining software and applied AI, created in the UFMS environment.

`Python` `Flask` `Gemini` `SQLite` `Leaflet`

[View repository →](https://github.com/TeoZ08/aquaia_ufms)

</td>
<td width="50%" valign="top">

### 🛍️ useART
E-commerce project exploring a complete product flow, authentication, database and deployment.

`Next.js` `TypeScript` `Supabase` `PostgreSQL`

[View repository →](https://github.com/TeoZ08/useART)

</td>
</tr>
</table>

---

## 🧪 Current lab

Things I'm actively studying, testing or applying:

```text
Backend        C# • .NET • EF Core • APIs • repositories • business rules
Data           SQL • PostgreSQL • MongoDB
Infrastructure Docker • Linux • Kubernetes concepts
AI             RAG • LLM integrations • agents • automation
Web            Next.js • React • TypeScript
Networks       TCP/IP • P2P • device communication • local integrations
```

---

## 📊 GitHub snapshot

<div align="center">

<img height="165" src="https://github-readme-stats.vercel.app/api?username=TeoZ08&show_icons=true&hide_border=true&rank_icon=github&theme=github_dark" />
<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=TeoZ08&layout=compact&hide_border=true&theme=github_dark" />

</div>

> Stats are fun. Shipping useful things matters more.

---

## 🎯 2026

```mermaid
flowchart LR
    A[Computer Science] --> B[Backend]
    B --> C[C# / .NET]
    C --> D[Real systems]
    D --> E[Integrations]
    E --> F[Automation + AI]
```

My current goal is simple: **get progressively better at building reliable software, understanding the systems behind it, and documenting what I learn along the way.**

---

<div align="center">

### `build → test → understand → improve`

<sub>Matteo Lima Scotti • Campo Grande, MS 🇧🇷</sub>

</div>
'''

path = Path("/mnt/data/README.md")
path.write_text(readme, encoding="utf-8")
print(path)
