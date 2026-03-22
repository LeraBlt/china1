document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. МОБИЛЬНОЕ МЕНЮ (Стабильное) =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        const menuIcon = menuToggle.querySelector('i');
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            menuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        });
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuIcon.className = 'fas fa-bars';
            }
        });
    }

    // ===== 2. УНИВЕРСАЛЬНАЯ КАРУСЕЛЬ (Исправленная) =====
    function initCarousel(carouselId, prevId, nextId, dotsId) {
        const carousel = document.getElementById(carouselId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const dotsContainer = document.getElementById(dotsId);

        if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        let currentIndex = 0;

        // Создаем точки
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(i);
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            
            // Листаем
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Обновляем точки
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            
            // Авто-пауза видео при переключении
            carousel.querySelectorAll('video').forEach(v => v.pause());
        }

        // Слушатели на кнопки
        prevBtn.onclick = () => goToSlide(currentIndex - 1);
        nextBtn.onclick = () => goToSlide(currentIndex + 1);

        // Свайпы (упрощенные)
        let touchStart = 0;
        carousel.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].screenX; }, {passive: true});
        carousel.addEventListener('touchend', e => {
            let dist = touchStart - e.changedTouches[0].screenX;
            if (Math.abs(dist) > 50) goToSlide(dist > 0 ? currentIndex + 1 : currentIndex - 1);
        }, {passive: true});
    }

    // Запуск всех каруселей
    initCarousel('mediaCarousel', 'prevMedia', 'nextMedia', 'mediaDots');
    initCarousel('jinanCarousel', 'prevJinan', 'nextJinan', 'jinanDots');
    initCarousel('pekinExcCarousel', 'prevPekinExc', 'nextPekinExc', 'pekinExcDots');
    initCarousel('jinanExcCarousel', 'prevJinanExc', 'nextJinanExc', 'jinanExcDots');
    initCarousel('memoriesCarousel', 'prevMemories', 'nextMemories', 'memoriesDots');

    // ===== 3. ОТЗЫВЫ (Авто-высота) =====
    const reviewsCarousel = document.getElementById('reviewsCarousel');
    if (reviewsCarousel) {
        const slides = reviewsCarousel.querySelectorAll('.carousel-slide');
        const wrapper = reviewsCarousel.parentElement;
        let rIdx = 0;

        function setHeight() {
            if(slides[rIdx]) wrapper.style.height = slides[rIdx].offsetHeight + 'px';
        }

        window.addEventListener('load', setHeight);
        window.addEventListener('resize', setHeight);
        // Вызываем инициализацию карусели отзывов (если кнопки есть)
        initCarousel('reviewsCarousel', 'prevReviews', 'nextReviews', 'reviewsDots');
    }

    // ===== 4. ЛЕНИВАЯ ЗАГРУЗКА (Только для скорости) =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Если это видео — разрешаем ему подгрузиться
                if (entry.target.tagName === 'VIDEO') entry.target.preload = 'metadata';
                const vid = entry.target.querySelector('video');
                if (vid) vid.preload = 'metadata';
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, video').forEach(el => observer.observe(el));
});