import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_insight(topic):
    prompt = f"Give me the top trending news about {topic}, summarized as actionable insights."

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openrouter/auto",  # ✅ smart model routing
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 750,
            "temperature": 0.7
        }
    )

    print("🧾 Response headers:", response.headers)
    print("🧾 Response text:", response.text)

    try:
        if not response.headers.get("content-type", "").startswith("application/json"):
            raise ValueError(f"Unexpected content type: {response.text}")

        data = response.json()
        if "choices" in data and len(data["choices"]) > 0:
            return data["choices"][0]["message"]["content"]
        else:
            raise ValueError(f"'choices' missing from LLM response: {data}")

    except Exception as e:
        return f"⚠️ Error retrieving insight: {str(e)}"
