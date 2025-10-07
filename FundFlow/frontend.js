





//why choose us
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll('.trust-carousel .trust-card');
  let current = 0;
  let intervalId;

  function showCard(idx) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === idx);
    });
  }

  function nextCard() {
    current = (current + 1) % cards.length;
    showCard(current);
  }

  function prevCard() {
    current = (current - 1 + cards.length) % cards.length;
    showCard(current);
  }

  function startAutoSlide() {
    intervalId = setInterval(nextCard, 2500);
  }

  function stopAutoSlide() {
    clearInterval(intervalId);
  }

  // Delegate arrow events to the carousel container
  document.querySelector('.trust-carousel').addEventListener('click', function(e) {
    if (e.target.classList.contains('carousel-arrow')) {
      stopAutoSlide();
      if (e.target.classList.contains('left')) prevCard();
      if (e.target.classList.contains('right')) nextCard();
      startAutoSlide();
    }
  });

  showCard(current);
  startAutoSlide();
});
//campaign description character count
document.addEventListener('DOMContentLoaded', function() {
  const desc = document.querySelector('textarea[name="description"]');
  const count = document.getElementById('desc-count');
  if(desc && count) {
    desc.addEventListener('input', () => {
      count.textContent = desc.value.length;
    });
  }
});

// Index page featured campaigns binary prefix search
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('homeCampaignSearch');
  if (!input || !window.SearchUtils) return;

  const cards = Array.from(document.querySelectorAll('.featured-campaigns .campaign-card'));
  const items = cards.map((card, idx) => ({
    id: String(idx),
    title: (card.querySelector('h3')?.textContent || '').trim(),
    category: (card.querySelector('.campaign-category-badge')?.textContent || '').trim(),
    location: (card.getAttribute('data-location') || '').trim()
  }));

  const idxTitle = SearchUtils.buildIndex(items, it => it.title);
  const idxCategory = SearchUtils.buildIndex(items, it => it.category);
  const idxLocation = SearchUtils.buildIndex(items, it => it.location);

  function applyFilter() {
    const term = input.value;
    const norm = SearchUtils.normalize(term);
    let matched = new Set();
    if (norm) {
      const m1 = SearchUtils.searchPrefix(idxTitle, term);
      const m2 = SearchUtils.searchPrefix(idxCategory, term);
      const m3 = SearchUtils.searchPrefix(idxLocation, term);
      matched = new Set(SearchUtils.unionIds(m1, m2, m3));
    }
    cards.forEach((card, idx) => {
      const show = !norm || matched.has(String(idx));
      card.style.display = show ? '' : 'none';
    });
  }

  input.addEventListener('input', applyFilter);
});
