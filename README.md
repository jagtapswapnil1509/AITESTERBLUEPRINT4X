# AI Tester Blueprint 4X

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**AI Tester Blueprint 4X** is a next-generation architecture and blueprint for AI-driven automated testing, intelligent test case generation, autonomous test execution, and comprehensive software quality assurance — organized across five progressive chapters.

---

## 🚀 Overview

AI Tester Blueprint 4X empowers engineering teams to integrate autonomous AI agents directly into their testing pipelines. By combining intelligent reasoning models, pattern recognition, and robust test runners, Blueprint 4X minimizes manual test creation while maximizing codebase coverage and reliability.

---

## 📁 Project Structure

```
AITESTERBLUEPRINT4X/
├── Chapter_01_LLM_Basics/
│   └── Anti_Hallucination_Rules.md          # Core verification rules for all AI/QA agents
├── Chapter_02_Prompt_Eng/
│   ├── 00_Task1.md                          # Salesforce login Selenium task
│   ├── 01_RICE_POT_Template.md              # RICE POT prompt engineering template
│   ├── 02_RICE_POT_Example.md               # RICE POT full example (Salesforce login)
│   ├── 03_Plan_Framework.md                 # RICE POT framework analysis & plan
│   ├── 25_TC_Using_Local_LLM.md             # 25 VWO login test cases via local LLM
│   ├── prompt_templates/
│   │   ├── API_Test_Case_Generation.md      # API endpoint test case prompt
│   │   ├── Negative_Test_Cases.md           # Negative testing prompt template
│   │   ├── PRD_to_Test_Cases.md             # PRD/SRS → test cases conversion prompt
│   │   └── testcase_creator.md              # Generic test case generation prompt
│   └── RICE_POT_Selenium_Advance_Framework/ # Enterprise Selenium + Java + Maven + TestNG framework
│       ├── pom.xml                          # Maven config (Selenium 4.x, TestNG 7.x)
│       ├── testng.xml                       # TestNG suite runner
│       ├── mvnw.cmd                         # Maven wrapper (Windows)
│       └── src/                             # Page Object + TestNG scripts
├── Chapter_03_Local_TC_Generator/
│   ├── app.py                               # Streamlit chat screen — Jira key detection + TC generation
│   ├── pages/settings.py                    # Settings — Jira creds, LLM provider, Groq key
│   ├── config_store.py                      # JSON flat-file config persistence (.config.json)
│   ├── jira_client.py                       # Jira REST API — fetch ticket summary/description/AC
│   ├── llm_client.py                        # Ollama (gemma3:1b) + Groq fallback with streaming
│   ├── templates/
│   │   ├── testcase_creator.md              # Generic test case prompt template
│   │   └── jira_tc_template.md              # Jira-specific structured TC prompt
│   └── requirements.txt                     # Python dependencies (streamlit, requests, ollama)
├── Chapter_04_JobKitAI/
│   ├── Jagtap_Swapnil_Resume_Redesigned.pdf  # Candidate master resume
│   ├── Job Description from LinkedIn.md      # Job descriptions sourced from LinkedIn
│   ├── Job Description from the Naukari.md   # Job descriptions sourced from Naukari
│   ├── output/                               # Tailored .docx resumes (one per company)
│   │   ├── Capgemini_Jagtap_Swapnil.docx
│   │   ├── Persistent Systems_Jagtap_Swapnil.docx
│   │   ├── HTC Global Services_Jagtap_Swapnil.docx
│   │   ├── Wipro_Jagtap_Swapnil.docx
│   │   ├── Zurich Cover-More_Jagtap_Swapnil.docx
│   │   ├── Quarks Technosoft_Jagtap_Swapnil.docx
│   │   ├── Huron_Jagtap_Swapnil.docx
│   │   ├── eLabs Infotech_Jagtap_Swapnil.docx
│   │   ├── Tata Consultancy Services_Jagtap_Swapnil.docx
│   │   └── Tudip Technologies_Jagtap_Swapnil.docx
│   └── resume-helper/
│       └── resume-tailor/
│           ├── references/
│           │   ├── resume-json.md           # Resume JSON spec
│           │   └── writing-rules.md         # Bullet formulas, ATS rules, style rules
│           ├── scripts/
│           │   ├── SKILL.md                 # Resume-tailoring workflow
│           │   └── build_resume.js          # JSON spec → .docx renderer
│           └── resume-tailor.zip
├── Chapter_05_JobTrackerAI/
│   ├── index.html                           # Vite entry — offline-first job pipeline tracker
│   ├── package.json                         # React 19 + TypeScript + Vite + Tailwind deps
│   ├── vite.config.ts                       # Vite build/dev config with @ alias
│   ├── tsconfig.json                        # TypeScript config
│   ├── metadata.json                        # AI Studio applet metadata
│   └── src/
│       ├── App.tsx                          # Root app component
│       ├── main.tsx                         # React entry point
│       ├── index.css                        # Global Tailwind styles
│       ├── components/                      # Board, table, analytics, modals, drawers
│       ├── types/job.ts                     # Job application domain types
│       ├── utils/                           # IndexedDB, storage, date/currency helpers
│       └── data/emailTemplates.ts           # AI-assisted email templates
├── README.md
└── .gitignore
```

