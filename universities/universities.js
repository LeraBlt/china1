const universityDetails = document.getElementById('programs');
const detailTrigger = document.querySelector('[data-detail-trigger]');

detailTrigger.addEventListener('click', () => {
  universityDetails.open = true;
  universityDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

universityDetails.addEventListener('toggle', () => {
  detailTrigger.setAttribute('aria-expanded', String(universityDetails.open));
});
