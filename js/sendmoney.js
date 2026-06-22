// Enviar dinero: buscar contacto con autocompletar, agregar contactos y transferir.

$(function () {
  const $balance = $('#currentBalance');
  const $search = $('#contactSearch');
  const $autocomplete = $('#autocompleteList');
  const $contactList = $('#contactList');
  const $sendForm = $('#sendForm');
  const $sendAlert = $('#sendAlert');

  // Contacto elegido para la transferencia (null mientras no se elige ninguno).
  let selectedContact = null;

  function renderBalance() {
    $balance.text(AlkeUtils.formatCurrency(AlkeStore.getBalance()));
  }

  function showAlert($box, message, type) {
    $box.attr('class', `alert alert-${type}`).text(message).hide().fadeIn(200);
  }

  function selectContact(contact) {
    selectedContact = contact;
    $search.val(`${contact.name} (${contact.account})`).removeClass('is-invalid');
    $autocomplete.addClass('d-none').empty();
    $('#sendAmount').trigger('focus');
  }

  function renderContacts() {
    const contacts = AlkeStore.getContacts();
    $contactList.empty();

    if (contacts.length === 0) {
      $contactList.html(
        '<li class="list-group-item text-muted text-center py-4">' +
          'Todavía no tienes contactos. Agrega uno para empezar.</li>'
      );
      return;
    }

    contacts.forEach((contact) => {
      const $item = $(`
        <li class="list-group-item contact-item d-flex align-items-center gap-3 py-3">
          <span class="avatar" aria-hidden="true">${AlkeUtils.escapeHtml(contact.name.charAt(0).toUpperCase())}</span>
          <div>
            <div class="fw-semibold">${AlkeUtils.escapeHtml(contact.name)}</div>
            <div class="small text-muted">${AlkeUtils.escapeHtml(contact.account)}</div>
          </div>
        </li>`);
      $item.on('click', () => selectContact(contact));
      $contactList.append($item);
    });
  }

  // Autocompletar: al escribir muestra los contactos que coinciden.
  $search.on('input focus', function () {
    selectedContact = null;
    const results = AlkeStore.searchContacts($(this).val());

    $autocomplete.empty();
    if (results.length === 0) {
      $autocomplete.addClass('d-none');
      return;
    }

    results.forEach((contact) => {
      const $option = $(`
        <li class="list-group-item list-group-item-action contact-item">
          <span class="fw-semibold">${AlkeUtils.escapeHtml(contact.name)}</span>
          <span class="small text-muted d-block">${AlkeUtils.escapeHtml(contact.account)}</span>
        </li>`);
      $option.on('click', () => selectContact(contact));
      $autocomplete.append($option);
    });
    $autocomplete.removeClass('d-none');
  });

  // Cerrar las sugerencias al hacer clic fuera.
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#contactSearch, #autocompleteList').length) {
      $autocomplete.addClass('d-none');
    }
  });

  // Agregar nuevo contacto desde el modal.
  const $contactForm = $('#contactForm');
  $contactForm.on('submit', function (e) {
    e.preventDefault();
    if (!this.checkValidity()) {
      $contactForm.addClass('was-validated');
      return;
    }

    const result = AlkeStore.addContact({
      name: $('#contactName').val(),
      account: $('#contactAccount').val(),
    });

    if (!result.ok) {
      showAlert($('#contactAlert'), result.message, 'danger');
      return;
    }

    renderContacts();
    this.reset();
    $contactForm.removeClass('was-validated');
    $('#contactAlert').attr('class', 'alert d-none');
    bootstrap.Modal.getInstance(document.getElementById('addContactModal')).hide();
  });

  // Transferencia.
  $sendForm.on('submit', function (e) {
    e.preventDefault();

    const validFields = this.checkValidity();
    if (!selectedContact) {
      $search.addClass('is-invalid');
    }
    if (!validFields || !selectedContact) {
      $sendForm.addClass('was-validated');
      return;
    }

    const amount = Number($('#sendAmount').val());
    const result = AlkeStore.sendMoney({
      counterpart: selectedContact.name,
      amount,
      concept: $('#sendConcept').val().trim(),
    });

    if (!result.ok) {
      showAlert($sendAlert, result.message, 'danger');
      return;
    }

    $({ value: result.balance + amount }).animate(
      { value: result.balance },
      {
        duration: 700,
        step: function () {
          $balance.text(AlkeUtils.formatCurrency(this.value));
        },
        complete: renderBalance,
      }
    );

    showAlert($sendAlert, `Enviaste ${AlkeUtils.formatCurrency(amount)} a ${selectedContact.name} correctamente.`, 'success');

    this.reset();
    $sendForm.removeClass('was-validated');
    $search.removeClass('is-invalid');
    selectedContact = null;
  });

  renderBalance();
  renderContacts();
});
