
RJS=graph
GUI_FILES=gui/GraphGUI_View.js gui/GraphGUI_Controller.js gui/GraphGUI_SVG.js
GRAPH_FILES=$(RJS)/Hash.js $(RJS)/Class.js $(RJS)/Graph.js \
	$(RJS)/GraphAnalyzer.js $(RJS)/GraphLayouter.js \
	$(RJS)/GraphParser.js $(RJS)/GraphTransformer.js \
	$(RJS)/GraphGenerator.js \
	$(RJS)/ObservedGraph.js $(RJS)/GraphSerializer.js \
	parser/GraphDotParser.js

all : install dagitty-alg.js

.PHONY : install force_look

jsmin  : jsmin.c
	gcc -O2 -o $@ $<

.DELETE_ON_ERROR:

dagitty-alg.js : $(GRAPH_FILES)
	cat $(GRAPH_FILES) > $@

dagitty.js : underscore-min.js dagitty-alg.js $(GUI_FILES)
	cat $^ > $@

dagitty-min.js : dagitty.js jsmin
	./jsmin < dagitty.js > $@

install : dagitty-min.js
	cp dagitty.js ../gui/js/dagitty.js
	
parser/GraphDotParser.js : force_look
	cd parser ; make

clean:
	rm -f dagitty.js jsmin.exe jsmin dagitty-min.js
 