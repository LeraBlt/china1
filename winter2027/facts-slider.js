const factsTrack = document.getElementById('factsTrack');
const factsPrev = document.getElementById('factsPrev');
const factsNext = document.getElementById('factsNext');

if (factsTrack && factsPrev && factsNext) {
    const cards = Array.from(factsTrack.querySelectorAll('.fact-card'));

    const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
    const pageStep = () => window.innerWidth <= 600 ? 2 : 1;

    const updateControls = () => {
        const lastScroll = factsTrack.scrollWidth - factsTrack.clientWidth;
        factsPrev.disabled = factsTrack.scrollLeft <= 2;
        factsNext.disabled = factsTrack.scrollLeft >= lastScroll - 2;
    };

    const scrollBehavior = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    factsPrev.addEventListener('click', () => factsTrack.scrollBy({ left: -step() * pageStep(), behavior: scrollBehavior() }));
    factsNext.addEventListener('click', () => factsTrack.scrollBy({ left: step() * pageStep(), behavior: scrollBehavior() }));
    factsTrack.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    updateControls();
}
