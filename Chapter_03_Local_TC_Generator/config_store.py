import json
import os

CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(CONFIG_DIR, ".config.json")

DEFAULTS = {
    "jira_url": "",
    "jira_email": "",
    "jira_api_token": "",
    "llm_provider": "ollama",
    "groq_api_key": "",
}


def load() -> dict:
    if not os.path.exists(CONFIG_PATH):
        return dict(DEFAULTS)
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        stored = json.load(f)
    config = dict(DEFAULTS)
    config.update(stored)
    return config


def save(config: dict) -> None:
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)
