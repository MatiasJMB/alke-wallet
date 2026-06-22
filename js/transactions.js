// Historial de movimientos con totales y filtro por tipo.

$(function () {
  const transactions = AlkeStore.getTransactions();
  const $tbody = $('#txTableBody');
  const $empty = $('#emptyState');

  const labels = { deposit: 'Depósito', receive: 'Recibido', send: 'Envío', withdraw: 'Retiro' };

  const totalIn = transactions
    .filter((t) => t.type === 'deposit' || t.type === 'receive')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.type === 'send' || t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  $('#balanceAmount').text(AlkeUtils.formatCurrency(AlkeStore.getBalance()));
  $('#totalIn').text(AlkeUtils.formatCurrency(totalIn));
  $('#totalOut').text(AlkeUtils.formatCurrency(totalOut));

  function render(filter) {
    const list = transactions.filter((tx) => {
      if (filter === 'in') return tx.type === 'deposit' || tx.type === 'receive';
      if (filter === 'out') return tx.type === 'send' || tx.type === 'withdraw';
      return true;
    });

    $tbody.empty();

    if (list.length === 0) {
      $empty.removeClass('d-none');
      return;
    }
    $empty.addClass('d-none');

    list.forEach((tx) => {
      const isIncome = tx.type === 'deposit' || tx.type === 'receive';
      const sign = isIncome ? '+' : '-';
      const amountClass = isIncome ? 'amount-in' : 'amount-out';

      $tbody.append(`
        <tr>
          <td class="tx-type">${labels[tx.type] || 'Movimiento'}</td>
          <td>${AlkeUtils.escapeHtml(tx.concept)}</td>
          <td class="text-muted">${AlkeUtils.escapeHtml(tx.counterpart)}</td>
          <td class="text-muted small">${AlkeUtils.formatDate(tx.date)}</td>
          <td class="text-end ${amountClass}">${sign}${AlkeUtils.formatCurrency(tx.amount)}</td>
        </tr>`);
    });
  }

  $('#txFilters').on('click', 'button', function () {
    $('#txFilters button').removeClass('btn-brand').addClass('btn-outline-secondary');
    $(this).removeClass('btn-outline-secondary').addClass('btn-brand');
    render($(this).data('filter'));
  });

  render('all');
});
