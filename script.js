const menuButton = document.querySelector('.menu-toggle');
const menuLinks = document.querySelectorAll('.main-nav a');

menuButton?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});

menuLinks.forEach((link) => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Открыть меню');
}));

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const interest = String(data.get('interest') || '').trim();
  const message = String(data.get('message') || '').trim();
  const lines = [
    'Здравствуйте! Хочу узнать о программах China Dreams.',
    `Меня зовут ${name}.`,
    `Интересует: ${interest}.`,
    ...(message ? [`Моя цель: ${message}`] : []),
  ];
  window.open(`https://wa.me/79160375054?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
});

document.querySelector('#year').textContent = new Date().getFullYear();
