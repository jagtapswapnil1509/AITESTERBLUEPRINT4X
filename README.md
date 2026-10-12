# AI Tester Blueprint 4X

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**AI Tester Blueprint 4X** is a next-generation architecture and blueprint for AI-driven automated testing, intelligent test case generation, autonomous test execution, and comprehensive software quality assurance — organized across fourteen progressive chapters.

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
│   │   ├── 07_Social_Post_Generator (Gemini+ Upload Post).json # Gemini image + LinkedIn post upload
│   │   ├── 08_Screenshot_To_Bug_Reporter_AIAgent.json      # Screenshot → Groq vision → Jira bug + attachment
│   │   ├── 09_Screenshot_To_Bug_Reporter_AIAgent_UI.json   # Webhook variant serving the Vercel UI
│   │   ├── Plan.md                                         # Model research & architecture notes
│   │   └── Prompt.md                                       # Build prompt + failure post-mortem
│   └── Resources/
│       ├── 01_Raw_BugTriage.prompt.md                      # Original bug-triage prompt
│       ├── 02_ModifiedBugTriagePrompt.prompt.md            # Refined bug-triage prompt
│       ├── 03_RCA_AI_Agent.prompt.md                       # Production-bug RCA agent prompt
│       ├── Jira_Bug_Triage_Sample.xlsx                     # Sample triage output spreadsheet
│       └── VWO-49_RCA.doc                                  # Reference RCA document
├── Chapter_09_LangFlow/
│   ├── Notes.md                                             # LangFlow setup notes (pip + venv)
│   ├── AI_Agents/
│   │   ├── 01_LangFlow_Simple_HelloWorld.json               # Hello World flow (Groq)
│   │   ├── 002_AI4X_002_Bug_Triage_AI_Agent.json            # Bug triage agent (DeepSeek + Jira)
│   │   ├── 03_AI4X_003_Bug_Triage_AI_Agent_Agentic.json     # Agentic bug triage (Agent node)
│   │   └── 004_AI4X_004_Bug_Triage_AI_Agent_Via_UI.json     # Bug triage exposed for a web UI
│   └── ui_bugtriage/                                        # React (Vite) chat UI for the Via-UI flow
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       ├── vercel.json
│       ├── .env.example
│       ├── api/run.js                                       # Vercel serverless proxy (injects x-api-key)
│       └── src/
│           ├── App.jsx
│           ├── main.jsx
│           └── styles.css
├── Chapter_10_RAG_Basics/
│   └── 01_RAG_Explorer/                              # Watchable RAG pipeline (PDF → chunks → vectors → answer)
│       ├── README.md                                 # Chapter overview + run guide
│       ├── run.sh                                    # Starts Ollama + backend + frontend (http://localhost:5190)
│       ├── data/
│       │   └── Product Requirements Document_ VWO Login Dashboard (8).pdf  # 7-page PRD corpus
│       ├── server/app.py                             # Whole pipeline in one file (~330 lines)
│       ├── scripts/
│       │   ├── export_chunks.py                      # Dump chunks to JSON
│       │   └── chunks.json                           # Pre-exported chunks
│       ├── api/chat.js                               # Vercel serverless proxy
│       ├── vercel.json                               # Vercel deploy config
│       └── ui/                                       # React (Vite) three-tab UI
│           ├── index.html
│           ├── package.json
│           ├── vite.config.js
│           ├── build-index.mjs                       # Static chunk index for the hosted demo
│           └── src/
│               ├── App.jsx                           # Ingest & Chunks / Search / Chat tabs
│               ├── engine.js                         # Client-side similarity + embedding engine
│               ├── main.jsx
│               └── styles.css
├── Chapter_11_RAG_Implementation/
│   ├── 00_NAIVE_RAG/
│   │   ├── Prompt.md                                    # ChatGPT thread that generated the corpus
│   │   ├── data/
│   │   │   └── Wingify_Login_100_Jira_Test_Cases.csv    # 100 Wingify login test cases (18 fields)
│   │   ├── langflow/
│   │   │   ├── Ai4x_Naive_RAG.json                      # Naive RAG LangFlow flow (AstraDB)
│   │   │   └── VWO_500_Test_Cases.csv                   # 500 test-case corpus
│   │   └── n8n/
│   │       ├── 01_Naive_RAG.json                        # 15 nodes: blind text splitting
│   │       └── 01_Naive_RAG - Complete Test Cases.json  # 20 nodes: one document per row
│   ├── 01_ADVANCE_RAG/
│   │   └── Ai4x_Advance_RAG.json                        # Advanced RAG (AstraDB + Cohere rerank)
│   └── LangFlow/
│       ├── AI_3X_NaiREADY_ve RAG_Imporve_Chunk.json     # Improved-chunking (OpenAI + Chroma)
│       ├── New Flow (1) (3).json                        # NVIDIA embeddings + AstraDB + Groq
│       ├── Advance_RAG/
│       │   └── Ai4x_Advance_RAG.json                    # Advanced RAG (AstraDB + Cohere rerank)
│       └── Fixed/
│           ├── Fixed_AI4X_Naive_RAG.json                # Fixed naive RAG (AstraDB)
│           └── VWO_500_Test_Cases.csv                   # 500 test-case corpus
├── Chapter_12_RAG_QA_BuddyAI/
│   ├── README.md                                     # Chapter overview + the five design decisions
│   ├── run.sh                                        # Starts Qdrant + Ollama, ingests, http://localhost:8300
│   ├── requirements.txt                              # Python deps (qdrant-client, sentence-transformers, ...)
│   ├── sources.yaml                                  # Maps each data folder to its chunker
│   ├── glossary.yaml                                 # Team shorthand expanded at query time
│   ├── api/                                          # Vercel serverless demo proxy
│   ├── data/                                         # 10 source folders (test cases, Jira, docs, notes, charts, logs, code)
│   ├── deploy/                                       # Dockerfile, Compose, Caddyfile, DEPLOY.md, hourly cron
│   ├── docs/                                         # RCA answer + retrieval-trace screenshots
│   ├── eval/                                         # golden.yaml retrieval set + last_run.json
│   ├── qabuddy/                                      # Python package: ingest, chunkers/, embed, retrieve, rerank, answer
│   ├── tests/test_pipeline.py                        # 18 regression tests
│   └── ui/                                           # React (Vite) cited-answer chat UI
├── Chapter_13_MCP_Basics/
│   └── MCP_Inspector.md                              # What MCP is: host/client/server + tools/resources/prompts
├── Chapter_14_MCP_Create_VIBE/
│   ├── 00_Objective.md                               # Goal: expose the 5,000 VWO test cases as MCP tools
│   ├── 01_TestCreatorMCP.plan.md                     # Build plan (data profile, 21 tools, ranking, suite rules)
│   ├── 02_prompt.md                                  # The 13 prompts used to build both servers, with outcomes
│   ├── assets/                                       # Codex-rendered sketchnotes + their briefs
│   ├── data/
│   │   └── vwo_5000_test_cases.csv                   # Source-of-truth test-case catalog
│   ├── testcase-creator-mcp/                         # FastMCP 4.1 server — 21 tools, 4 resources, 3 prompts
│   │   ├── pyproject.toml
│   │   ├── README.md                                 # Connection options (Inspector, Claude Code, VS Code, Cursor)
│   │   ├── src/tc_mcp/                               # server, repository, ranking, validation, resolver, tools/
│   │   └── tests/                                    # 33 offline tests
│   └── testskill-finder-mcp/                         # FastMCP 4.1 server — 100 skills, 15 tools, 103 prompts
│       ├── pyproject.toml
│       ├── README.md                                 # Connection options + the skill catalog
│       ├── skills/                                   # 100 SKILL.md files + CATALOG.md
│       ├── src/tsf_mcp/                              # catalog, search, sync, tools
│       └── tests/                                    # 42 tests
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

