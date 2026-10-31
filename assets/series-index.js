const search = document.getElementById('series-search');
const filter = document.getElementById('series-filter');
const status = document.getElementById('series-status');
const entries = Array.from(document.querySelectorAll('[data-entry]'));
const groups = Array.from(document.querySelectorAll('[data-series-group]'));

function updateSeries() {
  const query = (search.value || '').trim().toLocaleLowerCase('es');
  const family = filter.value;
  let visible = 0;
  for (const entry of entries) {
    const matches = (!query || entry.dataset.search.includes(query)) &&
      (!family || entry.dataset.family === family);
    entry.hidden = !matches;
    if (matches) visible += 1;
  }
  for (const group of groups) {
    group.hidden = !group.querySelector('[data-entry]:not([hidden])');
  }
  status.textContent = visible + ' de 300 estudios visibles.';
}

search.addEventListener('input', updateSeries);
filter.addEventListener('change', updateSeries);
