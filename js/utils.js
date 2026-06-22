// Funciones de formato que se reutilizan en varias pantallas.

const AlkeUtils = (() => {
  const clp = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  function formatCurrency(amount) {
    return clp.format(amount || 0);
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Escapa el texto del usuario antes de meterlo al DOM (evita inyección de HTML).
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  return { formatCurrency, formatDate, escapeHtml };
})();
