# node-red-contrib-unfluff
## An automatic web page content extractor.

Automatically grab the main text out of a webpage, or in other words, it turns pretty webpages into boring plain text/json data.

This is a Node-RED wrapper for the npm module unfluff. Read more at https://www.npmjs.com/package/unfluff


Outputs a JSON object with the following fields:

````
title - The document's title (from the <title> tag)
softTitle - A version of title with less truncation
date - The document's publication date
copyright - The document's copyright line, if present
author - The document's author
publisher - The document's publisher (website name)
text - The main text of the document with all the junk thrown away
image - The main image for the document (what's used by facebook, etc.)
videos - An array of videos that were embedded in the article. Each video has src, width and height.
tags- Any tags or keywords that could be found by checking <rel> tags or by looking at href urls.
canonicalLink - The canonical url of the document, if given.
lang - The language of the document, either detected or supplied by you.
description - The description of the document, from <meta> tags
favicon - The url of the document's favicon.
links - An array of links embedded within the article text. (text and href for each)
````

# input
send a `msg.url` to dynamically input a url.