export function renderStatCards(stats) {
  const cards = stats.map((stat, index) => {
    return `
      <div class="card" style="animation-delay:${index * 0.05}s">
        <h3>${stat.label}</h3>
        <div class="stats">
          <span>${stat.value}</span>
          <p>${stat.caption}</p>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="grid">${cards}</div>`;
}
