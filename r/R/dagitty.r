#' @import V8 jsonlite
#' @importFrom boot boot
#' @importFrom MASS ginv
NULL

#' Get Bundled Examples
#'
#' Provides access to the builtin examples of the dagitty website.
#'
#' @param x name of the example, or part thereof. Supported values are:
#' \itemize{
#'  \item{"M-bias"}{ the M-bias graph.}
#'  \item{"confounding"}{ an extended confounding triangle.}
#'  \item{"mediator"}{ a small model with a mediator.}
#'  \item{"paths"}{ a graph with many variables but few paths}
#'  \item{"Sebastiani"}{ a small part of a genetics study (Sebastiani et al., 2005)}
#'  \item{"Polzer"}{ DAG from a dentistry study (Polzer et al., 2012)}
#'  \item{"Schipf"}{ DAG from a study on diabetes (Schipf et al., 2010)}
#'  \item{"Shrier"}{ DAG from a classic sports medicine example (Shrier & Platt, 2008)}
#'  \item{"Thoemmes"}{ DAG with unobserved variables 
#'	(communicated by Felix Thoemmes, 2013)}.
#'  \item{"Kampen"}{ DAG from a psychiatry study (van Kampen, 2014)}
#' }
#' @references
#' Sabine Schipf, Robin Haring, Nele Friedrich, Matthias Nauck, Katharina Lau,
#' Dietrich Alte, Andreas Stang, Henry Voelzke, and Henri Wallaschofski (2011),
#' Low total testosterone is associated with increased risk of incident
#' type 2 diabetes mellitus in men: Results from the study of health in
#' pomerania (SHIP). \emph{The Aging Male} \bold{14}(3):168--75.
#'
#' Paola Sebastiani, Marco F. Ramoni, Vikki Nolan, Clinton T. Baldwin, and
#' Martin H. Steinberg (2005), Genetic dissection and prognostic modeling of overt 
#' stroke in sickle cell anemia. \emph{Nature Genetics}, \bold{37}:435--440.
#' 
#' Ian Shrier and Robert W. Platt (2008), 
#' Reducing bias through directed acyclic graphs.
#' \emph{BMC Medical Research Methodology}, \bold{8}(70).
#'
#' Ines Polzer, Christian Schwahn, Henry Voelzke, Torsten Mundt, and Reiner
#' Biffar (2012), The association of tooth loss with all-cause and circulatory
#'  mortality. Is there a benefit of replaced teeth? A systematic review and
#'  meta-analysis. \emph{Clinical Oral Investigations}, \bold{16}(2):333--351.
#'
#' Dirk van Kampen (2014),
#' The SSQ model of schizophrenic prodromal unfolding revised: An
#'  analysis of its causal chains based on the language of directed graphs.
#' \emph{European Psychiatry}, \bold{29}(7):437--48.
#'
#' @export
getExample <- function( x ){
	ct <- .getJSContext()
	xv <- .getJSVar()
	tryCatch({
		.jsassign( xv, x )
		r <- ct$eval( paste0("DagittyR.findExample(global.",xv,")") )
	}, finally={.deleteJSVar(xv)})
	if( r != "undefined" ){
		structure(r,class="dagitty")
	} else {
		stop("Example ",x," could not be found!")
	}
}

#' Simulate Data from Structural Equation Model
#'
#' Interprets the input graph as a structural equation model, generates random path 
#' coefficients, and simulates data from the model. This is just a dumb frontend to 
#' lavaan's \code{\link[lavaan]{simulateData}} function and probably not very useful 
#' except for quick validation purposes (e.g. checking that an implied vanishing 
#' tetrad truly vanishes in simulated data). For more elaborate simulation studies, please
#' use the lavaan package or similar facilities in other packages.
#'
#' @details Data are generated in the following manner. 
#' Each directed arrow is assigned a path coefficient chosen uniformly
#' at random from the interval given by \code{b.lower} and \code{b.upper} (inclusive; set
#' both parameters to the same value for constant path coefficients). Each bidirected 
#' arrow a <-> b is replaced by a substructure  a <- L -> b, where L is an exogenous latent
#' variable. Path coefficients on such substructures are set to \code{sqrt(x)}, where 
#' \code{x} is again chosen at random from the given interval; if \code{x} is negative,
#' one path coefficient is set to \code{-sqrt(x)} and the other to \code{sqrt(x)}. All
#' residual variances are set to \code{eps}.
#' 
#' @param x the input graph, which may contain directed and bidirected edges.
#' @param N number of samples to generate.
#' @param b.lower lower bound for path coefficients.
#' @param b.upper upper bound for path coefficients.
#' @param eps residual variance.
#' 
#' @return Returns a data frame containing \code{N} values for each variable in \code{x}.
#' 
#' @examples
#' ## Simulate data with pre-defined path coefficients of -.6
#' if( require(lavaan) ){
#'   g <- dagitty('dag{z <-> x -> y}')
#'   x <- simulateSEM( g, -.6, -.6 )
#'   coef(sem(toString(g,"lavaan"),x,fixed.x=FALSE))
#' }
#' 
#' @export
simulateSEM <- function( x, b.lower=-.6, b.upper=.6, eps=1, N=500 ){
	if( !requireNamespace( "MASS", quietly=TRUE ) ){
		stop("This function requires the 'MASS' package!")
	}
	x <- as.dagitty( x )
	xc <- canonicalize( x )
	x <- xc$g
    vars <- names( x )
    e <- edges( x )
    if( nrow(e) > 0 ){
		Beta <- matrix( 0, nrow=length(vars), ncol=length(vars) )
		rownames(Beta) <- colnames(Beta) <- vars
		ecovs <- runif( length(xc$L), b.lower, b.upper )
		names(ecovs) <- xc$L
		e[,1] <- as.character(e[,1])
		e[,2] <- as.character(e[,2])
		for( i in seq_len( nrow( e ) ) ){
			if( e[i,1] %in% xc$L ){
				Beta[(e[i,1]),(e[i,2])] <- sqrt(abs(ecovs[e[i,1]]))
				if( ecovs[e[i,1]] < 0 ){
					Beta[(e[i,1]),(e[i,2])] <- - Beta[(e[i,1]),(e[i,2])]
					ecovs[e[i,1]] <- -ecovs[e[i,1]]
				}
			} else {
				Beta[(e[i,1]),(e[i,2])] <- runif(1,b.lower,b.upper)			
			}
		}
		L <- (diag( 1, length(vars) ) - Beta)
		Li <- MASS::ginv( L )
		Phi <- MASS::ginv( t(Li)^2 ) %*% rep(1,nrow(Beta))
		Phi <- diag( c(Phi), length(vars) )
		Sigma <- t(Li) %*% Phi %*% Li
	} else {
		Sigma <- diag(1,length(vars))
	}
	r <- MASS::mvrnorm( N, rep(0,length(vars)), Sigma )
	colnames(r) <- vars
	as.data.frame(r[,setdiff(vars,xc$L)])
}

