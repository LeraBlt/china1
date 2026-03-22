document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. МОБИЛЬНОЕ МЕНЮ =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        const menuIcon = menuToggle.querySelector('i');

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                menuIcon.classList.replace('fa-bars', 'fa-times');
            } else {
                menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.classList.replace('fa-times', 'fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // ===== 2. ПЕРЕСТРОЙКА СЕКЦИЙ (Mobile First) =====
    function rearrangeSections() {
        const factsSection = document.querySelector('.facts-section');
        const heroSection = document.querySelector('.hero-left')?.closest('section') || document.querySelector('section');

        if (window.innerWidth <= 768 && heroSection && factsSection) {
            heroSection.after(factsSection);
        }
    }
    window.addEventListener('load', rearrangeSections);
    window.addEventListener('resize', rearrangeSections);

    // ===== 3. УНИВЕРСАЛЬНАЯ КАРУСЕЛЬ (Свайпы + Видео) =====
    function initCarousel(carouselId, prevId, nextId, dotsId) {
        const carousel = document.getElementById(carouselId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const dotsContainer = document.getElementById(dotsId);

        if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Создание точек
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            carousel.querySelectorAll('video').forEach(v => v.pause());
        }

        carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const dist = touchStartX - touchEndX;
            if (Math.abs(dist) > 50) goToSlide(dist > 0 ? currentIndex + 1 : currentIndex - 1);
        }, { passive: true });

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    initCarousel('mediaCarousel', 'prevMedia', 'nextMedia', 'mediaDots');
    initCarousel('jinanCarousel', 'prevJinan', 'nextJinan', 'jinanDots');
    initCarousel('pekinExcCarousel', 'prevPekinExc', 'nextPekinExc', 'pekinExcDots');
    initCarousel('jinanExcCarousel', 'prevJinanExc', 'nextJinanExc', 'jinanExcDots');
    initCarousel('memoriesCarousel', 'prevMemories', 'nextMemories', 'memoriesDots');

    // ===== 4. СЛАЙДЕР ОТЗЫВОВ (С авто-высотой) =====
    const reviewsCarousel = document.getElementById('reviewsCarousel');
    const reviewsDots = document.getElementById('reviewsDots');

    if (reviewsCarousel && reviewsDots) {
        const reviewsWrapper = reviewsCarousel.parentElement;
        const reviewSlides = reviewsCarousel.querySelectorAll('.carousel-slide');
        let rIdx = 0;

        function adjustHeight(index) {
            const slide = reviewSlides[index];
            if (slide) reviewsWrapper.style.height = slide.offsetHeight + 'px';
        }

        function goToReview(index) {
            if (index < 0) index = reviewSlides.length - 1;
            if (index >= reviewSlides.length) index = 0;
            rIdx = index;
            reviewsCarousel.style.transform = `translateX(-${rIdx * 100}%)`;
            document.querySelectorAll('#reviewsDots .carousel-dot').forEach((d, i) => d.classList.toggle('active', i === rIdx));
            adjustHeight(rIdx);
        }

        reviewsDots.innerHTML = '';
        reviewSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToReview(i));
            reviewsDots.appendChild(dot);
        });

        document.getElementById('prevReviews')?.addEventListener('click', () => goToReview(rIdx - 1));
        document.getElementById('nextReviews')?.addEventListener('click', () => goToReview(rIdx + 1));
        
        window.addEventListener('resize', () => adjustHeight(rIdx));
        setTimeout(() => goToReview(0), 500); // Небольшая задержка для корректного замера высоты
    }

    // ===== 5. КАРУСЕЛИ ПРОЖИВАНИЯ (Scroll-based dots) =====
    function initPhotoCarousel(trackId, dotsId) {
        const track = document.getElementById(trackId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track || !dotsContainer) return;

        const items = track.querySelectorAll('.photo-item');
        dotsContainer.innerHTML = '';
        items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('photo-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                track.scrollTo({ left: items[i].offsetLeft, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.photo-dot');
        track.addEventListener('scroll', () => {
            let activeIdx = 0;
            items.forEach((item, i) => {
                if (track.scrollLeft >= item.offsetLeft - 50) activeIdx = i;
            });
            dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
        }, { passive: true });
    }

    initPhotoCarousel('pekinAccommodationTrack', 'pekinAccommodationDots');
    initPhotoCarousel('jinanAccommodationTrack', 'jinanAccommodationDots');

    // ===== 6. ПОСТЕПЕННАЯ ПРОГРУЗКА СЕКЦИЙ (Lazy Appear) =====
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.section').forEach(sec => {
        if (sec.getBoundingClientRect().top < window.innerHeight) {
            sec.classList.add('appear');
        } else {
            sectionObserver.observe(sec);
        }
    });

    // ===== 7. СВОРАЧИВАЕМОЕ РАСПИСАНИЕ =====
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        let isExpanded = false;
        showMoreBtn.addEventListener('click', () => {
            const moreDays = document.getElementById('more-days');
            isExpanded = !isExpanded;
            moreDays.style.display = isExpanded ? 'table-row-group' : 'none';
            document.getElementById('btnText').textContent = isExpanded ? 'Скрыть' : 'Показать ещё';
            document.getElementById('btnIcon').className = isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
        });
    }
});