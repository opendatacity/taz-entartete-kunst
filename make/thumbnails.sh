#!/bin/sh
cd app/images/
rm -r thumbs/
mkdir thumbs
n=0
for file in reader/*; do
	n=$((n+1))
	echo "$file"
	convert $file -resize 200x -sharpen 1 -quality 70 "thumbs/${n}.jpg" || break
done
