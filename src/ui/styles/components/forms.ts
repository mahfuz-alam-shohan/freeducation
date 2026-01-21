// Button and form component styles
export const componentStyles = `
  button {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button:hover { 
    background: var(--color-surface-muted); 
    border-color: var(--color-border-strong); 
  }
  
  button:active { 
    background: var(--color-surface-elevated); 
  }

  input,
  select,
  textarea {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 8px 10px;
    background: var(--color-surface);
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
    border-color: var(--color-accent);
  }
`;
