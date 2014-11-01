/*global $: false */

function log(msg) {
  $('#logArea').append('<div>' + msg + '</div>');
}

function doIt() {
  log('<br/>$.makeArray demo:');
  log($.makeArray(arguments));
}

$(function () {
  $('#myTable tr').each(function (index, trNode) {
    log('row ' + (index + 1));
    $(trNode).children('td,th').each(function (index, tdNode) {
      var value = $(tdNode).text();
      log('* column ' + (index + 1) + ' = ' + value);
    });
  });

  doIt('one', 2, 3.14, true);
});
