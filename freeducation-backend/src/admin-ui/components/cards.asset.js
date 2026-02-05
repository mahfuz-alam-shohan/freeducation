export function renderStatCards(stats) {
  const cards = stats.map((stat) => {
    return `
      <div class="card">
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
