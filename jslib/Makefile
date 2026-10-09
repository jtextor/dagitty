
# The graph algorithms come from libdagitty. Run `npm run build` there
# first, or point LIBDAGITTY to a different build.
LIBDAGITTY ?= ../../libdagitty/dist/dagitty-alg.js
GUI_FILES=gui/Class.js gui/Hash.js gui/libdagitty-globals.js \
	gui/ObservedGraph.js gui/GraphGUI_View.js gui/GraphGUI_Controller.js \
	gui/GraphGUI_SVG.js

all : install

.PHONY : install

jsmin  : jsmin.c
	gcc -O2 -o $@ $<

.DELETE_ON_ERROR:

dagitty-alg.js : $(LIBDAGITTY)
	cp $< $@

dagitty.js : underscore-min.js dagitty-alg.js $(GUI_FILES)
	cat $^ > $@

dagitty-min.js : dagitty.js jsmin
	./jsmin < dagitty.js > $@

install : dagitty-min.js
	cp dagitty.js ../gui/js/dagitty.js ; cp dagitty-alg.js ../r/inst/js/

clean:
	rm -f dagitty.js dagitty-alg.js jsmin.exe jsmin dagitty-min.js