---

## 📖 Chapter 01 — LLM Basics & Anti-Hallucination

Foundational rules every AI-powered QA agent must follow. Authored by [Pramod Dutta](https://www.linkedin.com/in/pramoddutta/) (Principal SDET, [The Testing Academy](https://thetestingacademy.com/)).

**Core principles:**
- Use **only** explicitly provided information (PRD, API docs, logs, screenshots, test data, user input).
- **Never** invent features, APIs, error codes, UI elements, or behavior.
- Missing info → respond with: *"Insufficient information to determine."*
- Inference → label as: *"Inference (low confidence)."*
- Output must be deterministic, repeatable, and traceable to provided input.

---

## 📖 Chapter 02 — Prompt Engineering

Covers structured prompt engineering techniques including the **RICE POT** framework:

| Component | Meaning |
| :--- | :--- |
| **R**ole | Expert persona (e.g., "Senior QA Architect, 15yr CRM domain") |
| **I**nstructions | Precise, constraint-heavy directives |
| **C**ontext | Domain background and target system details |
| **E**xample | Code patterns/snippets showing expected output shape |
| **P**arameters | External config, constraints, boundaries |
| **O**utput | Exact file count, format, structure |
| **T**one | Technical, precise, enterprise-grade |

**Prompt templates available:**
- PRD/SRS/JIRA → structured test cases
- API documentation → API test cases
- Feature requirements → negative test cases
- Generic requirements → test cases with anti-hallucination guardrails

**RICE POT Selenium Framework** — Enterprise-grade Selenium + Java + Maven + TestNG framework for Salesforce login automation. Page Object Model with PageFactory, xpath-only selectors, zero `Thread.sleep`, TestNG annotations, and robust exception handling.

---

## 📖 Chapter 03 — Local Test Case Generator (Streamlit App)

Two-screen Streamlit application that turns Jira tickets into test cases using a local or cloud LLM:

- **Chat Screen** — ChatGPT-style interface. Type `create test cases for QA-102` or paste a Jira ticket URL and the app fetches the ticket, merges its details into a structured prompt template, and streams generated test cases back.
- **Settings Screen** — Configure Jira URL/email/API token, choose Ollama (default, `gemma3:1b`) or Groq as fallback. **🔌 Test Ollama** and **☁️ Test Groq** buttons validate connectivity to both providers directly from the UI. All credentials persisted in `.config.json` (gitignored).

**Flow:** User message → Jira key detection → Jira REST API fetch → template merge → Ollama/Groq streaming → rendered test cases.

**Run it:**
```bash
cd Chapter_03_Local_TC_Generator
pip install -r requirements.txt
streamlit run app.py
```

---

## 📖 Chapter 04 — Job Kit AI

Resume-tailoring toolkit that turns a master resume plus a job description into a targeted, ATS-safe `.docx` resume for each role.

- **Master resume** — `Jagtap_Swapnil_Resume_Redesigned.pdf` is the single source of truth.
- **Job descriptions** — stored in `Job Description from LinkedIn.md` and `Job Description from the Naukari.md`, with the company name at the top of each entry.
- **Tailored output** — `output/` holds one Word document per company, named `<Company>_Jagtap_Swapnil.docx`.
- **Resume Tailor skill** — `resume-helper/resume-tailor/` contains the workflow (`SKILL.md`), writing rules (`references/writing-rules.md`), JSON schema (`references/resume-json.md`), and a `build_resume.js` renderer.

**Flow:** master resume + job description → extract JD requirements → cross-reference against the resume → write a tailored JSON spec → render to `.docx`.

---

## 📖 Chapter 05 — Job Tracker AI

An offline-first, full-featured job application tracker for managing the entire job-search pipeline in one place.

- **Kanban board** — drag-and-drop pipeline stages with status badges and priority tags.
- **Application records** — detailed entries with notes, contacts, follow-ups, and timeline tracking.
- **Schedule & table views** — alternate views for deadline management and dense data review.
- **Resume version tracking** — keep resume versions alongside each application.
- **Analytics dashboard** — pipeline insights and progress metrics.
- **Export / import** — JSON-based backup and restore of job data.
- **AI email assistant** — Google GenAI-powered follow-up email drafting.
- **Local-first storage** — IndexedDB keeps data private on-device with no backend sync.

**Tech stack:** React 19, TypeScript, Vite, Tailwind CSS, @dnd-kit, IndexedDB, Google GenAI.

**Run it:**
```bash
cd Chapter_05_JobTrackerAI
npm install
npm run dev
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended) or [Python](https://www.python.org/) (v3.10+ recommended)
- For Chapter 03: a local LLM runtime (Ollama, LM Studio, or similar)
- For RICE POT Framework: JDK 17+, Maven 3.8+

### Installation

```bash
git clone https://github.com/jagtapswapnil1509/AITESTERBLUEPRINT4X.git
cd AITESTERBLUEPRINT4X
```

### Running the RICE POT Selenium Tests

```bash
cd Chapter_02_Prompt_Eng/RICE_POT_Selenium_Advance_Framework
./mvnw clean test
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
