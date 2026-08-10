import requests
import ollama


class LLMClient:
    def __init__(
        self,
        provider: str = "ollama",
        ollama_host: str = "http://localhost:11434",
        ollama_model: str = "gemma3:1b",
        groq_api_key: str = "",
    ):
        self.provider = provider
        self.ollama_host = ollama_host
        self.ollama_model = ollama_model
        self.groq_api_key = groq_api_key

    def generate(self, prompt: str) -> str:
        if self.provider == "ollama" and self._ollama_ok():
            return self._ollama_generate(prompt)
        if self._groq_ok():
            return self._call_groq(prompt)
        raise RuntimeError("No available LLM provider — Ollama unavailable and Groq not configured.")

    def generate_stream(self, prompt: str):
        if self.provider == "ollama" and self._ollama_ok():
            yield from self._ollama_stream(prompt)
            return
        if self.provider == "groq" or not self._ollama_ok():
            if self._groq_ok():
                yield from self._groq_stream(prompt)
                return
        raise RuntimeError("No available LLM provider.")

    def _groq_ok(self) -> bool:
        return bool(self.groq_api_key)

    def _ollama_generate(self, prompt: str) -> str:
        client = ollama.Client(host=self.ollama_host)
        response = client.generate(model=self.ollama_model, prompt=prompt)
        return response["response"]

    def _ollama_ok(self) -> bool:
        try:
            client = ollama.Client(host=self.ollama_host)
            client.list()
            return True
        except Exception:
            return False

    def _call_groq(self, prompt: str) -> str:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        }
        resp = requests.post(url, json=payload, headers=headers, timeout=120)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

    def _ollama_stream(self, prompt: str):
        client = ollama.Client(host=self.ollama_host)
        for chunk in client.generate(model=self.ollama_model, prompt=prompt, stream=True):
            yield chunk["response"]

    def _groq_stream(self, prompt: str):
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "stream": True,
        }
        resp = requests.post(url, json=payload, headers=headers, stream=True, timeout=120)
        resp.raise_for_status()
        for line in resp.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data: "):
                continue
            data_str = line[len("data: "):]
            if data_str == "[DONE]":
                break
            import json
            try:
                delta = json.loads(data_str)["choices"][0].get("delta", {})
                if "content" in delta:
                    yield delta["content"]
            except (json.JSONDecodeError, KeyError, IndexError):
                continue