#' Ancestral Relations
#'
#' Retrieve the names of all variables in a given graph that are in the specified 
#' ancestral relationship to the input variable \code{v}.
#'
#' @param x the input graph.
#' @param v name(s) of variable(s).
#'
#' \code{descendants(x,v)} retrieves variables that are are reachable from \code{v} via 
#' a directed path.
#'
#' \code{ancestors(x,v)} retrieves variables from which \code{v} is reachable via a 
#' directed path.
#'
#' \code{children(x,v)} finds all variables \code{w} connected to \code{v} 
#' by an edge \eqn{v} -> \eqn{w}.
#'
#' \code{parents(x,v)} finds all variables \code{w} connected to \code{v} 
#' by an edge \eqn{w} -> \eqn{v}.
#'
#' \code{markovBlanket(x,v}) returns \code{x}'s parents, its children, and all other
#' parents of its children. The Markov blanket always renders \code{x} independent
#' of all other nodes in the graph.
#'
#' By convention, \code{descendants(x,v)} and \code{ancestors(x,v)} include 
#' \code{v} but \code{children(x,v)} and \code{parents(x,v)} do not. 
#' 
#' @name AncestralRelations
#' 
NULL

#' @rdname AncestralRelations
#' @export
descendants <- function( x, v ){
	.kins( x, v, "descendants" )
}

#' @rdname AncestralRelations
#' @export
ancestors <- function( x, v ){
	.kins( x, v, "ancestors" )
}

#' @rdname AncestralRelations
#' @export
children <- function( x, v ){
	.kins( x, v, "children" )
}

#' @rdname AncestralRelations
#' @export
parents <- function( x, v ){
	.kins( x, v, "parents" )
}

#' @rdname AncestralRelations
#' @export
neighbours <- function( x, v ){
	.kins( x, v, "neighbours" )
}

#' @rdname AncestralRelations
#' @export
spouses <- function( x, v ){
	.kins( x, v, "spouses" )
}

#' @rdname AncestralRelations
#' @export
adjacentNodes <- function( x, v ){
	.kins( x, v, "adjacentNodes" )
}

#' @rdname AncestralRelations
#' @export
markovBlanket <- function( x, v ){
	setdiff( union( union( parents( x, v ), children( x, v ) ),
        	parents( x, children( x, v ) ) ), v )
}

#' Orient Edges in PDAG.
#'
#' Orients as many edges as possible in a  partially directed acyclic graph (PDAG)
#'  by converting induced subgraphs
#' X -> Y -- Z to X -> Y -> Z.
#'
#' @param x the input graph, a PDAG.
#' @export
orientPDAG <- function( x ){
	.graphTransformer( x, "cgToRcg" )
}

#' Generating Equivalent Models
#' 
#' \code{equivalenceClass(x)} generates a complete partially directed acyclic graph 
#' (CPDAG) from an input DAG \code{x}. The CPDAG represents all graphs that are Markov 
#' equivalent to \code{x}: undirected
#' edges in the CPDAG can be oriented either way, as long as this does not create a cycle
#' or a new v-structure (a sugraph a -> m <- b, where a and b are not adjacent).
#' 
#' \code{equivalentDAGs(x,n)} enumerates at most \code{n} DAGs that are Markov equivalent
#' to \code{x}.
#'
#' @param x the input graph, a DAG.
#' @param n maximal number of returned graphs.
#' @name EquivalentModels
NULL

#' @rdname EquivalentModels
#' @export
equivalenceClass <- function( x ){
	.graphTransformer( x, "dagToCpdag" )
}

#' @rdname EquivalentModels
#' @export
equivalentDAGs <- function( x, n=100 ){
	x <- as.dagitty(x)
	xv <- .getJSVar()
	r <- NULL
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("_.map(GraphTransformer.markovEquivalentDags(global.",
			xv,",",n,"),function(x){return x.toString()})") )
		r <- .jsget( xv )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv)})
	lapply( r, dagitty )
}

#' Moral Graph
#'
#' @param x the input graph.
#' 
#' @export
moralize <- function( x ){
	.graphTransformer( x, "moralGraph" )
}

#' Back-Door Graph
#'
#' @param x the input graph.
#' 
#' @export
backDoorGraph <- function( x ){
	.graphTransformer( x, "backDoorGraph" )
}

#' Ancestor Graph
#'
#' Creates the induced subgraph containing only the vertices
#' in \code{v}, their ancestors, and the edges between them. All
#' other vertices and edges are discarded.
#'
#' @param x the input graph.
#' @param v variable names.
#' 
#' @export
ancestorGraph <- function( x, v=NULL ){
	x <- as.dagitty(x)
	if( is.null(v) ){
		v <- c(exposures(x),outcomes(x),adjustedNodes(x))
	}
	xv <- .getJSVar()
	xv2 <- .getJSVar()
	r <- NULL
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv2, v )
		.jsassign( xv2, .jsp("DagittyR.getVertices(global.",xv,",global.",xv2,")") )
		.jsassign( xv, .jsp("GraphTransformer.ancestorGraph(global.",xv,",global.",xv2,")") )
		r <- .jsgetgraph( xv )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv);.deleteJSVar(xv2)})
	r
}

