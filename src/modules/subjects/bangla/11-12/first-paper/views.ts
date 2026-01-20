import type { BanglaElevenTwelveLiteratureItem, BanglaElevenTwelveSahapathItem } from "./data";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const sahapathLabels: Record<string, string> = {
  natok: "নাটক",
  uponnash: "উপন্যাস",
};

const literatureLabels: Record<string, string> = {
  goddo: "গদ্য",
  poddo: "পদ্য",
};

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

const renderSwapPrompt = (prompt?: {
  entryId: number;
  targetId: number;
  entryTitle: string;
  entryCategory: string;
  targetCategory: string;
}): string => {
  if (!prompt) {
    return "";
  }

  return `
    <section class="form-card">
      <p class="helper-text">"${escapeValue(prompt.entryTitle)}" এর ধরন পরিবর্তন করা হলে বিদ্যমান ধরন বদলাবে। আপনি কি ধরন অদলবদল করতে চান?</p>
      <div class="form-actions">
        <form method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/sahapath/switch">
          <input type="hidden" name="entryId" value="${prompt.entryId}" />
          <input type="hidden" name="targetId" value="${prompt.targetId}" />
          <input type="hidden" name="entryTitle" value="${escapeValue(prompt.entryTitle)}" />
          <input type="hidden" name="entryCategory" value="${escapeValue(prompt.entryCategory)}" />
          <input type="hidden" name="targetCategory" value="${escapeValue(prompt.targetCategory)}" />
          <button type="submit" class="button-link button-link--primary">অদলবদল নিশ্চিত করুন</button>
        </form>
        <a class="button-link" href="/admin/modules/subjects/bangla/11-12/first-paper/sahapath">বাতিল</a>
      </div>
    </section>
  `;
};

export const renderBanglaElevenTwelveHome = (): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">বাংলা ১ম পত্র (শ্রেণি ১১-১২)</h1>
      <p class="page-subtitle">একটি বিভাগ নির্বাচন করুন।</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects/bangla/11-12">পেছনে যান</a>
        <a class="button-link" href="/admin/modules/subjects">Subjects</a>
      </div>
    </header>
    <section class="page-section">
      <div class="card-grid">
        <a class="card-link" href="/admin/modules/subjects/bangla/11-12/first-paper/sahapath">
          <span class="card-title">সহপাঠ</span>
        </a>
        <a class="card-link" href="/admin/modules/subjects/bangla/11-12/first-paper/literature">
          <span class="card-title">বাংলা সাহিত্য</span>
        </a>
      </div>
    </section>
  </section>
`;

export const renderBanglaElevenTwelveLiteratureHome = (): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">বাংলা সাহিত্য (১ম পত্র, শ্রেণি ১১-১২)</h1>
      <p class="page-subtitle">একটি ধরণ নির্বাচন করুন।</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects/bangla/11-12/first-paper">পেছনে যান</a>
      </div>
    </header>
    <section class="page-section">
      <div class="card-grid">
        <a class="card-link" href="/admin/modules/subjects/bangla/11-12/first-paper/literature/goddo">
          <span class="card-title">গদ্য</span>
        </a>
        <a class="card-link" href="/admin/modules/subjects/bangla/11-12/first-paper/literature/poddo">
          <span class="card-title">পদ্য</span>
        </a>
      </div>
    </section>
  </section>
`;

