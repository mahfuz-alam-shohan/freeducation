export const SCRIPTS = `

<script>
  function updateQuestionForm(target) {
    const form = target?.closest('[data-question-form]') || target;
    if (!form) return;
    const typeSelect = form.querySelector('select[name="type"]');
    const typeInput = form.querySelector('input[name="type"]');
    const type = (typeSelect && typeSelect.value) || (typeInput && typeInput.value) || form.getAttribute('data-question-type') || '';
    const sourceField = form.querySelector('[data-question-source]');
    const sourceInput = form.querySelector('input[name="source_label"]');
    const needsSource = ["board", "versity", "college"].includes(type);
    if (sourceField) sourceField.style.display = needsSource ? '' : 'none';
    if (sourceInput) sourceInput.required = needsSource;

    const mcqBlock = form.querySelector('[data-question-mcq]');
    const answerBlock = form.querySelector('[data-question-answer]');
    const isMcq = type === 'mcq';
    if (mcqBlock) mcqBlock.style.display = isMcq ? '' : 'none';
    if (answerBlock) answerBlock.style.display = isMcq ? 'none' : '';

    const answerTypeSelect = form.querySelector('select[name="answer_type"]');
    const answerMediaField = form.querySelectorAll('[data-question-attachment]');
    if (answerTypeSelect) {
      const showMedia = answerTypeSelect.value !== 'text';
      answerMediaField.forEach((field, idx) => {
        if (idx === 1 && field instanceof HTMLElement) {
          field.style.display = showMedia ? '' : 'none';
        }
      });
    }
  }

  function toggleModal(id, show) {
    const el = document.getElementById(id);
    if(show) {
      el.classList.add('open');
    } else {
      el.classList.remove('open');
    }
  }

  function openEdit(modalId, action, data) {
    const modal = document.getElementById(modalId);
    if(!modal) return;
    const form = modal.querySelector('form');
    if(form) form.action = action;
    
    // Auto-fill
    for (const [key, val] of Object.entries(data)) {
      const input = form.elements[key];
      if(input) {
        if(input.type === 'checkbox') input.checked = !!val;
        else input.value = val;
      }
    }
    toggleModal(modalId, true);
  }

  function filterList(inputId, rowSelector) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll(rowSelector).forEach((row) => {
      const label = (row.getAttribute('data-filter') || row.textContent || '').toLowerCase();
      row.style.display = label.includes(query) ? '' : 'none';
    });
  }

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('select[name="type"], select[name="answer_type"]')) {
      updateQuestionForm(target);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-question-form]').forEach((form) => updateQuestionForm(form));
  });
</script>
`;