#' Variable Statuses
#'
#' Get or set variables with a given status in a graph. Variables in dagitty graphs can
#' have one of several statuses. Variables with _exposure_ and _outcome_ status are 
#' important when determining causal effects via the functions \code{\link{adjustmentSets}}
#' and \code{\link{instrumentalVariables}}. Variables with status _latent_ are assumed 
#' to be unobserved variables or latent constructs, and they are not considered when deriving
#' testable implications of a graph via the functions 
#' \code{\link{impliedConditionalIndependencies}} or \code{\link{vanishingTetrads}}.
#'
#' \code{setVariableStatus} first removes the given status from all variables in the graph
#' that had it, and then gives it to the given variables.
#' For instance, if  \code{status="exposure"}  and \code{value="X"} are given, then
#' \code{X} will be the only exposure in the resulting graph.
#'
#' @param x the input graph.
#' @param value character vector; names of variables to receive the given status.
#' @param status character, one of "exposure", "outcome" or "latent".
#'
#' @name VariableStatus
#'
NULL

#' @rdname VariableStatus
#' @export
exposures <- function( x ){
	.nodesWithProperty( x, "source" )
}
#' @rdname VariableStatus
#' @export
'exposures<-' <- function( x, value ){
	setVariableStatus(x, "exposure", value )
}

#' @rdname VariableStatus
#' @export
outcomes <- function( x ){
	.nodesWithProperty( x, "target" )
}
#' @rdname VariableStatus
#' @export
'outcomes<-' <- function( x, value ){
	setVariableStatus(x, "outcome", value )
}

#' @rdname VariableStatus
#' @export
latents <- function( x ){
	.nodesWithProperty( x, "latentNode" )
}
#' @rdname VariableStatus
#' @export
'latents<-' <- function( x, value ){
	setVariableStatus(x, "latent", value )
}

#' @rdname VariableStatus
#' @export
adjustedNodes <- function( x ){
	.nodesWithProperty( x, "adjustedNode" )
}
#' @rdname VariableStatus
#' @export
'adjustedNodes<-' <- function( x, value ){
	setVariableStatus(x, "adjustedNode", value )
}


#' @rdname VariableStatus
#' @export
setVariableStatus <- function( x, status, value ) {
	allowed.statuses <-  c("exposure","outcome","latent","adjustedNode")
	if( !(status %in% allowed.statuses) ){
		stop( "Status must be one of: ", paste(allowed.statuses,collapse=", ") )
	}
	
	xv <- .getJSVar()
	vv <- .getJSVar()
	tryCatch({
		.jsassign( xv, as.character(x) )
		.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,")") )
		if( status == "exposure" ){
			jsstatname <- "Source"
		} else if (status == "outcome" ){
			jsstatname <- "Target"
		} else if (status == "latent" ){
			jsstatname <- "LatentNode"
		} else if (status == "adjustedNode" ){
			jsstatname <- "AdjustedNode"
		}
		.jseval( paste0( "global.",xv,".removeAll",jsstatname,"s()" ) )
		for( n in value ){
			.jsassign( vv, n )
			.jseval( paste0( "global.",xv,".add",jsstatname,"(global.",vv,")" ) )
		}
		
		r <- .jsget( paste0( xv,".toString()" ) )
	},finally={ 
		.deleteJSVar(vv)
		.deleteJSVar(xv)
	})
	structure(r,class="dagitty")
}

#' Names of Variables in Graph
#' @param x the input graph.
#' @export
#' @examples
#' ## A "DAG" with Greek and Portuguese variable names. These can be
#' ## input using quotes to overcome the limitations on unquoted identifiers.
#' g <- dagitty( 'digraph {
#'   "coração" [pos="0.297,0.502"]
#'   "inimă" [pos="0.482,0.387"]
#'   "coração" -> "inimă"
#' }' )
#' names( g )
names.dagitty <- function( x ){
	ct <- .getJSContext()
	xv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("global.",xv,".vertices.keys()") )
		r <- .jsget(xv)},
	finally={.deleteJSVar(xv)})
	r
}

#' Plot Coordinates of Variables in Graph
#'
#' The DAGitty syntax allows specification of plot coordinates for each variable in a 
#' graph. This function extracts these plot coordinates from the graph description in a
#' \code{dagitty} object. Note that the coordinate system is undefined, typically one 
#' needs to compute the bounding box before plotting the graph.
#'
#' @param x the input graph.
#' @param value a list with components \code{x} and \code{y}, 
#' giving relative coordinates for each variable. This format is suitable 
#' for \code{\link{xy.coords}}.
#' 
#' @examples
#' ## Plot localization of each node in the Shrier example
#' plot( coordinates( getExample("Shrier") ) )
#' 
#' ## Define a graph and set coordinates afterwards
#' x <- dagitty('graph{
#'     G <-> H <-> I <-> G
#'     D <- B -> C -> I <- F <- B <- A
#'     H <- E <- C -> G <- D
#' }')
#' coordinates( x ) <-
#'     list( x=c(A=1, B=2, D=3, C=3, F=3, E=4, G=5, H=5, I=5),
#'         y=c(A=0, B=0, D=1, C=0, F=-1, E=0, G=1, H=0, I=-1) )
#' plot( x )
#'
#' @seealso
#' Function \link{graphLayout} for automtically generating layout coordinates, and function
#' \link{plot.dagitty} for plotting graphs.
#'
#' @export
coordinates <- function( x ){
	ct <- .getJSContext()
	xv <- .getJSVar()
	yv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("global.",xv,".getVertices()") )
		.jsassign( yv, .jsp("_.pluck(global.",xv,",'id')") )
		labels <- .jsget(yv)
		.jsassign( yv, .jsp("_.pluck(global.",xv,",'layout_pos_x')") )
		rx <- .jsget(yv)
		.jsassign( yv, .jsp("_.pluck(global.",xv,",'layout_pos_y')") )
		ry <- .jsget(yv)},
	finally={
		.deleteJSVar(xv)
		.deleteJSVar(yv)
	})
	names(rx) <- labels
	names(ry) <- labels
	list( x=rx, y=ry ) 
}

