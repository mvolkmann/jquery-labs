$(function () {
  var re = /important/i;
  var importantPs = $('p').filter(function () {
    return re.test($(this).text());
  });
  console.log('important count =', importantPs.size());
});
