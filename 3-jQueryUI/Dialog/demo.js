/*global $: false, alert: false */

function createAccount() {
  var username = $('#username').val();
  if (username) {
    $('#username').removeClass('invalid');
    $(this).dialog('close');
    alert('created a new account for ' + username);
    $('#newDialog input').val('');
    $('#message').text('');
  } else {
    $('#username').addClass('invalid');
    $('#message').text('Required field username is empty.');
  }
}

$(function () {
  var newDialog = $('#newDialog').dialog({
    autoOpen: false,
    buttons: {
      'OK': createAccount,
      'Cancel': function () {
        $(this).dialog('close');
      }
    },
    hide: 'explode',
    modal: true,
    resizable: false,
    show: 'slide',
    width: 320
  });

  $('#newButton').button().click(function () {
    newDialog.dialog('open');
  });
});