#' @rdname coordinates
#' @export
'coordinates<-' <- function( x, value ){
	xv <- .getJSVar()
	xv2 <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		for( n in intersect( names(value$x), names(x) ) ){
			.jsassign( xv2, as.character(n) )
			.jseval(.jsp("global.",xv,".vertices.get(",xv2,").layout_pos_x=",
				as.numeric(value$x[n])))
			.jseval(.jsp("global.",xv,".vertices.get(",xv2,").layout_pos_y=",
				as.numeric(value$y[n])))
		}
		.jsassign( xv, .jsp("global.",xv,".toString()") )
		r <- .jsget( xv )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv);.deleteJSVar(xv2)})
	structure(r,class="dagitty")
}

#' Canonicalize an Ancestral Graph
#'
#' Takes an input ancestral graph (a graph with directed, bidirected and undirected
#' edges) and converts it to a DAG by replacing every bidirected edge x <-> y with a 
#' substructure x <- L -> y, where L is a latent variable, and every undirected edge
#' x -- y with a substructure x -> S <- y, where S is a selection variable. This function
#' does not check whether the input is actually an ancestral graph.
#' 
#' @param x the input graph.
#' @return A list containing the following components:
#' \itemize{
#'  \item{g}{The resulting graph.}
#'  \item{L}{Names of newly inserted latent variables.}
#'  \item{S}{Names of newly inserted selection variables.}
#' } 
#' 
#' @export
canonicalize <- function( x ){
	x <- as.dagitty(x)
	xv <- .getJSVar()
	xv2 <- .getJSVar()
	r <- NULL
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("GraphTransformer.canonicalDag(global.",xv,")") )
		.jsassign( xv2, .jsp("global.",xv,".g.toString()") )
		g <- .jsget( xv2 )
		.jsassign( xv2, .jsp("_.pluck(",xv,".L,'id')") )
		L <- .jsget( xv2 )
		.jsassign( xv2, .jsp("_.pluck(",xv,".S,'id')") )
		S <- .jsget( xv2 )	
		r <- list( g=structure(g,class="dagitty"), L=L, S=S )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv);.deleteJSVar(xv2)})
	r
}

#' Graph Edges
#' 
#' Extracts edge information from the input graph. 
#'
#' @param x the input graph.
#' @return a data frame with the following variables:
#' \itemize{
#'  \item{v}{ name of the start node.}
#'  \item{w}{ name of the end node. For symmetric edges (bidirected and undirected), the
#'  order of start and end node is arbitrary.}
#'  \item{e}{ type of edge. Can be one of \code{"->"}, \code{"<->"} and \code{"--"}.}
#'  \item{x}{ X coordinate for a control point. If this is not \code{NA}, then the edge
#'  is drawn as an \code{\link{xspline}} through the start point, this control point, 
#'  and the end point. This is especially important for cases where there is more than
#'  one edge between two variables (for instance, both a directed and a bidirected edge).}
#'  \item{y}{ Y coordinate for a control point.}
#' }
#'
#' @examples
#' ## Which kinds of edges are used in the Shrier example?
#' levels( edges( getExample("Shrier") )$e )
#' @export 
edges <- function( x ){
	x <- as.dagitty( x )
	xv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("DagittyR.edge2r(global.",xv,")") )
		r <- .jsget(xv)
	}, finally={.deleteJSVar(xv)})
	as.data.frame(r)
}

#' Test for Graph Class
#' 
#' A function to check whether an object has class \code{dagitty}.
#'
#' @param x object to be tested.
#' 
#' @export
is.dagitty <- function(x) inherits(x,"dagitty")

#' Generate Graph Layout
#'
#' This function generates plot coordinates for each variable in a graph that does not
#' have them already. To this end, the well-known \dQuote{Spring} layout algorithm is
#' used. Note that this is a stochastic algorithm, so the generated layout will be 
#' different every time (which also means that you can try several times until you find
#' a decent layout).
#' 
#' @param x the input graph.
#' @param method the layout method; currently, only \code{"spring"} is supported.
#' @return the same graph as \code{x} but with layout coordinates added. 
#' 
#' @examples
#' ## Generate a layout for the M-bias graph and plot it
#' plot( graphLayout( dagitty( "graph { X <- U1 -> M <- U2 -> Y } " ) ) )
#'
#' @export
graphLayout <- function( x, method="spring" ){
	x <- as.dagitty( x )
	if( !(method %in% c("spring")) ){
		stop("Layout method ",method," not supported!")
	}
	xv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jseval( paste0("(new GraphLayouter.Spring(global.",xv,")).layout()") )
		.jsassign( xv, .jsp("global.",xv,".toString()") )
		r <- .jsget(xv)
	}, finally={.deleteJSVar(xv)})
	structure( r, class="dagitty" )
}

#' Plot Graph
#'
#' A simple plot method to quickly visualize a graph. This is intended mainly for 
#' validation purposes and is not meant to become a full-fledged graph drawing
#' function.
#'
#' @param x the input graph.
#' @param ... not used.
#'
#' @export
plot.dagitty <- function( x, ... ){	
	x <- as.dagitty( x )
	coords <- coordinates( x )
	labels <- names(coords$x)
	plot.new()
	par(new=TRUE,mar=rep(0,4))
	wx <- sapply( paste0("mm",labels), 
		function(s) strwidth(s,units="inches") )
	wy <- sapply( paste0("\n",labels), 
		function(s) strheight(s,units="inches") )
	ppi.x <- dev.size("in")[1] / (max(coords$x)-min(coords$x))
	ppi.y <- dev.size("in")[2] / (max(coords$y)-min(coords$y))
	wx <- wx/ppi.x
	wy <- wy/ppi.y
	xlim <- c(min(coords$x-wx/2),max(coords$x+wx/2))
	ylim <- c(-max(coords$y+wy/2),-min(coords$y-wy/2))
	plot( NA, xlim=xlim, ylim=ylim, xlab="", ylab="", bty="n",
		xaxt="n", yaxt="n" )
	wx <- sapply( labels, 
		function(s) strwidth(paste0("xx",s)) )
	wy <- sapply( labels,
		function(s) strheight(paste0("\n",s)) )
	asp <- par("pin")[1]/diff(par("usr")[1:2]) /
		(par("pin")[2]/diff(par("usr")[3:4]))
	ex <- edges(x)
	ax1 <- rep(0,nrow(ex))
	ax2 <- rep(0,nrow(ex))
	ay1 <- rep(0,nrow(ex))
	ay2 <- rep(0,nrow(ex))
	axc <- rep(0,nrow(ex))
	ayc <- rep(0,nrow(ex))
	acode <- rep(2,nrow(ex))
	has.control.point <- rep(FALSE,nrow(ex))
	for( i in seq_len(nrow(ex)) ){
		if( ex[i,3] == "<->" ){
			acode[i] <- 3
			has.control.point[i] <- TRUE
		}
		if( ex[i,3] == "--" ){
			acode[i] <- 0
		}
		l1 <- as.character(ex[i,1]); l2 <- as.character(ex[i,2])
		x1 <- coords$x[l1]; y1 <- coords$y[l1]
		x2 <- coords$x[l2]; y2 <- coords$y[l2]
		if( is.na( ex[i,4] ) || is.na( ex[i,5] ) ){
			cp <- .autoControlPoint( x1, y1, x2, y2, asp,
				.2*as.integer( acode[i]==3 ) )
		} else {
			cp <- list(x=ex[i,4],y=ex[i,5])
			has.control.point[i] <- TRUE
		}
		bi1 <- .lineSegBoxIntersect( x1-wx[l1]/2,y1-wy[l1]/2,
			x1+wx[l1]/2,y1+wy[l1]/2, x1, y1, cp$x, cp$y )
		bi2 <- .lineSegBoxIntersect( x2-wx[l2]/2,y2-wy[l2]/2,
			x2+wx[l2]/2,y2+wy[l2]/2, cp$x, cp$y, x2, y2 )
		if( length(bi1) == 2 ){
			x1 <- bi1$x; y1 <- bi1$y
		}
		if( length(bi2) == 2 ){
			x2 <- bi2$x; y2 <- bi2$y
		}
		ax1[i] <- x1; ax2[i] <- x2
		ay1[i] <- y1; ay2[i] <- y2
		axc[i] <- cp$x; ayc[i] <- cp$y
	}
	directed <- acode==2 & !has.control.point
	undirected <- acode==0 & !has.control.point
	arrows( ax1[directed], -ay1[directed], 
		ax2[directed], -ay2[directed], length=0.1, col="gray" )
	segments( ax1[undirected], -ay1[undirected], 
		ax2[undirected], -ay2[undirected], col="black", lwd=2 )
	for( i in which( has.control.point ) ){
		.arc( ax1[i], -ay1[i], 
			ax2[i], -ay2[i], axc[i], -ayc[i], col="gray", 
			code=acode[i], length=0.1 )
	}
	text( coords$x, -coords$y[labels], labels )
}

#' Find Adjustment Sets to Estimate Causal Effects
#' @param x the input graph.
#' @param exposure name(s) of the exposure variable(s). If not given (default), then the 
#'  exposure variables are supposed to be defined in the graph itself.
#' @param outcome name(s) of the outcome variable(s), also taken from the graph if 
#' not given.
#' @param effect which effect is to be identified. If \code{effect="total"}, then the
#' total effect is to be identified, and the adjustment criterion by van der Zander et 
#' al (2014), an extension of Pearl's back-door criterion, is used. Otherwise, if 
#' \code{effect="direct"}, then the average direct effect is to be identified, and Pearl's
#' single-door criterion is used (Pearl, 2009). In a structural equation model (Gaussian
#' graphical model), direct effects are simply the path coefficients.
#' @export
adjustmentSets <- function( x, exposure=NULL, outcome=NULL, effect="total" ){
	x <- as.dagitty( x )

	if( !is.null( exposure ) ){
		exposures(x) <- exposure
	}
	if( !is.null( outcome ) ){
		outcomes(x) <- outcome
	}

	xv <- .getJSVar()
	tryCatch({
		.jsassign( xv, as.character(x) )
		.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,")") )
	
		if( effect=="direct" ){	
			.jsassign( xv, .jsp("GraphAnalyzer.listMsasDirectEffect(global.",xv,")") )
		} else {
			.jsassign( xv, .jsp("GraphAnalyzer.listMsasTotalEffect(global.",xv,")") )
		}
		.jsassign( xv, .jsp("DagittyR.adj2r(global.",xv,")"))
		r <- structure( .jsget(xv), class="dagitty.sets" )
	},finally={.deleteJSVar(xv)})

	r
}

#' List Conditional Indpendencies Implied by Graphical Model
#' @param x the input graph.
#' @param type can be one of "missing.edge" or "basis.set". With the former, one testable 
#' implication is returned per missing edge of the graph. With the latter, one testable
#' implication is returned per vertex of the graph that has non-descendants other than
#' its parents. Basis sets can be smaller, but they involve higher-dimensional independencies,
#' whereas missing edge sets involve only bivariate independencies.
#' @param max.results integer. The listing of conditional independencies is stopped once
#' this many results have been found. Use \code{Inf} to generate them all. This applies
#' only when \code{type="missing.edge"}. 
#' @export
impliedConditionalIndependencies <- function( x, type="missing.edge", max.results=100 ){
	if( ! type %in% c("missing.edge","basis.set") ){
		stop("'type' must be one of: missing.edge, basis.set")
	}
	x <- as.dagitty( x )

	xv <- .getJSVar()
	tryCatch({
		.jsassign( xv, as.character(x) )
		.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,")") )

		if( type == "missing.edge" ){
			if( is.finite( max.results ) ){
				.jsassign( xv, .jsp("GraphAnalyzer.listMinimalImplications(global.",xv,",",
					as.numeric(max.results),")"))
			} else {
				.jsassign( xv, .jsp("GraphAnalyzer.listMinimalImplications(global.",xv,")"))
			}
		} else {
			.jsassign( xv, .jsp("GraphAnalyzer.listBasisImplications(global.",xv,")"))
		}
		.jsassign( xv, .jsp("DagittyR.imp2r(global.",xv,")") )
		r  <- structure( lapply( .jsget(xv), 
				function(x) structure(x,class="dagitty.ci") ), class="dagitty.cis" )
	},finally={.deleteJSVar(xv)})
	r
}

#' Find (Conditional) Instrumental Variables to Estimate Causal Effects
#' @param x the input graph.
#' @param exposure name of the exposure variable. If not given (default), then the 
#'  exposure variable is supposed to be defined in the graph itself. Only a single exposure
#' variable is supported.
#' @param outcome name of the outcome variable, also taken from the graph if not given.
#' Only a single outcome variable is supported.
#' @export
instrumentalVariables <- function( x, exposure=NULL, outcome=NULL ){
	x <- as.dagitty( x )

	if( !is.null( exposure ) ){
		if( length( exposure ) > 1 ){
			stop("IV identification only supported for single exposures!")
		}
		x <- setVariableStatus( x, "exposure", exposure )
	}
	if( !is.null( outcome ) ){
		if( length( outcome ) > 1 ){
			stop("IV identification only supported for single outcomes!")
		}
		x <- setVariableStatus( x, "outcome", outcome )
	}

	xv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("GraphAnalyzer.conditionalInstruments(global.",xv,")") )
		.jsassign( xv, .jsp("DagittyR.iv2r(global.",xv,")") )
		r <- structure( .jsget(xv), class="dagitty.ivs" )
	}, finally={.deleteJSVar(xv)})
	r
}

#' List Vanishing Tetrads Implied by Gaussian Graphical Model
#' @param x the input graph.
#' @param type restrict output to one level of Kenny's tetrad typology.
#' Possible values are "within" (homogeneity within constructs; all four
#' variables have the same parents), "between" (homogeneity between constructs;
#' two pairs of variables each sharing one parent) 
#' and "epistemic" (consistency of epistemic correlations; three variables have
#' the same parent). By default, all tetrads are listed.
#' @return a data frame with four columns, where each row of the form
#' i,j,k,l means that the tetrad Cov(i,j)Cov(k,l) - Cov(i,k)Cov(j,l) vanishes
#' (is equal to 0) according to the model.
#' 
#' @export
vanishingTetrads <- function( x, type=NA ){
	x <- as.dagitty( x )

	xv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		if( is.character( type ) ){
			.jsassign( xv, .jsp("GraphAnalyzer.vanishingTetrads(global.",
				xv,",undefined,'",type,"')") )
		} else {
			.jsassign( xv, .jsp("GraphAnalyzer.vanishingTetrads(global.",
				xv,")") )
	
		}
		r <- .jsget(xv)
	}, finally={.deleteJSVar(xv)})

	r
}

#' Convert Lavaan Model to Dagitty Graph
#'
#' The \code{lavaan} package is a popular package for structural equation 
#' modeling. To provide interoperability with lavaan, this function 
#' converts models specified in lavaan syntax to dagitty graphs.
#'
#' @param x data frame, lavaan parameter table such as returned by 
#' \code{\link[lavaan]{lavaanify}}.
#' @param ... Not used.
#'
#' @examples
#' if( require(lavaan) ){
#' mdl <- lavaanify("
#' X ~ C1 + C3
#' M ~ X + C3
#' Y ~ X + M + C3 + C5
#' C1 ~ C2
#' C3 ~ C2 + C4
#' C5 ~ C4
#' C1 ~~ C2 \n C1 ~~ C3 \n C1 ~~ C4 \n C1 ~~ C5
#' C2 ~~ C3 \n C2 ~~ C4 \n C2 ~~ C5
#' C3 ~~ C4 \n C3 ~~ C5",fixed.x=FALSE)
#' plot( graphLayout( as.dagitty( mdl ) ) ) 
#' }
#' @export
as.dagitty <- function( x, ... ) UseMethod("as.dagitty")

#' @export
as.dagitty.character <- function( x, ... ) dagitty( x )

#' @export
as.dagitty.default <- function( x, ... ){
	if( class(x) == "dagitty" ){
		x
	} else {
		stop("Cannot coerce object to class 'dagitty': ",x)
	}
}

#' @export
as.dagitty.data.frame <- function( x, ... ){
	latents <- c()
	arrows <- c()
	for( i in seq_len( nrow(x) ) ){
		if( x$op[i] == "=~" ){
			latents <- union(latents,x$lhs[i])
			arrows <- c(arrows,paste(x$lhs[i]," -> ",x$rhs[i]))
		}
		if( x$op[i] == "~" ){
			arrows <- c(arrows,paste(x$lhs[i]," <- ",x$rhs[i]))
		}
		if( x$op[i] == "~~" && (x$lhs[i] != x$rhs[i]) ){
			arrows <- c(arrows,paste(x$lhs[i]," <-> ",x$rhs[i]))
		}
	}
	if( length(latents) > 0 ){
		latents <- paste(latents,' [latent]',collapse="\n")
	} else {
		latents <- ""
	}
	dagitty( paste("graph { ",latents,"\n",
		paste(arrows,collapse="\n")," } ",collapse="\n") )
}

#' @export
toString.dagitty <- function( x, format="dagitty", ... ){
	x <- as.dagitty( x )
	if( !format %in% c("dagitty","tikz","lavaan","dagitty.old") ){
		stop( "Unsupported export format: ", format )
	}
	r <- NULL
	if( format == "dagitty" ){
		r <- as.character( x )
	} else if( format == "dagitty.old" ){
		xv <- .getJSVar()
		tryCatch({
			.jsassigngraph( xv, x )
			.jsassign( xv, .jsp("global.",xv,".oldToString()") )
			r <- as.character( .jsget(xv) )
		}, error=function(e){
			stop( e )
		},finally={.deleteJSVar(xv)})
	} else if( format %in% c("lavaan","tikz") ){
		xv <- .getJSVar()
		tryCatch({
			.jsassign( xv, as.character(x) )
			.jsassign( xv, .jsp("GraphSerializer.to",
				toupper(substring(format, 1,1)), substring(format, 2),
				"(GraphParser.parseGuess(global.",xv,"))") )
			r <- as.character( .jsget(xv) )
		}, error=function(e){
			stop( e )
		},finally={.deleteJSVar(xv)})
	}
	r
} 

#' Parse Dagitty Graph
#'
#' Constructs a \code{dagitty} graph object from a textual description. 
#'
#' @param x character, string describing a graphical model in dagitty syntax.
#' @export
dagitty <- function(x){
	if(!is.character(x)){
		stop("Expecting a string to build dagitty graph!")
	}
	xv <- .getJSVar()
	tryCatch({
		.jsassign( xv, as.character(x) )
		.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,").toString()") )
		r <- structure( .jsget(xv), class="dagitty" )
	}, error=function(e){
		stop( e )
	},finally={.deleteJSVar(xv)})
	structure( r, class="dagitty" )
}

