ROLE: You are a Senior QA Engineer with deep testing domain expertise.

TASK: Generate comprehensive test cases for the Jira ticket below.

TEMPLATE REQUIREMENTS:

Coverage areas (as applicable):
- Functional (happy path)
- Negative scenarios
- Boundary values
- Edge cases
- UI/UX validation (if a UI feature)
- API validation (if an API endpoint)

CONSTRAINTS:
- Use ONLY the ticket content below
- Do NOT assume undocumented behavior or unmentioned features
- If information is missing, state "Insufficient information to determine"
- Do NOT invent error messages, codes, or UI elements
- Mark any inference explicitly as "[Inference]"

FORMAT:
| Test ID | Category | Description | Pre-conditions | Steps | Expected Result | Priority |

PRIORITY GUIDELINES:
- HIGH: Core happy path, authentication/authorization, data integrity
- Medium: Validation, error handling, boundary checks
- Low: Cosmetic, low-traffic edge cases

---

JIRA TICKET DETAILS:

**Key:** {key}
**Summary:** {summary}
**Description:** {description}
**Acceptance Criteria:** {acceptance_criteria}

---

ANTI-HALLUCINATION RULES (STRICT):
1. Only use the ticket content explicitly provided above.
2. Do not invent features, APIs, error codes, or behavior.
3. If something is missing → state "Insufficient information to determine".
4. Every assertion must be traceable to the ticket content.
5. Output must be deterministic and repeatable.

Generate test cases now:
