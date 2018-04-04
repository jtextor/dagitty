all : GraphDotParser.js

GraphDotParser.js : GraphDotParser.pegjs
	pegjs --format globals -e GraphDotParser $<
