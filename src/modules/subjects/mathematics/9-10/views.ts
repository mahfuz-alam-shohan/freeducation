import type { MathematicsNineTenChapter } from "./data";

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

export const renderMathematicsNineTenList = (props: {
  items: MathematicsNineTenChapter[];
  successMessage?: string;
  errorMessage?: string;
}): string => {
  const { items, successMessage, errorMessage } = props;
  const addBody = `
    <form class="form-card form-grid" method="post" action="/admin/modules/subjects/mathematics/9-10/new">
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
        <h1 class="page-title">Mathematics (Class 9-10)</h1>
        <p class="page-subtitle">Add chapters for this class group.</p>
        <div class="page-actions">
          <a class="button-link" href="/admin/modules/subjects/mathematics">Back</a>
        </div>
      </header>
      ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
      ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
      <section class="page-section">
        <div class="page-actions">
          ${renderModal("add-mathematics-9-10", "Add chapter", addBody, "Add", "button-link button-link--primary")}
        </div>
        <ul class="item-list">
          ${
            items.length
              ? items
                  .map(
                    (item) => `
                      <li class="item-card">
                        <div class="item-card__main">
                          <a class="item-card__title" href="/admin/modules/subjects/mathematics/9-10/${item.id}">${escapeValue(item.title)}</a>
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

export const renderMathematicsNineTenDetail = (item: MathematicsNineTenChapter): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">${escapeValue(item.title)}</h1>
      <p class="page-subtitle">No content added yet.</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects/mathematics/9-10">Back</a>
      </div>
    </header>
  </section>
`;
