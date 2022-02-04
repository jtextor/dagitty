
RJS=graph
GUI_FILES=gui/GraphGUI_View.js gui/GraphGUI_Controller.js gui/GraphGUI_SVG.js
GRAPH_FILES=$(RJS)/Class.js $(RJS)/Hash.js $(RJS)/Graph.js \
	$(RJS)/GraphAnalyzer.js $(RJS)/GraphLayouter.js \
	$(RJS)/GraphParser.js $(RJS)/GraphTransformer.js \
	$(RJS)/GraphGenerator.js \
	$(RJS)/ObservedGraph.js $(RJS)/GraphSerializer.js \
	$(RJS)/MPolynomials.js \
	parser/GraphDotParser.js

all : install dagitty-alg.js dagitty-node.js

.PHONY : install force_look

jsmin  : jsmin.c
	gcc -O2 -o $@ $<

.DELETE_ON_ERROR:

dagitty-alg.js : $(GRAPH_FILES)
	cat $^ > $@

dagitty-node.js : node-pre.js $(GRAPH_FILES) node-post.js
	cat $^ > $@

dagitty.js : underscore-min.js dagitty-alg.js $(GUI_FILES)
	cat $^ > $@

dagitty-min.js : dagitty.js jsmin
	./jsmin < dagitty.js > $@

install : dagitty-min.js
	cp dagitty.js ../gui/js/dagitty.js ; cp dagitty-alg.js ../r/inst/js/
	
parser/GraphDotParser.js : force_look
	cd parser ; make

clean:
	rm -f dagitty.js jsmin.exe jsmin dagitty-min.js
 
