document.addEventListener('DOMContentLoaded', () => {
    // ===== Мобильное меню =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle) {
        const menuIcon = menuToggle.querySelector('i');

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }
    function rearrangeSections() {
        const factsSection = document.querySelector('.facts-section');
        const heroSection = document.querySelector('.hero-left')?.closest('section') || document.querySelector('section');

        if (window.innerWidth <= 768) {
            // Если мобилка: вставляем цифры СРАЗУ ПОСЛЕ hero
            if (heroSection && factsSection) {
                heroSection.after(factsSection);
            }
        } else {
            // Если вебка: возвращаем цифры на их законное место (например, перед подвалом или где они были)
            // Но обычно в вебе браузер и так отрисует их по порядку в HTML, 
            // так что при обновлении страницы всё будет ок.
        }
    }

    // Запускаем при загрузке и при изменении размера экрана
    window.addEventListener('load', rearrangeSections);
    window.addEventListener('resize', rearrangeSections);

    // ===== Универсальная функция для карусели (С ПОДДЕРЖКОЙ СВАЙПА) =====
    function initCarousel(carouselId, prevId, nextId, dotsId) {
        const carousel = document.getElementById(carouselId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const dotsContainer = document.getElementById(dotsId);

        if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;

        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        dotsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            carousel.querySelectorAll('video').forEach(video => video.pause());
        }

        // --- ЛОГИКА СВАЙПА ---
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchStartX - touchEndX;
            const threshold = 50; // Минимальное расстояние для срабатывания свайпа

            if (swipeDistance > threshold) {
                goToSlide(currentIndex + 1); // Свайп влево -> следующий
            } else if (swipeDistance < -threshold) {
                goToSlide(currentIndex - 1); // Свайп вправо -> предыдущий
            }
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        goToSlide(0);
    }

    // Инициализация основных каруселей
    initCarousel('mediaCarousel', 'prevMedia', 'nextMedia', 'mediaDots');
    initCarousel('jinanCarousel', 'prevJinan', 'nextJinan', 'jinanDots');
    initCarousel('pekinExcCarousel', 'prevPekinExc', 'nextPekinExc', 'pekinExcDots');
    initCarousel('jinanExcCarousel', 'prevJinanExc', 'nextJinanExc', 'jinanExcDots');
    initCarousel('memoriesCarousel', 'prevMemories', 'nextMemories', 'memoriesDots');

    // ===== Слайдер отзывов (ТОЖЕ СО СВАЙПОМ) =====
    const reviewsCarousel = document.getElementById('reviewsCarousel');
    const prevReviews = document.getElementById('prevReviews');
    const nextReviews = document.getElementById('nextReviews');
    const reviewsDots = document.getElementById('reviewsDots');

    if (reviewsCarousel && prevReviews && nextReviews && reviewsDots) {
        const reviewSlides = document.querySelectorAll('#reviewsCarousel .carousel-slide');
        let currentReviewIndex = 0;
        let rTouchStartX = 0;
        let rTouchEndX = 0;

        reviewsDots.innerHTML = '';
        for (let i = 0; i < reviewSlides.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToReviewSlide(i));
            reviewsDots.appendChild(dot);
        }

        const reviewDotsList = document.querySelectorAll('#reviewsDots .carousel-dot');

        function goToReviewSlide(index) {
            if (index < 0) index = reviewSlides.length - 1;
            if (index >= reviewSlides.length) index = 0;
            currentReviewIndex = index;
            reviewsCarousel.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
            reviewDotsList.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentReviewIndex);
            });
        }

        // Свайпы для отзывов
        reviewsCarousel.addEventListener('touchstart', e => {
            rTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        reviewsCarousel.addEventListener('touchend', e => {
            rTouchEndX = e.changedTouches[0].screenX;
            const dist = rTouchStartX - rTouchEndX;
            if (dist > 50) goToReviewSlide(currentReviewIndex + 1);
            if (dist < -50) goToReviewSlide(currentReviewIndex - 1);
        }, { passive: true });

        prevReviews.addEventListener('click', () => goToReviewSlide(currentReviewIndex - 1));
        nextReviews.addEventListener('click', () => goToReviewSlide(currentReviewIndex + 1));
        goToReviewSlide(0);
    }

    // ===== Сворачиваемое расписание =====
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        const moreDays = document.getElementById('more-days');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        let isExpanded = false;

        showMoreBtn.addEventListener('click', function () {
            if (!isExpanded) {
                moreDays.style.display = 'table-row-group';
                btnText.textContent = 'Скрыть';
                btnIcon.className = 'fas fa-chevron-up';
                isExpanded = true;
            } else {
                moreDays.style.display = 'none';
                btnText.textContent = 'Показать ещё';
                btnIcon.className = 'fas fa-chevron-down';
                isExpanded = false;
            }
        });
    }
});