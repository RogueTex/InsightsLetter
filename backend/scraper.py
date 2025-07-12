import requests
from bs4 import BeautifulSoup

def scrape_topic(topic):
    query = topic.replace(" ", "+")
    url = f"https://news.google.com/search?q={query}"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")

    headlines = [tag.text for tag in soup.select("a.DY5T1d")[:5]]
    return "\n".join(headlines)