export const renderBanglaElevenTwelveSahapathList = (props: {
  items: BanglaElevenTwelveSahapathItem[];
  availableCategories: string[];
  successMessage?: string;
  errorMessage?: string;
  swapPrompt?: {
    entryId: number;
    targetId: number;
    entryTitle: string;
    entryCategory: string;
    targetCategory: string;
  };
}): string => {
  const { items, availableCategories, successMessage, errorMessage, swapPrompt } = props;
  const addDisabled = availableCategories.length === 0;
  const modalBody = `
    <form class="form-card form-grid" method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/sahapath/new">
      <label class="form-field">
        <span>ধরণ নির্বাচন করুন</span>
        <select name="category" required>
          ${availableCategories
            .map((category) => `<option value="${category}">${sahapathLabels[category] ?? category}</option>`)
            .join("")}
        </select>
      </label>
      <label class="form-field">
        <span>নাম লিখুন</span>
        <input name="title" type="text" required />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">সংরক্ষণ করুন</button>
      </div>
    </form>
  `;

  const addButton = addDisabled
    ? `<button class="button-link" type="button" disabled>যোগ করা হয়েছে</button>`
    : renderModal("add-sahapath-11-12", "সহপাঠ যোগ করুন", modalBody, "Add", "button-link button-link--primary");

  return `
    <section class="page">
      <header class="page-header">
        <h1 class="page-title">সহপাঠ (শ্রেণি ১১-১২)</h1>
        <p class="page-subtitle">নাটক ও উপন্যাস যোগ করুন।</p>
        <div class="page-actions">
          <a class="button-link" href="/admin/modules/subjects/bangla/11-12/first-paper">পেছনে যান</a>
        </div>
      </header>
      ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
      ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
      ${renderSwapPrompt(swapPrompt)}
      <section class="page-section">
        <div class="page-actions">
          ${addButton}
        </div>
        <ul class="item-list">
          ${
            items.length
              ? items
                  .map((item) => {
                    const editBody = `
                      <form class="form-card form-grid" method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/sahapath/edit">
                        <input type="hidden" name="id" value="${item.id}" />
                        <label class="form-field">
                          <span>ধরণ</span>
                          <select name="category" required>
                            ${Object.entries(sahapathLabels)
                              .map(
                                ([key, label]) =>
                                  `<option value="${key}" ${item.category === key ? "selected" : ""}>${label}</option>`,
                              )
                              .join("")}
                          </select>
                        </label>
                        <label class="form-field">
                          <span>নাম</span>
                          <input name="title" type="text" value="${escapeValue(item.title)}" required />
                        </label>
                        <div class="form-actions">
                          <button type="submit" class="button-link button-link--primary">হালনাগাদ</button>
                        </div>
                      </form>
                    `;

                    return `
                      <li class="item-card">
                        <div class="item-card__main">
                          <a class="item-card__title" href="/admin/modules/subjects/bangla/11-12/first-paper/sahapath/${item.id}">${escapeValue(item.title)}</a>
                          <span class="item-card__meta">${sahapathLabels[item.category] ?? item.category}</span>
                        </div>
                        <div class="item-card__actions">
                          ${renderModal(
                            `edit-sahapath-${item.id}-11-12`,
                            "সহপাঠ সম্পাদনা",
                            editBody,
                            "✎",
                            "button-link",
                          )}
                          <div class="confirm-delete">
                            <input class="confirm-delete__toggle" type="checkbox" id="delete-sahapath-${item.id}-11-12" />
                            <label class="button-link" for="delete-sahapath-${item.id}-11-12">🗑️</label>
                            <div class="confirm-delete__modal" role="dialog" aria-modal="true" aria-labelledby="delete-sahapath-${item.id}-11-12-title">
                              <div class="confirm-delete__panel">
                                <div class="confirm-delete__header">
                                  <h3 id="delete-sahapath-${item.id}-11-12-title" class="confirm-delete__title">মুছে ফেলুন?</h3>
                                  <label class="confirm-delete__close" for="delete-sahapath-${item.id}-11-12" aria-label="Close">×</label>
                                </div>
                                <form class="confirm-delete__form" method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/sahapath/delete">
                                  <input type="hidden" name="id" value="${item.id}" />
                                  <div class="confirm-delete__actions">
                                    <label class="button-link" for="delete-sahapath-${item.id}-11-12">বাতিল</label>
                                    <button type="submit" class="button-link button-link--danger">মুছে ফেলুন</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    `;
                  })
                  .join("")
              : `<li class="item-card"><span class="helper-text">কোনো সহপাঠ যোগ করা হয়নি।</span></li>`
          }
        </ul>
      </section>
    </section>
  `;
};

export const renderBanglaElevenTwelveSahapathDetail = (item: BanglaElevenTwelveSahapathItem): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">${escapeValue(item.title)}</h1>
      <p class="page-subtitle">${sahapathLabels[item.category] ?? item.category}</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects/bangla/11-12/first-paper/sahapath">পেছনে যান</a>
      </div>
    </header>
  </section>
