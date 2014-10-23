// Reads the generated JSON file and generates individual PDFs for each item

var fs = require('fs'),
PDF = require('pdfkit');

function pt (mm) {
	return mm / 25.4 * 72;
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

var size = [pt(210), pt(210*1.333)];

var fonts = {
	regular: 'app/fonts/andada/andada-regular-webfont.ttf',
	italic: 'app/fonts/andada/andada-italic-webfont.ttf',
	heading: 'app/fonts/andada/andadasc-regular-webfont.ttf'
}

function frontMatter (pdf) {
	pdf.fontSize(9).text('', pt(30), pt(200));

	pdf.text(
		'Die Seiten wurden aus einer digitalen Reproduktion '+
		'eines maschinengeschriebenen Verzeichnisses des ',
		{width: pt(110), continued: true}
	)
	.font(fonts.italic)
	.text(
		'Reichsministeriums für Volksaufklärung und Propaganda ',
		{width: pt(110), continued: true}
	)
	.font(fonts.regular)
	.text(
		'um 1941/1942 entnommen. Diese wird vom Londoner ',
		{width: pt(110), continued: true}
	)
	.font(fonts.italic)
	.text(
		'Victoria & Albert Museum ',
		{width: pt(110), continued: true}
	)
	.font(fonts.regular)
	.text(
		'bereitgestellt und unterliegt einer Creative-Commons-Lizenz '+
		'(CC-BY-NC 4.0 international).',
		{width: pt(110)}
	);

	pdf.moveDown(.5);
	pdf.font(fonts.heading).text('lizenz', { characterSpacing: .9 });
	pdf.font(fonts.regular).text('http://creativecommons.org/licenses/by-nc/4.0/legalcode');

	pdf.moveDown(.5);
	pdf.font(fonts.heading).text('über dieses verzeichnis', { characterSpacing: .9 });
	pdf.font(fonts.regular).text('http://vam.ac.uk/entartetekunst/');

	pdf.moveDown(.5);
	pdf.font(fonts.heading).text('heruntergeladen von', { characterSpacing: .9 });
	pdf.font(fonts.regular).text('https://apps.opendatacity.de/entartete-kunst/');
}

var debug = false;

function makePDF (artist, skipAbbreviations) {
	var name = artist[0], pages = artist[1];

	console.log(name);

	var pdf = new PDF({
		size: size,
		margin: {left: pt(30), right: pt(30), top: pt(80), bottom: pt(30)}
	});
	pdf.pipe(fs.createWriteStream('app/pdf/' + filename(name) + '.pdf'));

	pdf.rect(0, 0, size[0], size[1]).fill('black');

	pdf.fillColor('white');
	pdf.font(fonts.regular);

	pdf.fontSize(24).text('»Entartete Kunst«', pt(30), pt(80));
	pdf.fontSize(16).text(name, pt(30), pt(100));

	frontMatter(pdf);


	var page, i=0;
	while (page = pages.shift()) {
		pdf.addPage();
		pdf.image('app/images/reader/'+page+'.jpg', 0, 0, { width: pt(210) });
		i++;
	}

	if (!skipAbbreviations) {
		// add abbreviations page
		pdf.addPage();
		pdf.image('app/images/reader/7.jpg', 0, 0, { width: pt(210) });
	}

	pdf.end();
}

fs.readFile('app/data/raubkunst.json', function (err, data) {
	data = JSON.parse(data);
	var item, artist;

	if (debug) {
		makePDF(data[0][0]);
		return;
	}

	while (artists = data.shift()) {
		artists.forEach(makePDF);
	}
});
