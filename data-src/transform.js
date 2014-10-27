var fs = require('fs');

var files = ['artists.tsv', 'merchants.tsv'],
remainingCount = files.length,
result = [];

files.forEach(function (filename, i) {
	fs.readFile(filename, process(i));
});

var pageMap = [ 
	[ 2, 3 ],
	[ 59, 74 ],
	[ 61, 60 ],
	[ 75, 76 ],
	[ 101, 112 ],
	[ 107, 102 ],
	[ 117, 118 ],
	[ 150, 150 ],
	[ 198, NaN ],
	[ 199, 198 ],
	[ 335, 341 ],
	[ 336, 334 ],
	[ 343, 342 ],
	[ 432, 434 ],
	[ 480, NaN ]
];

function mapPage (old) {
	old = parseInt(old, 10);
	for (var i=pageMap.length-1; i>=0; i--) {
		if (old >= pageMap[i][0]) return old + pageMap[i][1] - pageMap[i][0];
	}
	return NaN;
}

function process (index) { return function (err, data) {
	data = (""+data)
		.trim()
		.split(/\n/)
		.map(function (row) {
			row = row.trim().split(/\t+/);
			return [
				row.shift(),
				row.map(function (n) { return mapPage(n, 10); })
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
