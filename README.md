# AI Tester Blueprint 4X

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**AI Tester Blueprint 4X** is a next-generation architecture and blueprint for AI-driven automated testing, intelligent test case generation, autonomous test execution, and comprehensive software quality assurance — organized across three progressive chapters.

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
│   ├── src/                                 # Local LLM test case generator (Python/Node)
│   └── templates/
│       └── testcase_creator.md              # Structured prompt for local LLM TC generation
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

## 📖 Chapter 03 — Local Test Case Generator

Scaffold for a local LLM-powered test case generator. Uses structured prompt templates with anti-hallucination guardrails to produce traceable, repeatable test cases from PRDs, SRS documents, JIRA tickets, and other requirement sources — all running on a local LLM (Ollama, LM Studio, etc.).

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended) or [Python](https://www.python.org/) (v3.10+ recommended)
- For Chapter 03: a local LLM runtime (Ollama, LM Studio, or similar)
- For RICE POT Framework: JDK 17+, Maven 3.8+

### Installation

```bash
git clone https://github.com/Shree21122000/AITESTERBLUEPRINT4X.git
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
