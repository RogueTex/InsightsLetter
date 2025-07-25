// Add event listener for Enter key and Clear button, improve error handling, disable button while loading, render lists, animate card, and add accessibility

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('topicInput');
  const button = document.getElementById('generateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const loader = document.getElementById('loader');
  const output = document.getElementById('output');

  // Submit on Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      button.click();
    }
  });

  // Generate insight
  button.addEventListener('click', () => {
    const topic = input.value.trim();
    output.innerHTML = '';
    if (!topic || topic.length < 3) {
      output.innerHTML = '<p>❗ Please enter a topic (at least 3 characters).</p>';
      return;
    }
    button.disabled = true;
    loader.classList.remove('hidden');
    fetch('https://insightsletter.onrender.com/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    })
      .then(res => {
        if (!res.ok) throw new Error('Server error. Please try again later.');
        return res.json();
      })
      .then(data => {
        loader.classList.add('hidden');
        button.disabled = false;
        output.innerHTML = renderInsight(data);
        animateCard();
      })
      .catch(err => {
        loader.classList.add('hidden');
        button.disabled = false;
        output.innerHTML = `<p>⚠️ Error: ${err.message}</p>`;
      });
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    input.value = '';
    output.innerHTML = '<p class="placeholder">Try searching for a topic above!</p>';
    input.focus();
  });

  // Initial placeholder
  output.innerHTML = '<p class="placeholder">Try searching for a topic above!</p>';
});

function renderInsight(data) {
  // Render lists if lines start with '-', else paragraphs
  const lines = data.summary.split('\n').map(l => l.trim()).filter(Boolean);
  let html = '';
  if (lines.some(line => line.startsWith('-') || line.startsWith('*'))) {
    html += '<ul>';
    lines.forEach(line => {
      if (line.startsWith('-') || line.startsWith('*')) {
        html += `<li>${line.replace(/^[-*]\s*/, '')}</li>`;
      } else {
        html += `<li>${line}</li>`;
      }
    });
    html += '</ul>';
  } else {
    html += lines.map(line => `<p>${line}</p>`).join('');
  }
  return `
    <div class="insight-card" tabindex="0" aria-live="polite">
      <h3>${data.title}</h3>
      ${html}
      <p><em>Generated by ${data.generated_by}</em></p>
    </div>
  `;
}

function animateCard() {
  const card = document.querySelector('.insight-card');
  if (card) {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s, transform 0.5s';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, 10);
  }
}
