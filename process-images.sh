#!/bin/sh
cd app/images/
mkdir thumbs
mkdir reader
rm thumbs/*
rm reader/*
n=0
for file in originals/*; do
	n=$((n+1))
	echo "$file"
	convert $file -resize 200x -sharpen 1 -quality 70 "thumbs/${n}.jpg" || break
	convert $file -resize 800x -sharpen 1 -quality 70 "reader/${n}.jpg" || break
done
