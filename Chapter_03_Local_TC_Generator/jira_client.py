import requests
from requests.auth import HTTPBasicAuth


class JiraClient:
    def __init__(self, base_url: str, email: str, api_token: str):
        self.base_url = base_url.rstrip("/")
        self.auth = HTTPBasicAuth(email, api_token)
        self.headers = {"Accept": "application/json"}

    def fetch_ticket(self, issue_key: str) -> dict:
        url = f"{self.base_url}/rest/api/2/issue/{issue_key}"
        resp = requests.get(url, auth=self.auth, headers=self.headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        fields = data.get("fields", {})
        summary = fields.get("summary", "")
        description = self._extract_text(fields.get("description"))
        acceptance_criteria = self._find_acceptance_criteria(fields)

        return {
            "key": issue_key,
            "summary": summary,
            "description": description,
            "acceptance_criteria": acceptance_criteria,
        }

    def _extract_text(self, doc: dict | str | None) -> str:
        if not doc:
            return ""
        if isinstance(doc, str):
            return doc.strip()
        content = doc.get("content", [])
        parts = []
        for block in content:
            if block.get("type") == "paragraph":
                for item in block.get("content", []):
                    if item.get("type") == "text":
                        parts.append(item.get("text", ""))
            parts.append("\n")
        return "".join(parts).strip()

    def _find_acceptance_criteria(self, fields: dict) -> str:
        possible_names = [
            "customfield_10100",
            "customfield_10101",
            "customfield_10011",
            "customfield_10014",
            "customfield_10015",
            "customfield_10300",
            "customfield_10400",
        ]
        for name in possible_names:
            val = fields.get(name)
            if val and isinstance(val, str) and val.strip():
                return val.strip()

        description = self._extract_text(fields.get("description"))
        lines = description.split("\n")
        ac_lines = []
        capture = False
        for line in lines:
            stripped = line.strip().lower()
            if capture:
                if stripped.startswith("given ") or stripped.startswith("when ") or stripped.startswith("then ") or stripped.startswith("and "):
                    ac_lines.append(line.strip())
                else:
                    break
            if "acceptance criteria" in stripped or "acceptance:" in stripped:
                capture = True
        return "\n".join(ac_lines) if ac_lines else ""
