#!/bin/sh
cd app/images/
rm -r thumbs/
mkdir thumbs
for file in reader/*; do
	basename $file
	convert $file -resize 200x -sharpen 1 -quality 70 "thumbs/`basename $file`" || break
done