Nine importable n8n workflows plus supporting prompt/sample resources, built with n8n's LangChain AI Agent node and Jira Software Cloud / Google Workspace / LinkedIn integrations. The two screenshot-to-bug workflows (08–09) are deterministic node chains with a single bounded vision call rather than an AI Agent node.

- **Fetch Jira Ticket Agent** — `01_FetchJiraTicket_AI_Agent.json` extracts an issue key from a chat message and fetches the issue via the `Get an issue in Jira Software` tool.
- **Create Jira Ticket Agent** — `02_CreateJiraTicket_AI_Agent.json` creates a new Jira issue (summary + description) from a chat prompt via the `Create an issue in Jira Software` tool.
- **Fetch Jira → Test Case Agent (Local LLM)** — `03_FetchJira_CreateTestCase_Agent_LocalLLM.json` takes a Jira ID, fetches the issue, and generates a test plan — runnable 100% locally via Ollama (`llama3.2`), with a Groq fallback.
- **Bug Triage AI Agent** — `04_BugTriage_AI_Agent.json` retrieves Jira bugs and triages each one (severity, priority, disposition, category, suspected layer, confidence) into a Google Sheet, appending or updating by `jira_key`.
- **Production Bug RCA Automation** — `05_RCA_Chatgpt_Jira_Production_Bug_RCA_Automation.json` listens for production-bug Jira events, builds an evidence package, generates a structured Root Cause Analysis, and writes it to a Google Sheets template plus an exported `.xlsx`, with deduplication, versioning, and an audit log.
- **Social Media AI Agent** — `06_Social_Media_AIAgent.json` runs on a schedule to generate a LinkedIn post topic, create the post, generate a Gemini image, add hashtags, review, and publish.
- **Social Post Generator (Gemini + Upload Post)** — `07_Social_Post_Generator (Gemini+ Upload Post).json` generates a topic (Gemini), writes the LinkedIn post (GPT-5-mini), creates a Gemini image, converts it to a file, sends it via Telegram, and uploads the post to LinkedIn.
- **Screenshot To Bug Reporter Agent** — `08_Screenshot_To_Bug_Reporter_AIAgent.json` takes a screenshot upload plus optional error logs, steps, severity, and environment via an n8n form, sends it to a Groq vision model (`qwen/qwen3.6-27b`, JSON mode), and files a structured Jira bug with the screenshot attached.
- **Screenshot To Bug Reporter Agent (UI)** — `09_Screenshot_To_Bug_Reporter_AIAgent_UI.json` is the webhook/JSON API variant of 08 (`qwen/qwen3.8-27b`) that serves the Vercel UI in `/ui_screenshotbugAIAgent` via a serverless proxy, returning the filed ticket as JSON.