#' Load Graph from dagitty.net
#'
#' @param x dagitty model URL.
#' @export
downloadGraph <- function(x="dagitty.net/mz-Tuw9"){
	if( !requireNamespace( "base64enc", quietly=TRUE ) ){
		stop("This function requires the package 'base64enc'!")
	}
	id <- gsub( "dagitty\\.net\\/m(.*)$", "\\1", x )
	r <- base64enc::base64decode(scan(paste0("http://dagitty.net/dags/load.php?id=",id),"character"))
	if( base64enc::checkUTF8(r) ){
		dagitty( rawToChar( r ) )
	} else {
		NULL
	}
}

#' Perform Local Tests of Structural Equation Model
#' @param x the model.
#' @param data matrix or data frame containing the data.
#' @param sample.cov the sample covariance matrix; ignored if \code{data} is supplied.
#' Either \code{data} or \code{sample.cov} and \code{sample.nobs} must be supplied.
#' @param sample.nobs number of observations; ignored if \code{data} is supplied.
#' @param type character indicating which kind of local
#'  test to perform. Supported values are \code{"cis"},
#'  \code{"tetrads"} and \code{"tetrads.type"}, where "type" is one of the items of the 
#'  tetrad typology, e.g. \code{"tetrads.within"} (see \code{\link{vanishingTetrads}}).
#' @param R how many bootstrap replicates for estimating confidence
#'   intervals. If \code{NULL}, then confidence intervals are based on normal
#'   approximation. For tetrads, the normal approximation is only valid in 
#'   large samples even if the data are normally distributed.
#' @param conf.level determines the size of confidence intervals for test
#'   statistics.
#' @export
localTests <- function(x, data=NULL, type="tetrads",
	sample.cov=NULL,sample.nobs=NULL,
	conf.level=.95,R=NULL){
	if( !is.null(sample.cov) && is.null(sample.nobs) ){
		stop("Please provide sample size (sample.nobs)!")
	}
	if( !is.null(R) && is.null(data) ){
		stop("Bootstrapping requires raw data!")
	}
	if( is.null(data) && is.null(sample.cov) ){
		stop("Please provide either data or sample covariance matrix!")
	}
	w <- (1-conf.level)/2
	if( type %in% c("tetrads","tetrads.within","tetrads.between","tetrads.epistemic") ){
		tets <- vanishingTetrads( x, strsplit(type,"\\.")[[1]][2] )
		if( length(tets) == 0 ){
			return(data.frame())
		}
		if( is.null( sample.cov ) ){
			sample.cov <- cov(data)
		}
		if( is.null( sample.nobs ) ){
			sample.nobs <- nrow(data)
		}
		tetrad.values <- .tetradsFromCov(sample.cov,tets)
		tetrad.sample.sds <- sapply(seq_len(nrow(tets)),
			function(i) .tetrad.sem(tets[i,],sample.cov,sample.nobs))
		r <- data.frame(
				row.names=apply( tets, 1, 
					function(x) paste(x,collapse=",") ),
				estimate=tetrad.values,
				std.error=tetrad.sample.sds,
				p.value=2*pnorm(abs(tetrad.values/tetrad.sample.sds),
					lower.tail=FALSE)
		)
		if( !is.null(R) ){
			requireNamespace("boot",quietly=TRUE)
			bo <- boot::boot( data,
				function(data,i) .tetradsFromData(data,tets,i), R )
			r <- cbind( r, t(apply( bo$t, 2,
				function(x) quantile(x,c((1-conf.level)/2,1-(1-conf.level)/2)) )) )
		} else {
			conf <- cbind( tetrad.values+qnorm(w)*tetrad.sample.sds,
				tetrad.values+qnorm(1-w)*tetrad.sample.sds )
				colnames(conf) <- c(paste0(100*w,"%"),paste0(100*(1-w),"%"))
			r <- cbind( r, conf )
		}
	} else if( type == "cis" ){
		if( !is.null(R) ){
			stop("Bootstrapping for conditional independence is not yet implemented.")
		}
		cis <- impliedConditionalIndependencies( x )
		if( length(cis) == 0 ){
			return(data.frame())
		}
		if( !is.null(data) ){
			r <- as.data.frame(
				row.names=sapply(cis,as.character),
				t(sapply( cis, function(i) 
					.ri.test(data,i,conf.level) ))
			)
		} else {
			r <- as.data.frame(
				row.names=sapply(cis,as.character),
				t(sapply( cis, function(i) 
					.ci.test.covmat(sample.cov,sample.nobs,i,conf.level) ))
			)
		}
	} else {
		stop("Local test type '",type,"' not supported!")
	}
	colnames(r) <- c("estimate","std.error","p.value",
		paste0(100*w,"%"),paste0(100*(1-w),"%"))
	return(r)
}

#' Plot Results of Local Tests
#'
#' Generates a summary plot of the results of local tests
#' (see \link{localTests}). For each test, a test statistic and
#' the confidence interval are shown.
#'
#' @param x data frame; results of the local tests as returned by 
#' \link{localTests}. 
#' @param xlab X axis label.
#' @param xlim numerical vector with 2 elements; range of X axis.
#' @param ... further arguments ot be passed on to \code{\link{plot}}.
#'
#' @export
plotLocalTestResults <- function(x,xlab="test statistic (95% CI)",
	xlim=c(min(x[,c(4,5)]),max(x[,c(4,5)])),...){
	y <- seq_len(nrow(x))
	plot( x[,1], y,xlab=xlab,xlim=xlim, yaxt="n", ylab="", ... )
	axis( 2, at=y, labels=rownames(x), las=1 )
	segments( x[,4], y, x[,5], y )
	#segments( seq_len(nrow(x))+.1, x[,1]-2*x[,2], 
	#	y1=x[,1]+2*x[,2], col=2 )
	abline( v=0 )
}

