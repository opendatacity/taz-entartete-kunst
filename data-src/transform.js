var fs = require('fs');

var files = ['artists.tsv', 'merchants.tsv'],
remainingCount = files.length,
result = [];

files.forEach(function (filename, i) {
	fs.readFile(filename, process(i));
});

function pageMap (old) {
	old = parseInt(old, 10);
	if (old <= 148) return old + 1;
	if (old <= 197) return old;
	if (old <= 431) return old - 1;
	if (old <= 479) return old - 4;
	return NaN;
}

function process (index) { return function (err, data) {
	data = (""+data)
		.split(/\n/)
		.map(function (row) {
			row = row.split(/\t+/);
			return [
				row.shift(),
				row.map(function (n) { return pageMap(n, 10); })
				.filter(function (n) { return !isNaN(n); })
			];
		});
	result[index] = data;
	parseDone();
}}

function parseDone () {
	remainingCount--;
	if (remainingCount === 0) {
		fs.writeFile('../app/data/raubkunst.json', JSON.stringify(result), function () {
			console.log('Written.');
		});
	}
}
