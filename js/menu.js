// Dashboard: saldo, totales y vista previa de los últimos movimientos.

$(function () {
  const transactions = AlkeStore.getTransactions();

  const totalIn = transactions
    .filter((t) => t.type === 'deposit' || t.type === 'receive')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions
    .filter((t) => t.type === 'send' || t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  // Animamos el saldo desde 0 para darle algo de vida al dashboard.
  $({ value: 0 }).animate(
    { value: AlkeStore.getBalance() },
    {
      duration: 900,
      step: function () {
        $('#balanceAmount').text(AlkeUtils.formatCurrency(this.value));
      },
      complete: function () {
        $('#balanceAmount').text(AlkeUtils.formatCurrency(AlkeStore.getBalance()));
      },
    }
  );

  $('#totalIn').text(AlkeUtils.formatCurrency(totalIn));
  $('#totalOut').text(AlkeUtils.formatCurrency(totalOut));

  const recent = transactions.slice(0, 4);
  const $list = $('#recentList');

  if (recent.length === 0) {
    $list.html(
      '<li class="list-group-item text-center text-muted py-4">' +
        'Aún no tienes movimientos. ¡Realiza tu primer depósito!</li>'
    );
  } else {
    recent.forEach((tx) => {
      const isIncome = tx.type === 'deposit' || tx.type === 'receive';
      const sign = isIncome ? '+' : '-';
      const amountClass = isIncome ? 'amount-in' : 'amount-out';

      $list.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center py-3 px-3">
          <div>
            <div class="fw-medium">${AlkeUtils.escapeHtml(tx.concept)}</div>
            <div class="small text-muted">${AlkeUtils.escapeHtml(tx.counterpart)}</div>
          </div>
          <div class="text-end">
            <div class="${amountClass}">${sign}${AlkeUtils.formatCurrency(tx.amount)}</div>
            <div class="small text-muted">${AlkeUtils.formatDate(tx.date)}</div>
          </div>
        </li>`);
    });
  }

  $('#quickActions .quick-action').hide().each(function (i) {
    $(this).delay(120 * i).fadeIn(400);
  });
});
