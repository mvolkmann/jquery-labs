/*global $: false, alert: false */

var baseURI, itemArray, metaArray;
baseURI = 'http://query.yahooapis.com/v1/public/yql';

function getResource(rel) {
  var i, item;
  $.each(itemArray, function (i) {
    item = itemArray[i];
    if (item.rel === rel) {
      return item.resource;
    }
  });
  return null;
}

function getProperty(property) {
  var i, meta;
  $.each(metaArray, function (i) {
    meta = metaArray[i];
    if (meta.property === property) {
      return meta.content;
    }
  });
  return null;
}

function processResponse(data, textStatus) {
  var homepage, item;

  if (textStatus) {
    alert('processResponse: textStatus = ' + textStatus);
  }

  item = data.query.results.item;
  metaArray = item.meta;
  itemArray = item.item;
  $('#name').text(getProperty('foaf:name'));
  $('#location').text(getProperty('geo:location'));
  homepage = getProperty('foaf:homepage');
  $('#homepage').attr('href', homepage);
  $('#homepage').text(homepage);
  $('#photo').attr('src', getResource('rel:Photo'));

  $('*').css('cursor', 'default');
}

function lookup() {
  var data, query, url, username;
  $('*').css('cursor', 'wait');
  username = $('#username').val();
  query = "select * from twitter.user.profile where id='" + username + "'";
  data = {
    q: query,
    format: 'json', // try 'jsonp'?
    env: 'store://datatables.org/alltableswithkeys',
    callback: 'processResponse'
  };
  url = baseURI + '?' + $.param(data);
  $.getScript(url);
}

$(function () {
  $('#lookup').click(lookup);
});
