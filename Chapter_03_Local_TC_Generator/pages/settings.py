import streamlit as st
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config_store

st.set_page_config(page_title="Settings — QA Test Case Generator", page_icon="⚙️")
st.title("⚙️ Settings")

config = config_store.load()

with st.form("settings_form"):
    st.subheader("Jira Configuration")
    jira_url = st.text_input("Jira Base URL", value=config["jira_url"], placeholder="https://your-domain.atlassian.net")
    jira_email = st.text_input("Jira Email", value=config["jira_email"], placeholder="you@example.com")
    jira_api_token = st.text_input("Jira API Token", value=config["jira_api_token"], type="password")

    st.subheader("LLM Configuration")
    llm_provider = st.radio("LLM Provider", ["ollama", "groq"], index=0 if config["llm_provider"] == "ollama" else 1)
    groq_api_key = st.text_input("Groq API Key", value=config["groq_api_key"], type="password", help="Only used when Groq is selected as provider or Ollama is unavailable")

    submitted = st.form_submit_button("Save Settings")

if submitted:
    config["jira_url"] = jira_url
    config["jira_email"] = jira_email
    config["jira_api_token"] = jira_api_token
    config["llm_provider"] = llm_provider
    config["groq_api_key"] = groq_api_key
    config_store.save(config)
    st.success("Settings saved!")
    st.info("Chat screen will pick up the new settings on next message.")
