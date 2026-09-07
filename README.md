# AI Tester Blueprint 4X

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**AI Tester Blueprint 4X** is a next-generation architecture and blueprint for AI-driven automated testing, intelligent test case generation, autonomous test execution, and comprehensive software quality assurance — organized across eight progressive chapters.

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
├── Chapter_06_Branding_LinkedinSkills/
│   ├── README.md                             # Chapter overview and skill usage guide
│   ├── files.zip                             # Original archive of the skill bundle
│   ├── content-repurpose-pack.skill          # Packaged .skill bundle (zip of the folder)
│   └── content-repurpose-pack/               # Installable skill folder
│       ├── SKILL.md                          # Pipeline, hook protocol, closing sweep
│       └── references/
│           ├── brand-voice.md                # Identity, spine, 13 threads, signature lines
│           ├── deliverable-specs.md          # Exact formats for the four pack files
│           └── worked-example.md             # One full input-to-output pass
├── Chapter_07_AI_Agents/
│   └── Test-Plan-Agent-Blast/                 # B.L.A.S.T. Jira-to-Test-Plan agent
│       ├── app.py                             # Streamlit UI
│       ├── run.py                             # CLI entry point
│       ├── navigation.py                      # Pipeline router
│       ├── tools/                             # jira_fetch, normalize, llm_client, render, ...
│       ├── architecture/                      # Six markdown SOPs (logic before code)
│       ├── schemas/                           # JSON Schema contracts for plan + ticket
│       ├── fixtures/                          # Rich + thin ticket fixtures (no network)
│       ├── tests/test_pipeline.py             # 45 offline checks
│       ├── BLAST.md                           # Blueprint/Link/Architect/Stylize/Trigger protocol
│       ├── LLM.md                             # Project constitution
│       └── README.md                          # Chapter overview
├── Chapter_08_n8n/
│   ├── Agents/
│   │   ├── 01_FetchJiraTicket_AI_Agent.json                # Chat → fetch a Jira issue
│   │   ├── 02_CreateJiraTicket_AI_Agent.json               # Chat → create a Jira issue
│   │   ├── 03_FetchJira_CreateTestCase_Agent_LocalLLM.json # Fetch Jira → test plan (local LLM)
│   │   ├── 04_BugTriage_AI_Agent.json                      # Bulk triage Jira bugs → Google Sheets
│   │   ├── 05_RCA_Chatgpt_Jira_Production_Bug_RCA_Automation.json # Production bug → RCA → Sheets + Excel
│   │   ├── 06_Social_Media_AIAgent.json                    # Scheduled LinkedIn post + image
│   │   └── 07_Social_Post_Generator (Gemini+ Upload Post).json # Gemini image + LinkedIn post upload
│   └── Resources/
│       ├── 01_Raw_BugTriage.prompt.md                      # Original bug-triage prompt
│       ├── 02_ModifiedBugTriagePrompt.prompt.md            # Refined bug-triage prompt
│       ├── 03_RCA_AI_Agent.prompt.md                       # Production-bug RCA agent prompt
│       ├── Jira_Bug_Triage_Sample.xlsx                     # Sample triage output spreadsheet
│       └── VWO-49_RCA.doc                                  # Reference RCA document
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

## 📖 Chapter 06 — Branding & LinkedIn Skills

A Claude/Codex skill (`content-repurpose-pack`) that turns any content seed into a publish-ready pack in Pramod Dutta's Testing Academy voice. Drop in a title, rough bullets, a screenshot, a URL, a thread, or a spoken brain dump, and it returns four files: a Medium article, a LinkedIn post, LinkedIn image prompts, and a Medium cover prompt.

- **Hook / Story / Offer spine** — every piece follows the same three beats with strict word budgets.
- **Four deliverables** — `pack-1-medium-article.md`, `pack-2-linkedin-post.md`, `pack-3-linkedin-image-prompts.md`, and `pack-4-medium-image-prompt.md`.
- **Voice enforcement** — re-reads `brand-voice.md` every run, maps content to one of 13 threads, and runs a closing sweep against em dashes, banned phrases, and word counts.
- **Controversial hook ladder** — graded A/B/C hooks without sanitizing, with X-vs-LinkedIn placement guidance.
- **Install** — copy `content-repurpose-pack/` into `$HOME/.claude/skills/` or `$HOME/.codex/skills/`, or load `content-repurpose-pack.skill` into a `.skill`-compatible client.

