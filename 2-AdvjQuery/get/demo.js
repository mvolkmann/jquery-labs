/*global $: false, alert: false */
'use strict';

function greet() {
  var data, url;
  data = {
    firstName: $('#firstName').val(),
    lastName: $('#lastName').val()
  };
  //data = $('form').serialize();
  //data = $('form').serializeArray();
  console.log('data =', data);
  url = 'http://localhost:3000/greet';
  //url += '?name=' + name;

  /*
  $.get(url, data, function (data, textStatus) {
    alert(data);
  });
  */

  $.get(url, data).
    //success(function (data, textStatus) {
    then(function (data) {
      alert(data);
      console.log('success: data =', data);
    }).
    //error(function (xhr) {
    fail(function (xhr) {
      console.log('error: responseText =', xhr.responseText);
      console.log('error: status =', xhr.status);
    }).
    //complete(function (xhr) {
    done(function (data, textStatus) {
      console.log('done: textStatus =', textStatus);
    });
}

$(function () {
  $('#greet').click(greet);
});
