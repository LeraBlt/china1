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

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-slides');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = carousel.querySelector('.carousel-dots');
  const windowEl = carousel.querySelector('.carousel-window');
  let index = 0;
  let touchStart = 0;

  const goTo = (next) => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.querySelectorAll('button').forEach((dot, i) => {
      dot.setAttribute('aria-current', String(i === index));
    });
    carousel.querySelectorAll('video').forEach((video) => video.pause());
    windowEl.style.height = `${slides[index].offsetHeight}px`;
  };

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Показать ${i + 1} из ${slides.length}`);
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });
  carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(index - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(index + 1));
  track.addEventListener('touchstart', (event) => {
    touchStart = event.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', (event) => {
    const distance = touchStart - event.changedTouches[0].screenX;
    if (Math.abs(distance) > 50) goTo(index + (distance > 0 ? 1 : -1));
  }, { passive: true });
  window.addEventListener('resize', () => goTo(index), { passive: true });
  slides.forEach((slide) => slide.querySelectorAll('img').forEach((img) => {
    img.addEventListener('load', () => goTo(index), { once: true });
  }));
  goTo(0);
});
