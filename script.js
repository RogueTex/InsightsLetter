const form = document.getElementById('insight-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const topic = document.getElementById('topic').value.trim();

  resultDiv.textContent = 'Generating insight...';

  try {
    const response = await fetch('https://insightsletter.onrender.com/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });

    const data = await response.json();

    if (data.summary) {
      resultDiv.innerHTML = `<h3>${data.title}</h3><p>${data.summary}</p>`;
    } else {
      resultDiv.textContent = 'No summary returned.';
    }
  } catch (error) {
    resultDiv.textContent = 'Error retrieving insight. Please try again.';
    console.error(error);
  }
});


//fetch('', { ... })
