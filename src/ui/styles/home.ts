export const homeStyles = `
  body { padding-bottom: 0; }
  .home-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }
  .home-card {
    width: min(920px, 100%);
    background: white;
    border-radius: 28px;
    padding: 24px;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(15, 28, 22, 0.06);
  }
  .home-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .home-brand .brand-title {
    font-size: 18px;
  }
  .home-brand .brand-subtitle {
    display: block;
  }
  .hero h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin: 0 0 0.5rem;
    letter-spacing: -0.6px;
  }
  .hero p {
    max-width: 520px;
    color: var(--text-muted);
    font-size: 1rem;
    margin: 0 0 1.2rem;
  }
  .home-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  @media (min-width: 720px) {
    .home-card {
      padding: 32px;
    }
  }
`;
