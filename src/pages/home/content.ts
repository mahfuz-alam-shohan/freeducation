export const renderHomeContent = (): string => `
  <section class="page home">
    <header class="home-hero">
      <div class="home-hero__shapes" aria-hidden="true">
        <span class="shape shape--circle shape--one"></span>
        <span class="shape shape--circle shape--two"></span>
        <span class="shape shape--square shape--three"></span>
        <span class="shape shape--pill shape--four"></span>
        <span class="shape shape--diamond shape--five"></span>
      </div>
      <div class="home-hero__content">
        <p class="home-hero__eyebrow">Learning made clear</p>
        <h1 class="home-hero__title">freeducation</h1>
        <p class="home-hero__subtitle">A bright, friendly space for focused study without distractions.</p>
      </div>
    </header>
    <section class="home-quotes">
      <h2 class="home-quotes__title">Quotes on education</h2>
      <div class="home-quotes__rail" aria-live="polite">
        <ul class="home-quotes__list">
          <li class="home-quotes__item">"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela</li>
          <li class="home-quotes__item">"The roots of education are bitter, but the fruit is sweet." — Aristotle</li>
          <li class="home-quotes__item">"An investment in knowledge pays the best interest." — Benjamin Franklin</li>
          <li class="home-quotes__item">"Education is not the filling of a pail, but the lighting of a fire." — William Butler Yeats</li>
        </ul>
      </div>
    </section>
    <section class="home-highlights">
      <div class="home-highlight home-highlight--coral">
        <h3>Simple layout</h3>
        <p>Flat, readable content blocks with steady spacing and calm colors.</p>
      </div>
      <div class="home-highlight home-highlight--mint">
        <h3>Guided focus</h3>
        <p>Short prompts and quiet cues help learners stay on track.</p>
      </div>
      <div class="home-highlight home-highlight--sky">
        <h3>Always growing</h3>
        <p>We are ready to add student and teacher areas as we expand.</p>
      </div>
    </section>
  </section>
`;
