/*global $: false */
'use strict';

function logAttr(jq, name) {
  console.log('checked attr =', jq.attr(name));
  //console.log('checked prop =', jq.prop(name));
}

$(function () {
  var checkbox = $('#likeCb');
  logAttr(checkbox, 'checked');
  checkbox.change(function () {
    logAttr($(this), 'checked');
  });
});
