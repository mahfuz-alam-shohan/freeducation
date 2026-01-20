export const renderHomeContent = (): string => `
  <section class="page home">
    <section class="home-cover">
      <div class="home-cover__shapes" aria-hidden="true">
        <span class="shape shape--one"></span>
        <span class="shape shape--two"></span>
        <span class="shape shape--three"></span>
        <span class="shape shape--four"></span>
        <span class="shape shape--five"></span>
      </div>
      <div class="home-cover__content">
        <h1 class="home-cover__title">freeducation</h1>
        <div class="home-cover__quotes" aria-live="polite">
          <ul class="home-cover__list">
            <li class="home-cover__item">"Education is the most powerful weapon which you can use to change the world." — Nelson Mandela</li>
            <li class="home-cover__item">"The roots of education are bitter, but the fruit is sweet." — Aristotle</li>
            <li class="home-cover__item">"An investment in knowledge pays the best interest." — Benjamin Franklin</li>
            <li class="home-cover__item">"Education is not the filling of a pail, but the lighting of a fire." — William Butler Yeats</li>
          </ul>
        </div>
      </div>
    </section>
  </section>
`;
