/*global $: false */
'use strict';

function lookup() {
  var queryString, url;
  queryString = $('form').serialize();
  url = 'http://api.geonames.org/postalCodeLookupJSON?' + queryString;
  $.getJSON(url, function (data) {
    var found = false;
    $.each(data.postalcodes, function (index, value) {
      if (value.countryCode === 'US') {
        $('#city').text(value.placeName);
        $('#state').text(value.adminName1);
        found = true;
      }
    });
    if (!found) {
      $('#city').text('No match found');
      $('#state').text('');
    }
  });
}

$(function () {
  $('#lookup').click(lookup);
});
