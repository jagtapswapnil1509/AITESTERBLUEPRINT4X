import streamlit as st
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config_store
from jira_client import JiraClient
from llm_client import LLMClient

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")
JIRA_KEY_PATTERN = re.compile(r"\b([A-Z][A-Z0-9]+-\d+)\b", re.IGNORECASE)

st.set_page_config(page_title="QA Test Case Generator", page_icon="🧪")
st.title("🧪 QA Test Case Generator")

if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])


def _build_tc_prompt(ticket: dict) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "jira_tc_template.md")
    if os.path.exists(template_path):
        with open(template_path, "r", encoding="utf-8") as f:
            template = f.read()
    else:
        template = (
            "Generate test cases for Jira ticket {key}: {summary}\n\n"
            "Description: {description}\n\n"
            "Acceptance Criteria: {acceptance_criteria}"
        )
    return template.format(
        key=ticket["key"],
        summary=ticket["summary"],
        description=ticket["description"],
        acceptance_criteria=ticket.get("acceptance_criteria", "Not specified") or "Not specified",
    )


def _handle_jira_tc(user_input: str):
    config = config_store.load()

    if not config["jira_url"] or not config["jira_email"] or not config["jira_api_token"]:
        st.session_state.messages.append({"role": "assistant", "content": "⚠️ Jira credentials not configured. Go to **Settings** (sidebar → Settings) and configure Jira URL, Email, and API Token."})
        return

    match = JIRA_KEY_PATTERN.search(user_input)
    if not match:
        st.session_state.messages.append({"role": "assistant", "content": "No Jira ticket key found in your message (e.g. QA-102)."})
        return

    issue_key = match.group(1).upper()

    with st.spinner(f"Fetching {issue_key} from Jira..."):
        try:
            jira = JiraClient(config["jira_url"], config["jira_email"], config["jira_api_token"])
            ticket = jira.fetch_ticket(issue_key)
        except Exception as e:
            st.session_state.messages.append({"role": "assistant", "content": f"❌ Failed to fetch {issue_key}: {e}"})
            return

    prompt = _build_tc_prompt(ticket)

    llm = LLMClient(
        provider=config["llm_provider"],
        groq_api_key=config["groq_api_key"],
    )

    with st.chat_message("assistant"):
        placeholder = st.empty()
        placeholder.markdown(f"📋 **{ticket['key']}: {ticket['summary']}**\n\nGenerating test cases with {config['llm_provider']}...")
        collected = ""
        try:
            for chunk in llm.generate_stream(prompt):
                collected += chunk
                placeholder.markdown(collected)
        except Exception as e:
            collected = f"❌ LLM error: {e}"
            placeholder.markdown(collected)

    st.session_state.messages.append({"role": "assistant", "content": collected})


if prompt := st.chat_input("Ask me to create test cases... e.g. 'create test cases for QA-102'"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    tc_keywords = ("test case", "testcases", "tc", "test scenario")
    has_jira_key = bool(JIRA_KEY_PATTERN.search(prompt))
    is_tc_request = any(kw in prompt.lower() for kw in tc_keywords) or has_jira_key

    if is_tc_request and has_jira_key:
        _handle_jira_tc(prompt)
    else:
        config = config_store.load()
        llm = LLMClient(
            provider=config["llm_provider"],
            groq_api_key=config["groq_api_key"],
        )
        with st.chat_message("assistant"):
            placeholder = st.empty()
            collected = ""
            try:
                for chunk in llm.generate_stream(prompt):
                    collected += chunk
                    placeholder.markdown(collected)
            except Exception as e:
                placeholder.markdown(f"❌ LLM error: {e}")
                collected = f"❌ LLM error: {e}"
        st.session_state.messages.append({"role": "assistant", "content": collected})
