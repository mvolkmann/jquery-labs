/*global $: false */
'use strict';

var baseURI, itemArray, metaArray;

// This must be preceeded with 'http' or 'https'.
baseURI = '://query.yahooapis.com/v1/public/yql';

function getRequestToken() {
  var inData, key, query, secret, url;
  key = 'dj0yJmk9UDRaRU9QamdGSklJJmQ9WVdrOVV6SllSazEzTjJVbWNHbzlOVEk1T0RNeE1EWXkmcz1jb25zdW1lcnNlY3JldCZ4PTc5';
  secret = 'cb1ba7b2f6933dfe5b84f4acc2c6920ae29c643a';
  //url = 'https://api.login.yahoo.com/oauth/vw/get_request_token';
  query = 'select * from twitter.oauth.requesttoken ' +
    'where oauth_consumer_key="' + key +
    '" and oauth_consumer_secret="' + secret + '"';
  inData = {
    q: query,
    format: 'json',
    env: 'store://datatables.org/alltableswithkeys'
  };
  $.getJSON('https' + baseURI, inData, function (outData, textStatus) {
    console.log('textStatus = ' + textStatus);
    console.log('outData = ' + outData);
  });
}

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
    format: 'json',
    env: 'store://datatables.org/alltableswithkeys'
  };
  url = 'http' + baseURI + '?' + $.param(data) + '&callback=?';
  $.getJSON(url, processResponse);
}

$(function () {
  getRequestToken();
  $('#lookup').click(lookup);
});
