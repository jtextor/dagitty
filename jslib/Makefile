
RJS=graph
GUI_FILES=gui/GraphGUI_View.js gui/GraphGUI_Controller.js gui/GraphGUI_SVG.js gui/GraphGUI_Raphael.js 
GRAPH_FILES=underscore-min.js $(RJS)/Hash.js $(RJS)/Class.js $(RJS)/Graph.js \
	$(RJS)/GraphAnalyzer.js graph/GraphLayouter.js \
	$(RJS)/GraphParser.js $(RJS)/GraphTransformer.js graph/GraphGenerator.js \
	graph/ObservedGraph.js $(RJS)/GraphSerializer.js

all : install

.PHONY : install

jsmin  : jsmin.c
	gcc -O2 -o $@ $<

.DELETE_ON_ERROR:

dagitty.js : $(GUI_FILES) $(GRAPH_FILES)
	cat $(GUI_FILES) $(GRAPH_FILES) > $@

dagitty-min.js : dagitty.js jsmin
	./jsmin < dagitty.js > $@

install : dagitty-min.js
	cp dagitty.js ../gui/js/dagitty.js

clean:
	rm -f dagitty.js jsmin.exe jsmin dagitty-min.js
