// Reads the generated JSON file and generates individual PDFs for each item

var fs = require('fs'),
PDF = require('pdfkit'),
async = require('async');

var base = __dirname + '/../app/';

var debug = false;

var undefined;

function mm (x) {
	return x / 25.4 * 72;
}

function filename (string) {
	var dict = [
		[/ä/g, 'ae'],
		[/ö/g, 'oe'],
		[/ü/g, 'ue'],
		[/ß/g, 'ss'],
		[/é/g, 'e']
	]
	string = string.toLowerCase();
	dict.forEach(function (l) {
		string = string.replace(l[0], l[1]);
	});
	return string.replace(/[^a-z0-9]+/g, '-');
}

var size = [mm(210), mm(210*1.333)];

var fontsSrc = 'fonts/andada/',
fonts = {
	regular: fs.readFileSync(base+fontsSrc+'andada-regular-webfont.ttf'),
	italic: fs.readFileSync(base+fontsSrc+'andada-italic-webfont.ttf'),
	heading: fs.readFileSync(base+fontsSrc+'andadasc-regular-webfont.ttf')
}
function font (name) {
	return fonts[name];
}
var imageCache = {};
function image (page) {
	var filename = base+'images/reader/'+page+'.jpg';
	if (imageCache[filename]) return imageCache[filename];
	var buffer = fs.readFileSync(filename);
	imageCache[filename] = buffer;
	return buffer;
}

try { fs.mkdirSync(base+'pdf'); } catch (e) { if (e.code !== 'EEXIST') throw e; }

function frontMatter (pdf) {
	pdf.fontSize(9).text('', mm(30), mm(200));

	pdf.text(
		'Die Seiten wurden aus einer digitalen Reproduktion '+
		'eines maschinengeschriebenen Verzeichnisses des ',
		{width: mm(110), continued: true}
	)
	.font(font('italic'))
	.text(
		'Reichsministeriums für Volksaufklärung und Propaganda ',
		{width: mm(110), continued: true}
	)
	.font(font('regular'))
	.text(
		'um 1941/1942 entnommen. Diese wird vom Londoner ',
		{width: mm(110), continued: true}
	)
	.font(font('italic'))
	.text(
		'Victoria & Albert Museum ',
		{width: mm(110), continued: true}
	)
	.font(font('regular'))
	.text(
		'bereitgestellt und unterliegt einer Creative-Commons-Lizenz '+
		'(CC-BY-NC 4.0 international).',
		{width: mm(110)}
	);

	pdf.moveDown(.5);
	pdf.font(font('heading')).text('lizenz', { characterSpacing: .9 });
	pdf.font(font('regular')).text('http://creativecommons.org/licenses/by-nc/4.0/legalcode');

	pdf.moveDown(.5);
	pdf.font(font('heading')).text('über dieses verzeichnis', { characterSpacing: .9 });
	pdf.font(font('regular')).text('http://vam.ac.uk/entartetekunst');

	pdf.moveDown(.5);
	pdf.font(font('heading')).text('heruntergeladen von', { characterSpacing: .9 });
	pdf.font(font('regular')).text('http://kunstraub.taz.de');
}

function makePDF (artist, callback) {
	var skipAbbreviations = false;
	var name = artist[0], pages = artist[1];

	if (name === undefined) return;

	console.log(name, pages.length);

	var pdf = new PDF({
		size: size,
		margin: 0
	});
	pdf.pipe(fs.createWriteStream(base+'pdf/' + filename(name) + '.pdf'));

	pdf.rect(0, 0, size[0], size[1]).fill('black');

	pdf.fillColor('white');
	pdf.font(font('regular'));

	pdf.fontSize(24).text('»Entartete Kunst«', mm(30), mm(80));
	pdf.fontSize(16).text(name, mm(30), mm(100));

	frontMatter(pdf);


	pdf.fontSize(9);
	var page, i=0;
	while (page = pages.shift()) {
		if (page === 7) skipAbbreviations = true;
		pdf.addPage();
		pdf.image(image(page), 0, 0, { width: mm(210) });
		pdf.fillColor('white');
		pdf.text(page, size[0]-mm(40), size[1]-mm(12), { width: mm(30), align: 'right' });
		i++;
	}

	if (!skipAbbreviations) {
		// add abbreviations page
		pdf.addPage();
		pdf.image(image(7), 0, 0, { width: mm(210) });
	}

	pdf.end();
	if (callback) callback();
}

fs.readFile(base+'data/raubkunst.json', function (err, data) {
	data = JSON.parse(data);

	if (debug) {
		makePDF(data[0][0]);
		return;
	}

	var type, people = [];
	while (type = data.shift()) {
		type.forEach(function (person) { people.push(person); });
	}

	if (process.argv.length >= 3) {
		var range = process.argv[2].split('-');
		range[0] = +range[0];
		if (range[1]) range[1] = +range[1];
		people = people.slice(range[0], range[1]);
	}

	async.eachLimit(people, 100, makePDF, function (err) {
		console.log(err);
	});
});

var all = [ 'Gesamtverzeichnis', [] ];
for (i = 1; i <= 481; i++) all[1].push(i);
if (!debug) makePDF(all);