**Resources** — `Chapter_08_n8n/Resources/` holds the raw and refined bug-triage prompts, the production-bug RCA agent prompt, a sample `Jira_Bug_Triage_Sample.xlsx`, and a reference `VWO-49_RCA.doc`. Design notes and the build/failure post-mortem for the screenshot-to-bug agents live in `Chapter_08_n8n/Agents/Plan.md` and `Prompt.md`.

**Import:**
1. In n8n, go to **Workflows → Import from File** and select one of the JSON files in `Chapter_08_n8n/Agents/`.
2. Reconnect each `Brain` / chat model node to your LLM credential (OpenAI, Groq, or Ollama), the Jira node to your Jira Software Cloud credential, and Google/Drive/Sheets nodes to your Google credential as applicable.
3. Activate the workflow and use its trigger (chat, schedule, or Jira webhook) to interact with the agent.

---

## 📖 Chapter 09 — LangFlow

Visual, low-code LLM workflow builder for assembling AI agent flows. This chapter builds a Bug Triage agent four ways — from a minimal Hello World to an agentic loop to a flow served behind a browser UI.

- **Hello World Flow** — `AI_Agents/01_LangFlow_Simple_HelloWorld.json` is the minimal LangFlow flow (ChatInput → Groq → ChatOutput) to verify a working environment.
- **Bug Triage AI Agent** — `AI_Agents/002_AI4X_002_Bug_Triage_AI_Agent.json` fetches a Jira bug and has a DeepSeek model return a structured triage (severity, priority, and QA comments).
- **Agentic Bug Triage** — `AI_Agents/03_AI4X_003_Bug_Triage_AI_Agent_Agentic.json` wraps the same objective in a LangFlow Agent node (Objective → Tool → Action → Result) so the model drives its own tool calls against Jira.
- **Bug Triage via UI** — `AI_Agents/004_AI4X_004_Bug_Triage_AI_Agent_Via_UI.json` exposes the triage flow behind a chat endpoint for a browser frontend.

**Bug Triage UI** — `ui_bugtriage/` is a light-mode React (Vite) chat UI for the Via-UI flow. Type a Jira key, hit Run, and get the triage rendered as markdown (tables included). A Vite dev proxy rewrites `/api/run` to the LangFlow endpoint and injects `x-api-key`, keeping the key out of client-side JS and avoiding CORS.

**Setup:**
```bash
# LangFlow (Option 1 from Notes.md)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install langflow
langflow run                    # http://localhost:7860

# Bug Triage UI
cd Chapter_09_LangFlow/ui_bugtriage
npm install
cp .env.example .env.local      # fill LANGFLOW_URL / LANGFLOW_FLOW_ID / LANGFLOW_API_KEY
npm run dev                     # http://localhost:5180
```

