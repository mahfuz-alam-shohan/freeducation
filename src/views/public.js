import { dashboardShell } from "./layout.js";

const quoteStream = [
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    text: "Knowledge comes, but wisdom lingers.",
    author: "Alfred Lord Tennyson",
  },
  {
    text: "The mind is not a vessel to be filled but a fire to be kindled.",
    author: "Plutarch",
  },
];

function quoteScript() {
  return `
    <script>
      (() => {
        const quotes = ${JSON.stringify(quoteStream)};
        const container = document.querySelector("[data-quote-rotator]");
        if (!container || !quotes.length) {
          return;
        }

        const textEl = container.querySelector(".quote-text");
        const authorEl = container.querySelector(".quote-author");
        let index = 0;

        const renderQuote = () => {
          const quote = quotes[index % quotes.length];
          if (textEl) {
            textEl.textContent = "“" + quote.text + "”";
          }
          if (authorEl) {
            authorEl.textContent = quote.author;
          }
        };

        renderQuote();
        window.setInterval(() => {
          index += 1;
          renderQuote();
        }, 6500);
      })();
    </script>
  `;
}

function frontPage({ navigation, userProfile, authAction, primaryAction }) {
  const actionLabel = primaryAction?.label ?? "Member access";
  const actionHref = primaryAction?.href ?? "/login";
  return dashboardShell({
    title: "Front Page",
    contextLabel: navigation.contextLabel,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    sidebarTitle: navigation.sidebarTitle,
    userProfile,
    authAction,
    content: `
      <div class="frontpage-layout">
        <section class="frontpage-hero">
          <div class="frontpage-intro">
            <div class="frontpage-eyebrow">Freeducation Reading Room</div>
            <h1 class="frontpage-title">Enterprise learning, presented with clarity.</h1>
            <p class="frontpage-subtitle">
              A public shelf of enduring writings and a guided entry point for members.
            </p>
            <div class="frontpage-actions">
              <a class="button-link" href="${actionHref}">${actionLabel}</a>
              <span class="small">Public browsing stays open.</span>
            </div>
          </div>
          <div class="quote-cover">
            <div class="quote-rotator" data-quote-rotator>
              <div class="quote-text"></div>
              <div class="quote-author"></div>
            </div>
          </div>
        </section>
        <section class="info-grid">
          <div class="info-card">
            <strong>Today’s reading guide</strong>
            <p class="small">Explore a curated set of essays on leadership, ethics, and civic responsibility.</p>
          </div>
          <div class="info-card">
            <strong>Library hours</strong>
            <p class="small">Digital shelves remain open 24/7, with staff notes updated every weekday.</p>
          </div>
          <div class="info-card">
            <strong>Member focus</strong>
            <p class="small">Teachers and students keep shared annotations synced across devices.</p>
          </div>
        </section>
        <section class="frontpage-panels">
          <div class="frontpage-panel">
            <div class="frontpage-panel-title">Public Library</div>
            <div class="small">Open reading across our curated catalog of enduring works.</div>
          </div>
          <div class="frontpage-panel">
            <div class="frontpage-panel-title">Scholars Archive</div>
            <div class="small">Indexed writings prepared for structured study and review.</div>
          </div>
          <div class="frontpage-panel">
            <div class="frontpage-panel-title">Member Collections</div>
            <div class="small">Personal shelves for teachers, students, and administrators.</div>
          </div>
        </section>
        <section class="accent-band">
          <div>
            <h3 class="section-title">Library highlights</h3>
            <p class="small">Weekly notes are hand-edited to keep reading lists clear and accessible.</p>
          </div>
          <div class="chip-group">
            <span class="chip">Civic literacy</span>
            <span class="chip">Science history</span>
            <span class="chip">Ethics &amp; debate</span>
            <span class="chip">Teaching practice</span>
            <span class="chip">Student essays</span>
          </div>
        </section>
        <section class="frontpage-strip">
          <span><strong>Quote stream:</strong> rotating selections from our library.</span>
          <span><strong>Access:</strong> public browsing plus role-based workspaces.</span>
          <span><strong>Focus:</strong> reading clarity and structured navigation.</span>
        </section>
      </div>
      ${quoteScript()}
    `,
  });
}

export { frontPage };