`;

export const renderBanglaElevenTwelveLiteratureList = (props: {
  items: BanglaElevenTwelveLiteratureItem[];
  category: string;
  successMessage?: string;
  errorMessage?: string;
}): string => {
  const { items, category, successMessage, errorMessage } = props;
  const title = literatureLabels[category] ?? category;
  const addBody = `
    <form class="form-card form-grid" method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/literature/${category}/new">
      <label class="form-field">
        <span>নাম লিখুন</span>
        <input name="title" type="text" required />
      </label>
      <div class="form-actions">
        <button type="submit" class="button-link button-link--primary">সংরক্ষণ করুন</button>
      </div>
    </form>
  `;

  return `
    <section class="page">
      <header class="page-header">
        <h1 class="page-title">${title} (শ্রেণি ১১-১২)</h1>
        <p class="page-subtitle">নতুন অধ্যায় যোগ করুন।</p>
        <div class="page-actions">
          <a class="button-link" href="/admin/modules/subjects/bangla/11-12/first-paper/literature">পেছনে যান</a>
        </div>
      </header>
      ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
      ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
      <section class="page-section">
        <div class="page-actions">
          ${renderModal(`add-${category}-11-12`, `${title} যোগ করুন`, addBody, "Add", "button-link button-link--primary")}
        </div>
        <ul class="item-list">
          ${
            items.length
              ? items
                  .map((item) => {
                    const editBody = `
                      <form class="form-card form-grid" method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/literature/${category}/edit">
                        <input type="hidden" name="id" value="${item.id}" />
                        <label class="form-field">
                          <span>নাম</span>
                          <input name="title" type="text" value="${escapeValue(item.title)}" required />
                        </label>
                        <div class="form-actions">
                          <button type="submit" class="button-link button-link--primary">হালনাগাদ</button>
                        </div>
                      </form>
                    `;
                    return `
                      <li class="item-card">
                        <div class="item-card__main">
                          <a class="item-card__title" href="/admin/modules/subjects/bangla/11-12/first-paper/literature/${category}/${item.id}">${escapeValue(item.title)}</a>
                        </div>
                        <div class="item-card__actions">
                          ${renderModal(`edit-${category}-${item.id}-11-12`, "সম্পাদনা", editBody, "✎", "button-link")}
                          <div class="confirm-delete">
                            <input class="confirm-delete__toggle" type="checkbox" id="delete-${category}-${item.id}-11-12" />
                            <label class="button-link" for="delete-${category}-${item.id}-11-12">🗑️</label>
                            <div class="confirm-delete__modal" role="dialog" aria-modal="true" aria-labelledby="delete-${category}-${item.id}-11-12-title">
                              <div class="confirm-delete__panel">
                                <div class="confirm-delete__header">
                                  <h3 id="delete-${category}-${item.id}-11-12-title" class="confirm-delete__title">মুছে ফেলুন?</h3>
                                  <label class="confirm-delete__close" for="delete-${category}-${item.id}-11-12" aria-label="Close">×</label>
                                </div>
                                <form class="confirm-delete__form" method="post" action="/admin/modules/subjects/bangla/11-12/first-paper/literature/${category}/delete">
                                  <input type="hidden" name="id" value="${item.id}" />
                                  <div class="confirm-delete__actions">
                                    <label class="button-link" for="delete-${category}-${item.id}-11-12">বাতিল</label>
                                    <button type="submit" class="button-link button-link--danger">মুছে ফেলুন</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    `;
                  })
                  .join("")
              : `<li class="item-card"><span class="helper-text">কোনো ${title} যোগ করা হয়নি।</span></li>`
          }
        </ul>
      </section>
    </section>
  `;
};

export const renderBanglaElevenTwelveLiteratureDetail = (item: BanglaElevenTwelveLiteratureItem): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">${escapeValue(item.title)}</h1>
      <p class="page-subtitle">${literatureLabels[item.category] ?? item.category}</p>
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects/bangla/11-12/first-paper/literature/${item.category}">পেছনে যান</a>
      </div>
    </header>
  </section>
`;
