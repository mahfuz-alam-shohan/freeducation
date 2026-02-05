export function renderStatCards(stats, options = {}) {
  const className = options.className ? `grid ${options.className}` : 'grid';
  const cards = stats.map((stat) => {
    return `
      <div class="card stat-card">
        <h3>${stat.label}</h3>
        <div class="stats">
          <span>${stat.value}</span>
          <p>${stat.caption}</p>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="${className}">${cards}</div>`;
}
