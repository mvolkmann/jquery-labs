/*global $: false */

// This must be preceeded with 'http' or 'https'.
var baseURI = '://query.yahooapis.com/v1/public/yql';

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

$(function () {
  getRequestToken();
});
