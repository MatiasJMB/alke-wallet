// Pantalla de depósito: suma fondos al saldo y registra el movimiento.

$(function () {
  const $balance = $('#currentBalance');
  const $alert = $('#depositAlert');
  const $form = $('#depositForm');
  const $amount = $('#depositAmount');

  function renderBalance() {
    $balance.text(AlkeUtils.formatCurrency(AlkeStore.getBalance()));
  }

  function showAlert(message, type) {
    $alert.attr('class', `alert alert-${type}`).text(message).hide().fadeIn(200);
  }

  renderBalance();

  // Botones de monto rápido: suman al valor que ya esté escrito.
  $('#quickAmounts').on('click', 'button', function () {
    const current = Number($amount.val()) || 0;
    $amount.val(current + Number($(this).data('amount')));
  });

  $form.on('submit', function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
      $form.addClass('was-validated');
      return;
    }

    const amount = Number($amount.val());
    const concept = $('#depositConcept').val().trim();
    const result = AlkeStore.deposit(amount, concept);

    if (!result.ok) {
      showAlert(result.message, 'danger');
      return;
    }

    // Animamos el saldo desde el valor anterior hasta el nuevo.
    $({ value: result.balance - amount }).animate(
      { value: result.balance },
      {
        duration: 700,
        step: function () {
          $balance.text(AlkeUtils.formatCurrency(this.value));
        },
        complete: renderBalance,
      }
    );

    showAlert(`¡Depósito exitoso! Se agregaron ${AlkeUtils.formatCurrency(amount)} a tu cuenta.`, 'success');
    $form[0].reset();
    $form.removeClass('was-validated');
  });
});
