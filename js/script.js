const clickHeart = document.querySelector('.click-heart');
if (clickHeart) {
  clickHeart.addEventListener('click', () => {
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('div');
      heart.className = 'flying-heart';
      const rect = clickHeart.getBoundingClientRect();
      heart.style.left = rect.left + rect.width / 2 + 'px';
      heart.style.top = rect.top + rect.height / 2 + 'px';
      heart.style.animationDuration = `${0.8 + Math.random() * 0.5}s`;
      heart.style.transform = `rotate(45deg) translateX(${(Math.random() - 0.5) * 100}px)`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  });
}

const book = document.getElementById('book');
const form = document.getElementById('add-entry-form');
let entries = [
  { date: '06/12/2024', desc: 'Primeira vez que ficamos, foi extremamente louco kkk' },
  { date: '20/12/2024', desc: 'Filme Gladiador no cinemas, nosso primeiro encontro.' },
  { date: '27/12/2024', desc: 'Saímos para o Universal Park, estavamos "começando" tudo.' },
  { date: '02/01/2025', desc: 'A primeira vez que fui a sua casa e comecei a arriar meus 4 pneus.' },
  { date: '01/02/2025', desc: 'Fomos no lago com a lulu, o dia que eu te falei "te amo"' },
  { date: '06/02/2025', desc: 'Fomos ao shopping depois da minha aula' },
  { date: '15/02/2025', desc: 'O dia que fui na casa do seu pai e entreguei seu buquê de cetim kkk' },
  { date: '22/02/2025', desc: 'Fomos a uma Hamburgueria, Bryan Burguer, comemos a hamburgueria todinha kk' },
  { date: '02/03/2025', desc: 'Saímos a primeira vez junto com meus pais para a praia' },
  { date: '03/03/2025', desc: 'Fomos ao show na beira mar da banda magníficos, "pedido de namoro" caótico' },
  { date: '15/03/2025', desc: '"Anivesário da sua mãe", a sua surpresa, o dia que conheci sua mãe kk' },
  { date: '11/04/2025', desc: 'O PEDIDO DE NAMORO COM ALIANÇAAAAAAS, kkkk, fomos ao coco bambu e passeamos pela beira mar' },
  { date: '30/04/2025', desc: 'Fomos ao show do Matuê, noite inesquecível 💥🎶' },
  { date: '09/05/2025', desc: 'Fomos à Praça da MRV comer sanduíche no Cutelos, foi uma noite deliciosa 😋' }
];
let currentPage = 0;
let bookOpen = false;

const renderPage = index => {
  const entry = entries[index];
  book.innerHTML = `
    <div class="book-cover">📔</div>
    ${bookOpen ? `
    <div class="page">
      <div class="entry">
        <h3>${entry.date}</h3>
        ${entry.img ? `<img src="${entry.img}" class="frame" alt="Foto da memória">` : ''}
        <p>${entry.desc}</p>
      </div>
    </div>` : ''}
  `;
};

const updateButtons = () => {
  document.getElementById('prev-page').disabled = currentPage === 0;
  document.getElementById('next-page').disabled = currentPage === entries.length - 1;
};

if (book && form) {
  document.getElementById('toggle-book').addEventListener('click', () => {
    bookOpen = !bookOpen;
    renderPage(currentPage);
    document.getElementById('toggle-book').textContent = bookOpen ? 'Fechar Livrinho' : 'Abrir Livrinho';
    document.getElementById('nav-buttons').style.display = bookOpen ? 'block' : 'none';
    updateButtons();
  });

  document.getElementById('prev-page').addEventListener('click', () => { 
    if (currentPage > 0) { 
      currentPage--; 
      renderPage(currentPage); 
      updateButtons(); 
    }
  });
  
  document.getElementById('next-page').addEventListener('click', () => { 
    if (currentPage < entries.length - 1) { 
      currentPage++; 
      renderPage(currentPage); 
      updateButtons(); 
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const date = document.getElementById('entry-date').value;
    const desc = document.getElementById('entry-desc').value;
    const img = document.getElementById('entry-img').value;
    if (date && desc) {
      entries.push({ date, desc, img });
      currentPage = entries.length - 1;
      renderPage(currentPage);
      updateButtons();
      form.reset();
    }
  });

  renderPage(currentPage);
}

// Modo dia e noite com sincronização via localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeBtns = document.querySelectorAll('.theme-toggle');
  themeBtns.forEach(btn => {
    btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
  });
});

// Chat: typing effect + localStorage
const chatForm = document.getElementById('chat-form');
if (chatForm) {
  const chatInput = document.getElementById('chat-input');
  const messagesEl = document.getElementById('messages');
  let saved = JSON.parse(localStorage.getItem('chatMessages') || '[]');

  function typeText(el, text, delay = 40) {
    el.textContent = '';
    text.split('').forEach((ch, i) => setTimeout(() => el.textContent += ch, delay * i));
  }

  function renderMessages() {
    messagesEl.innerHTML = '';
    saved.forEach(msg => {
      const p = document.createElement('p');
      typeText(p, msg);
      messagesEl.appendChild(p);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      saved.push(text);
      localStorage.setItem('chatMessages', JSON.stringify(saved));
      renderMessages();
      chatInput.value = '';
    }
  });

  renderMessages();
}

// Timeline: scroll reveal
const items = document.querySelectorAll('.timeline-item');
if (items.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  items.forEach(item => observer.observe(item));
}

// Contador de tempo
const updateTimeSince = () => {
  document.querySelectorAll('.time-since').forEach(span => {
    const dateStr = span.parentElement.querySelector('h3').textContent;
    const eventDate = new Date(dateStr.split('/').reverse().join('-'));
    const now = new Date();
    const diffDays = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));
    span.textContent = diffDays >= 0 ? `Há ${diffDays} dias` : `Em ${-diffDays} dias`;
  });
};

// Atualiza o contador ao carregar
updateTimeSince();
setInterval(updateTimeSince, 86400000); // Atualiza diariamente
