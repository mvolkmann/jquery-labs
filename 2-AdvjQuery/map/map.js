var arr, newArr;

arr = [1, 2, 3];

newArr = arr.map(function (v) { return v * 2; });
console.log('with ECMAScript 5, ' + newArr);

newArr = $.map(arr, function (v) { return v * 2; });
console.log('with jQuery, ' + newArr);
