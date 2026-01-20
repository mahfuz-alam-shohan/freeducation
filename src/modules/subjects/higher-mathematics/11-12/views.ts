import type { HigherMathematicsElevenTwelveChapter } from "./data";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderModal = (id: string, title: string, body: string, triggerLabel: string, triggerClass = "button-link") => `
  <div class="modal">
    <input class="modal__toggle" type="checkbox" id="${id}" />
    <label class="${triggerClass}" for="${id}">${triggerLabel}</label>
    <div class="modal__overlay" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
      <div class="modal__panel">
        <div class="modal__header">
          <h3 id="${id}-title" class="modal__title">${title}</h3>
          <label class="modal__close" for="${id}" aria-label="Close">×</label>
        </div>
        ${body}
      </div>
    </div>
  </div>
`;

const paperLabels: Record<string, string> = {
  first: "Higher Mathematics 1st",
  second: "Higher Mathematics 2nd",
};

export const renderHigherMathematicsElevenTwelveHome = (): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">Higher Mathematics (Class 11-12)</h1>
      <p class="page-subtitle">Select a paper to continue.</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects/higher-mathematics">Back</a>
      </div>
    </header>
    <section class="page-section">
      <div class="card-grid">
        <a class="card-link" href="/admin/modules/subjects/higher-mathematics/11-12/first">
          <span class="card-title">Higher Mathematics 1st</span>
        </a>
        <a class="card-link" href="/admin/modules/subjects/higher-mathematics/11-12/second">
          <span class="card-title">Higher Mathematics 2nd</span>
        </a>
      </div>
    </section>
  </section>
`;

export const renderHigherMathematicsElevenTwelveList = (props: {
  items: HigherMathematicsElevenTwelveChapter[];
  paper: string;
  successMessage?: string;
  errorMessage?: string;
}): string => {
  const { items, paper, successMessage, errorMessage } = props;
  const paperLabel = paperLabels[paper] ?? paper;
  const addBody = `
    <form class="form-card form-grid" method="post" action="/admin/modules/subjects/higher-mathematics/11-12/${paper}/new">
      <label class="form-field">
        <span>Chapter name</span>
        <input name="title" type="text" required />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">Save</button>
      </div>
    </form>
  `;

  return `
    <section class="page">
      <header class="page-header">
        <h1 class="page-title">${paperLabel} (Class 11-12)</h1>
        <p class="page-subtitle">Add chapters for this paper.</p>
        <div class="page-actions">
          <a class="button-link" href="/admin/modules/subjects/higher-mathematics/11-12">Back</a>
        </div>
      </header>
      ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
      ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
      <section class="page-section">
        <div class="page-actions">
          ${renderModal(
            `add-higher-math-11-12-${paper}`,
            `Add chapter (${paperLabel})`,
            addBody,
            "Add",
            "button-link button-link--primary",
          )}
        </div>
        <ul class="item-list">
          ${
            items.length
              ? items
                  .map(
                    (item) => `
                      <li class="item-card">
                        <div class="item-card__main">
                          <a class="item-card__title" href="/admin/modules/subjects/higher-mathematics/11-12/${paper}/${item.id}">${escapeValue(item.title)}</a>
                        </div>
                      </li>
                    `,
                  )
                  .join("")
              : `<li class="item-card"><span class="helper-text">No chapters added yet.</span></li>`
          }
        </ul>
      </section>
    </section>
  `;
};

export const renderHigherMathematicsElevenTwelveDetail = (item: HigherMathematicsElevenTwelveChapter): string => {
  const paperLabel = paperLabels[item.paper] ?? item.paper;
  return `
    <section class="page">
      <header class="page-header">
        <h1 class="page-title">${escapeValue(item.title)}</h1>
        <p class="page-subtitle">${paperLabel}</p>
        <div class="page-actions">
          <a class="button-link" href="/admin/modules/subjects/higher-mathematics/11-12/${escapeValue(item.paper)}">Back</a>
        </div>
      </header>
    </section>
  `;
};