**Import** — In LangFlow, import each JSON from `AI_Agents/` into a project and reconnect the model node (Groq or DeepSeek) and Jira credentials.

---

## 📖 Chapter 10 — RAG Basics

RAG (Retrieval Augmented Generation) lets an LLM answer from *your* documents instead of its training data: split a document into chunks, embed each chunk, and at question time retrieve the closest chunks and paste them into the prompt.

- **RAG Explorer** — `01_RAG_Explorer/` is a RAG pipeline you can watch happen, pointed at a 7-page VWO Login Dashboard PRD. Every stage is on screen: raw extraction, repair, chunks, the 768-number vectors, similarity scores, and the verbatim prompt that reaches the model.
- **Local-first ingest** — extract (pypdf) → normalise (regex) → chunk (word windows + overlap) → embed (`nomic-embed-text` via Ollama, 768d) → store/search (ChromaDB, cosine) all run locally; only the top-3 retrieved chunks go to Groq (`gpt-oss-120b`) for the Chat tab.
- **Three tabs** — **Ingest & Chunks** (chunk size/overlap sliders plus before/after normalisation), **Search** (retrieval with no LLM, ranked by cosine similarity), and **Chat** (same retrieval + a grounded answer with token counts and the verbatim prompt).
- **The normalisation gotcha** — pypdf returns Google-Docs-exported PDFs as one word per line, which embeds into noise; the normaliser rejoins them (removing 2,432 chars of junk on this file).

**Run it:**
```bash
cd Chapter_10_RAG_Basics/01_RAG_Explorer
./run.sh            # http://localhost:5190
```

**Requirements:** Ollama with `nomic-embed-text` (`ollama pull nomic-embed-text`), Python 3.10+, Node 18+, and a `GROQ_API_KEY` in `.env` (only needed for the Chat tab).

---

## 📖 Chapter 11 — RAG Implementation

RAG over a CSV corpus of Wingify login test cases, scaling from Chapter 10's local Chroma index to hosted vector stores. The naive baseline ingests a hundred near-identical records and shows why blind splitting fails; the advanced flow adds reranking.

