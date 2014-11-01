/*global $: false, alert: false */
'use strict';

function processResponse(res, textStatus) {
  if (textStatus && textStatus !== 'success') {
    alert('processResponse: textStatus = ' + textStatus);
  } else {
    $("#results").text("IP ADDR: " + res.ip);
  }

  $('*').css('cursor', 'default');
}

function lookup() { 
  var url = 'http://ip.jsontest.com';
  $('*').css('cursor', 'wait');
  $.getJSON(url, processResponse);
  //return false; //TODO: Why do this?
}

$(function () {
  $('#lookup').click(lookup);
});