#' Show paths
#'
#' Returns a list with two compontents: \code{path} gives the actual
#' paths, and \code{open} shows whether each path is open (d-connected)
#' or closed (d-separated).
#'
#' @param x the input graph.
#' @param from name(s) of first variable(s). 
#' @param to name(s) of last variable(s). 
#' @param Z names of variables to condition on for determining open
#' paths.
#' @param limit maximum amount of paths to show. In general, the number of paths grows
#' exponentially with the number of variables in the graph, such that path inspection
#' is not useful except for the most simple models.
#' @param directed logical; should only directed (i.e., causal) paths 
#' be shown?
#'
#' @export
paths <- function(x,from=exposures(x),to=outcomes(x),Z=list(),limit=100,directed=FALSE){
	xv <- .getJSVar()
	xv2 <- .getJSVar()
	exposures(x) <- from
	outcomes(x) <- to
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv2, as.list(Z) )
		.jsassign( xv, .jsp("DagittyR.paths2r(GraphAnalyzer.listPaths(global.",
			xv,",",tolower(directed),",",limit,"),",xv2,",",
			xv,")" ) )
		r <- .jsget(xv)
	},finally={.deleteJSVar(xv);.deleteJSVar(xv2)})
	r
}

#' Adjustment Criterion
#' 
#' Test whether a set fulfills the adjustment criterion, that means,
#' it removes all confounding bias when estimating a *total* effect.
#' This is an extension of Pearl's 
#' Back-door criterion which is complete in the sense that either a set
#' fulfills this criterion, or it does not remove all confounding bias.
#'
#' @param x the input graph.
#' @param exposure name(s) of the exposure variable(s). If not given (default), then the 
#'  exposure variables are supposed to be defined in the graph itself.
#' @param outcome name(s) of the outcome variable(s), also taken from the graph if 
#' not given.
#' @param Z vector of variable names.
#'
#' @export
isAdjustmentSet <- function( x, Z, exposure=NULL, outcome=NULL ){
	xv <- .getJSVar()
	Zv <- .getJSVar()
	if( !is.null( exposure ) ){
		exposures(x) <- exposure
	}
	if( !is.null( outcome ) ){
		outcomes(x) <- outcome
	}
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( Zv, as.list(Z) )
		.jsassign( xv, .jsp("GraphAnalyzer.isAdjustmentSet(",xv,",",Zv,")") )
		r <- .jsget(xv)
	},finally={
		.deleteJSVar(xv)
		.deleteJSVar(Zv)
	})
	r
}

#' d-Separation
#'
#' @param x the input graph.
#' @param X vector of variable names.
#' @param Y vector of variable names.
#' @param Z vector of variable names.
#'
#' @export
dconnected <- function(x,X,Y=list(),Z=list()){
	xv <- .getJSVar()
	Xv <- .getJSVar()
	Yv <- .getJSVar()
	Zv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( Xv, as.list(X) )
		.jsassign( Yv, as.list(Y) )
		.jsassign( Zv, as.list(Z) )
		.jsassign( xv, .jsp("DagittyR.dconnected(",xv,",",Xv,",",Yv,",",Zv,")") )
		r <- .jsget(xv)
	},finally={
		.deleteJSVar(xv)
		.deleteJSVar(Xv)
		.deleteJSVar(Yv)
		.deleteJSVar(Zv)
	})
	r
}


#' @rdname dconnected
#' @export
dseparated <- function(x,X,Y=list(),Z=list()){
	if( length(Y) > 0 ){
		!dconnected(x,X,Y,Z)
	} else {
		setdiff(names(x),dconnected(x,X,Y,Z))
	}
}

#' Generate DAG at Random
#'
#' Generates a random DAG with N variables called x1,...,xN. For each
#' pair of variables xi,xj with i<j, an edge i->j will be present with
#' probability p. 
#' @param N desired number of variables.
#' @param p connectivity parameter, a number between 0 and 1.
#' @export
randomDAG <- function( N, p ){
	N <- as.integer(N)
	if( N < 1 ){
		stop("N must be positive!")
	}
	p <- as.double(p)
	if( p < 0 || p > 1 ){
		stop("p is not a probability!")
	}
	xv <- .getJSVar()
	pv <- .getJSVar()
	tryCatch({
	.jsassign( pv, p )
	.jsassign( xv, as.list(paste0("x",seq_len(N))) )
	.jsassign( xv, .jsp("GraphGenerator.randomDAG(",xv,",",pv,").toString()") )
	r <- .jsget(xv)
	},finally={
		.deleteJSVar(xv)
		.deleteJSVar(pv)
	})
	r
}

#' @export
print.dagitty.ivs <- function( x, prefix="", ... ){
	for( i in x ){
		cat( prefix, i$I )
		if( length( i$Z > 0 ) ){
			cat( " | ", paste(i$Z,collapse=", ") )
		}
		cat( "\n" )
	}
}

#' @export
print.dagitty.sets <- function( x, prefix="", ... ){
	for( i in x ){
		if( length(i) == 0 ){
			cat( prefix, "{}\n")
		} else {
			cat( prefix, "{",paste(i,collapse=", "), "}\n" )
		}
	}
}

#' @export
as.character.dagitty.ci <- function( x, ... ){
	r <- paste0( x$X, " _||_ ", paste(x$Y,collapse=", ") )
	if( length( x$Z > 0 ) ){
		r <- paste0( r, " | ", paste(x$Z,collapse=", ") )
	}
	r
}

#' @export
print.dagitty.ci <- function( x, ... ){
	cat( as.character( x ),"\n" )
}

#' @export
print.dagitty.cis <- function( x, ... ){
	for( i in seq_along(x) ){
		cat( as.character( x[[i]] ) )
		cat("\n")
	}
}

#' @export
as.list.dagitty.cis <- function( x, ... ) structure( x, class="list" )

#' @export
`[.dagitty.cis` <- function(x,y) structure(as.list(x)[y],class="dagitty.cis")


#' @export
as.list.dagitty.sets <- function( x, ... ) structure( x, class="list" )

#' @export
`[.dagitty.sets` <- function(x,y) structure(as.list(x)[y],class="dagitty.sets")

#' @export
as.list.dagitty.ivs <- function( x, ... ) structure( x, class="list" )

#' @export
`[.dagitty.ivs` <- function(x,y) structure(as.list(x)[y],class="dagitty.ivs")