---

## 📖 Chapter 07 — AI Agents

A Jira ticket in, a formal test plan out — built on the **B.L.A.S.T.** protocol (Blueprint, Link, Architect, Stylize, Trigger) over the **A.N.T.** three-layer architecture (Architecture → Navigation → Tools).

- **Seven-step pipeline** — parse key → fetch Jira → normalize ADF → readiness gate → single Groq call → render → output. Six steps are deterministic Python; exactly one calls a model, so failures are traceable to the exact step.
- **Anti-hallucination by design** — the agent never invents acceptance criteria, URLs, dates, or tools; anything not on the ticket lands in an `Assumptions` table, and every scope entry carries a `justified_by` ticket fact.
- **Readiness gate** — thin tickets (below 5/11) are refused with a gap report naming what to add, unless `--force` is used.
- **Strict contracts** — the model returns JSON validated against `schemas/plan.schema.json`, and `render.py` owns the output format so the model can't drift from the template.
- **Dual interface** — Streamlit UI plus a CLI (`python run.py VWO-49`, `--health`, `--dry-run`, `--force`), with 45 offline pipeline checks in `tests/test_pipeline.py`.

**Run it:**
```bash
cd Chapter_07_AI_Agents/Test-Plan-Agent-Blast
pip install -r requirements.txt
cp .env.example .env          # fill in Jira + Groq credentials, or use the Settings page
streamlit run app.py
```

---

## 📖 Chapter 08 — n8n AI Agents

Seven importable n8n AI Agent workflows plus supporting prompt/sample resources, built with n8n's LangChain AI Agent node and Jira Software Cloud / Google Workspace / LinkedIn integrations.

- **Fetch Jira Ticket Agent** — `01_FetchJiraTicket_AI_Agent.json` extracts an issue key from a chat message and fetches the issue via the `Get an issue in Jira Software` tool.
- **Create Jira Ticket Agent** — `02_CreateJiraTicket_AI_Agent.json` creates a new Jira issue (summary + description) from a chat prompt via the `Create an issue in Jira Software` tool.
- **Fetch Jira → Test Case Agent (Local LLM)** — `03_FetchJira_CreateTestCase_Agent_LocalLLM.json` takes a Jira ID, fetches the issue, and generates a test plan — runnable 100% locally via Ollama (`llama3.2`), with a Groq fallback.
- **Bug Triage AI Agent** — `04_BugTriage_AI_Agent.json` retrieves Jira bugs and triages each one (severity, priority, disposition, category, suspected layer, confidence) into a Google Sheet, appending or updating by `jira_key`.
- **Production Bug RCA Automation** — `05_RCA_Chatgpt_Jira_Production_Bug_RCA_Automation.json` listens for production-bug Jira events, builds an evidence package, generates a structured Root Cause Analysis, and writes it to a Google Sheets template plus an exported `.xlsx`, with deduplication, versioning, and an audit log.
- **Social Media AI Agent** — `06_Social_Media_AIAgent.json` runs on a schedule to generate a LinkedIn post topic, create the post, generate a Gemini image, add hashtags, review, and publish.
- **Social Post Generator (Gemini + Upload Post)** — `07_Social_Post_Generator (Gemini+ Upload Post).json` generates a topic (Gemini), writes the LinkedIn post (GPT-5-mini), creates a Gemini image, converts it to a file, sends it via Telegram, and uploads the post to LinkedIn.

**Resources** — `Chapter_08_n8n/Resources/` holds the raw and refined bug-triage prompts, the production-bug RCA agent prompt, a sample `Jira_Bug_Triage_Sample.xlsx`, and a reference `VWO-49_RCA.doc`.

**Import:**
1. In n8n, go to **Workflows → Import from File** and select one of the JSON files in `Chapter_08_n8n/Agents/`.
2. Reconnect each `Brain` / chat model node to your LLM credential (OpenAI, Groq, or Ollama), the Jira node to your Jira Software Cloud credential, and Google/Drive/Sheets nodes to your Google credential as applicable.
3. Activate the workflow and use its trigger (chat, schedule, or Jira webhook) to interact with the agent.

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