- **Naive RAG** — `00_NAIVE_RAG/` is built around `data/Wingify_Login_100_Jira_Test_Cases.csv` (100 cases, 18 fields, ~30k words). Two n8n workflows ingest and retrieve: `01_Naive_RAG.json` (15 nodes, default Recursive Character Text Splitter) vs `01_Naive_RAG - Complete Test Cases.json` (20 nodes, one document per CSV row with the row's fields as metadata). Stack per the source notes: Pinecone index `airagnew`, namespace `wingify-login-v2`, `text-embedding-3-large`, `gpt-5-mini`.
- **Naive RAG in LangFlow** — `00_NAIVE_RAG/langflow/Ai4x_Naive_RAG.json` mirrors the naive ingest pipeline (File → Parser → SplitText → AstraDB vector store) with a chat retrieval leg, using `VWO_500_Test_Cases.csv` as a 500-case corpus.
- **Advanced RAG** — `01_ADVANCE_RAG/Ai4x_Advance_RAG.json` is a LangFlow flow that adds a DataStax AstraDB vector store plus Cohere reranking (mirrored in `LangFlow/Advance_RAG/`).
- **LangFlow variants** — `LangFlow/AI_3X_NaiREADY_ve RAG_Imporve_Chunk.json` (improved chunking over OpenAI embeddings + Chroma), `LangFlow/New Flow (1) (3).json` (NVIDIA embeddings + AstraDB + Groq), and `LangFlow/Fixed/Fixed_AI4X_Naive_RAG.json` (fixed naive flow) with a second `VWO_500_Test_Cases.csv`.

**Key lesson:** a hundred near-identical records is the hard case for retrieval — the vectors cluster tightly and top-k barely discriminates. The "complete" workflow never splits text; it builds one document per row and attaches `category`/`scenario_type` as metadata so you can filter before ranking. The CSV also carries a UTF-8 BOM (`﻿Test Case ID`), handled via `enableBOM: true` in n8n or a `replace(/^﻿/, '')` strip.

**Import:** in n8n, use **Workflows → Import from File** for `00_NAIVE_RAG/n8n/*.json` and reconnect the Pinecone/OpenAI credentials; in LangFlow, import the JSONs from `00_NAIVE_RAG/langflow/`, `01_ADVANCE_RAG/`, and `LangFlow/` and reconnect the vector-store, embedding, and model nodes.

## 📖 Chapter 12 — RAG QA Buddy AI

Multi-source hybrid RAG that turns one QA question into one **cited** answer grounded in the team's real material — test cases, Jira bugs, PRDs, meeting notes, Lucid charts, Jenkins logs, and both automation frameworks. Fully self-hosted: the embedding model and vector database run on your own machine or VPS.

- **Retrieval** — Qwen3-Embedding-4B (via Ollama, truncated to 1024 dims) plus a code-aware BM25 vector in one Qdrant collection, fused with native RRF and then reranked by `bge-reranker-v2-m3`.
- **Source-aware chunking** — the rule is "chunk along the unit a QA engineer asks about": one test-case row, one Jira comment, a heading-aware PRD section, one log-failure window, or a tree-sitter AST node — never bare character counts.
- **Six modes** — 💬 Ask anything, 🧯 Failure analysis (RCA), 🧪 Test design & gaps, 🐞 Bug triage, 🛠️ Framework coding help, and 🧭 Traceability (RTM).
- **Results** — all four retrievers hit 100% @k=6 on a 24-question golden set; MRR climbs from 0.83 (dense) to 0.91 (full pipeline). 18 regression tests pin the bugs found while building.
- **Ingest & deploy** — incremental by sha256 per file, Jira via REST + JQL (`sync-jira`), and a `deploy/` bundle (Docker Compose + Caddy HTTPS + hourly auto-ingest cron).

**Run it:**
```bash
cd Chapter_12_RAG_QA_BuddyAI
./run.sh            # starts Qdrant + Ollama, ingests on first run, opens http://localhost:8300
```

---

## 📖 Chapter 13 — MCP Basics

Concept notes on the Model Context Protocol: how an application exposes tools, resources and prompts to an LLM, and why MCP is not just another API.

- **MCP vs API** — MCP is an open standard for connecting AI applications (Claude Code, Codex, Cursor, VS Code, Kiro) to external systems (Jira, Slack, Playwright, Selenium, GitHub, Postgres).
- **The three roles** — the **host** runs the model, the **client** lives inside the host and holds a 1:1 connection to a **server**, and the **server** exposes one tool or data source in a standard shape the AI can understand.
- **Tools / Resources / Prompts** — tools are the action-oriented verbs (like a POST), resources are read-only context (like a GET), and prompts are pre-built recipes stored on the server.
- **Hands-on** — installing the Playwright MCP in VS Code and Antigravity.

---

## 📖 Chapter 14 — Create MCP (VIBE)

Two working **FastMCP 4.1** MCP servers, built prompt-first (the exact 13 prompts, with outcomes, are in `02_prompt.md`) from a CSV catalog and a skills library. Neither server calls an LLM — the client's model does the reasoning — so both stay deterministic, free and offline, with no API keys to share.

- **TestCreator MCP** — `testcase-creator-mcp/` turns `data/vwo_5000_test_cases.csv` (5,000 tests, 17 modules) into **21 tools**: find tests by module/priority/type/browser/device, rank "what to run first", build smoke/sanity/regression suites, find duplicates and coverage gaps, write new tests in the catalog format, and export to CSV, Jira CSV, Markdown, JSON, Gherkin or Playwright stubs. Plus 4 resources, 3 prompts and 33 tests. Write tools stay hidden unless `TC_MCP_ALLOW_WRITE=true`, and edits go to an overlay file so the source CSV is never modified.
- **TestSkill Finder MCP** — `testskill-finder-mcp/` searches a library of **100 QA agent skills** (the 7 STLC phases plus Playwright, Selenium, Cypress, API, performance, security, LLM evaluation, AI agents, MCP and automation) with **15 tools**, 103 prompts (one per skill) and 7 resources. 36 skills are synced from `PramodDutta/skillmasterclass`; 64 are new. 42 tests pin the golden searches.
- **Built by prompting** — `00_Objective.md` sets the goal, `01_TestCreatorMCP.plan.md` is the plan (data profiling, tool catalog, ranking formula, suite rules, sharing options), and `02_prompt.md` records every prompt and what happened — including public Cloudflare hosting of the read-only server and its one-line stop switch.
- **Connect** — stdio (`uv run --directory <path> tc-mcp`), local HTTP (`http://127.0.0.1:8000/mcp`), or `uvx` straight from git. Both servers run stateless behind proxies and tunnels, and show a "how to connect" page if opened in a browser.

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
