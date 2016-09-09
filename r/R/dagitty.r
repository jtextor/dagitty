#' @import V8 jsonlite
#' @importFrom boot boot
#' @importFrom MASS ginv
#' @importFrom grDevices dev.size
#' @importFrom methods is
#' @importFrom utils tail
#' @importFrom stats as.formula coef confint cov cor lm pnorm qnorm quantile runif loess sd
#' @importFrom graphics abline arrows axis lines par plot plot.new segments strheight strwidth text xspline
NULL

#' Get Graph Type
#'
#' @param x the input graph.
#' @examples
#' graphType( "mag{ x<-> y }" ) == "mag"
#' @export
#'
graphType <- function( x ){
	x <- as.dagitty( x )
	xv <- .getJSVar()
	r <- NULL
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("global.",
			xv,".getType()") )
		r <- .jsget( xv )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv)})
	r
}
'graphType<-' <- function( x, value=c("dag","mag","pdag","pag") ){
	value <- match.arg(value)
	x <- as.dagitty( x )
	xv <- .getJSVar()
	r <- NULL
	tryCatch({
		.jsassigngraph( xv, x )
		.jseval( paste0("global.",xv,".setType('",value,"')") )
		r <- .jsgetgraph( xv )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv)})
	r
}

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
#' @examples
#' g <- getExample("Shrier")
#' plot(g)
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
#' coefficients, and simulates data from the model. This is a very bare-bones 
#' function and probably not very useful 
#' except for quick validation purposes (e.g. checking that an implied vanishing 
#' tetrad truly vanishes in simulated data). For more elaborate simulation studies, please
#' use the lavaan package or similar facilities in other packages.
#'
#' @param x the input graph, a DAG (which may contain bidirected edges).
#' @param N number of samples to generate.
#' @param b.lower lower bound for random path coefficients, applied if \code{b.default=NULL}.
#' @param b.upper upper bound for path coefficients.
#' @param b.default default path coefficient applied to arrows for which no coefficient is 
#'  defined in the model syntax.
#' @param eps residual variance (only meaningful if \code{standardized=FALSE}).
#' @param empirical logical. If true, the empirical covariance matrix will be equal to the
#'  population covariance matrix.
#' @param standardized logical. If true, a standardized population covariance matrix
#'   is generated (all variables have variance 1).
#' @param verbose logical. If true, prints the generated population covariance matrix.
#' 
#' @return Returns a data frame containing \code{N} values for each variable in \code{x}.
#'
#' @details Data are generated in the following manner. 
#' Each directed arrow is assigned a path coefficient that can be given using the attribute
#' "beta" in the model syntax (see the examples). All coefficients not set in this manner are
#' set to the \code{b.default} argument, or if that is not given, are chosen uniformly
#' at random from the interval given by \code{b.lower} and \code{b.upper} (inclusive; set
#' both parameters to the same value for constant path coefficients). Each bidirected 
#' arrow a <-> b is replaced by a substructure  a <- L -> b, where L is an exogenous latent
#' variable. Path coefficients on such substructures are set to \code{sqrt(x)}, where 
#' \code{x} is again chosen at random from the given interval; if \code{x} is negative,
#' one path coefficient is set to \code{-sqrt(x)} and the other to \code{sqrt(x)}. All
#' residual variances are set to \code{eps}.
#'
#' If \code{standardized=TRUE}, all path coefficients are interpreted as standardized coefficients.
#' But not all standardized coefficients are compatible with all graph structures.
#' For instance, the graph structure z <- x -> y -> z is incompatible with standardized
#' coefficients of 0.9, since this would imply that the variance of z must be larger than
#' 1. For large graphs with many parallel paths, it can be very difficult to find coefficients 
#' that work.
#' 
#' 
#' @examples
#' ## Simulate data with pre-defined path coefficients of -.6
#' g <- dagitty('dag{z -> x [beta=-.6] x <- y [beta=-.6] }')
#' x <- simulateSEM( g ) 
#' cov(x)
#'
#' 
#' @export
simulateSEM <- function( x, b.default=NULL, b.lower=-.6, b.upper=.6, eps=1, N=500, standardized=TRUE,
	empirical=FALSE, verbose=FALSE ){
	if( !requireNamespace( "MASS", quietly=TRUE ) ){
		stop("This function requires the 'MASS' package!")
	}
	.supportsTypes( x, c("dag") )
	x <- as.dagitty( x )
	e <- .edgeAttributes( x, "beta" )
	e$a <- as.double(as.character(e$a))
	b.not.set <- is.na(e$a)
	if( is.null( b.default ) ){
		e$a[b.not.set] <- runif(sum(b.not.set),b.lower,b.upper)
	} else {
		e$a[b.not.set] <- b.default
	}
	ovars <- names(x)
	nV <- length(ovars)
	nL <- sum(e$e=="<->")
	if( nrow(e) > 0 ){
		vars <- paste0("v",ovars)
		if( nL > 0 ){
			lats <- paste0("l",seq_len(nL))
		} else {
			lats <- c()
		}
		Beta <- matrix( 0, nrow=nV+nL, ncol=nV+nL )
		rownames(Beta) <- colnames(Beta) <- c(vars,lats)
		cL <- 1
		for( i in seq_len( nrow(e) ) ){
			b <- e$a[i]
			if( e$e[i] == "<->" ){
				lV <- paste0("l",cL) 
				lb <- sqrt(abs(b))
				Beta[lV,paste0("v",e$v[i])] <- lb
				if( b < 0 ){
					Beta[lV,paste0("v",e$w[i])] <- -lb
				} else {
					Beta[lV,paste0("v",e$w[i])] <- lb
				}
				cL <- cL + 1
			} else if( e$e[i] == "->" ){
				Beta[paste0("v",e$v[i]),paste0("v",e$w[i])] <- b
			}
		}
		L <- (diag( 1, nV+nL ) - Beta)
		Li <- MASS::ginv( L )
		if( standardized == TRUE ){
			Phi <- MASS::ginv( t(Li)^2 ) %*% rep(eps,nrow(Beta))
			Phi <- diag( c(Phi), nV+nL )
		} else {
			Phi <- diag( eps, nV+nL )
		}
		Sigma <- t(Li) %*% Phi %*% Li
	} else {
		Sigma <- diag(1,nV+nL)
	}
	if( verbose ){
		print( Sigma )
	}
	r <- MASS::mvrnorm( N, rep(0,nV+nL), Sigma, empirical=empirical )[,1:nV]
	colnames(r) <- ovars
	r <- as.data.frame(r)
	r[,setdiff(ovars,latents(x))]
}

#' Ancestral Relations
#'
#' Retrieve the names of all variables in a given graph that are in the specified 
#' ancestral relationship to the input variable \code{v}.
#'
#' @param x the input graph, of any type.
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
#' @examples
#' g <- dagitty("graph{ a <-> x -> b ; c -- x <- d }")
#' descendants(g,"x")
#' parents(g,"x")
#' spouses(g,"x") 
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
#' 
#' @examples
#' orientPDAG( "pdag { x -> y -- z }" )
#' @export
#'
orientPDAG <- function( x ){
	.supportsTypes( x, "pdag" )
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
#' @examples
#' # How many equivalent DAGs are there for the sports DAG example?
#' g <- getExample("Shrier")
#' length(equivalentDAGs(g))
#' # Plot all equivalent DAGs
#' par( mfrow=c(2,3) )
#' lapply( equivalentDAGs(g), plot )
#' # How many edges can be reversed without changing the equivalence class?
#' sum(edges(equivalenceClass(g))$e == "--")
NULL

#' @rdname EquivalentModels
#' @export
equivalenceClass <- function( x ){
	x <- as.dagitty( x )
	.supportsTypes( x, "dag" )
	.graphTransformer( x, "dagToCpdag" )
}

#' @rdname EquivalentModels
#' @export
equivalentDAGs <- function( x, n=100 ){
	x <- as.dagitty(x)
	.supportsTypes( x, "dag" )
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
#' Graph obtained from \code{x} by (1) \dQuote{marrying} (inserting an undirected
#' ede between) all nodes that have common children, and then replacing all edges
#' by undirected edges. If \code{x} contains bidirected edges, then all sets of 
#' nodes connected by a path containing only bidirected edges are treated like a 
#' single node (see Examples).
#'
#' @param x the input graph, a DAG, MAG, or PDAG.
#'
#' @examples
#' # returns a complete graph
#' moralize( "dag{ x->m<-y }" )
#' # also returns a complete graph
#' moralize( "dag{ x -> m1 <-> m2 <-> m3 <-> m4 <- y }" )
#'
#' @export
moralize <- function( x ){
	.supportsTypes( x, c("dag","mag","pdag") )
	.graphTransformer( x, "moralGraph" )
}

#' Back-Door Graph
#'
#' Removes every first edge on a proper causal path from \code{x}.
#' If \code{x} is a MAG or PAG, then only \dQuote{visible} directed
#' edges are removed (Zhang, 2008).
#'
#' @param x the input graph, a DAG, MAG, PDAG, or PAG.
#'
#' @references
#' J. Zhang (2008), Causal Reasoning with Ancestral Graphs. 
#' \emph{Journal of Machine Learning Research} 9: 1437-1474.
#' 
#' @examples
#' g <- dagitty( "dag { x <-> m <-> y <- x }" )
#' backDoorGraph( g ) # x->y edge is removed
#' 
#' g <- dagitty( "mag { x <-> m <-> y <- x }" )
#' backDoorGraph( g ) # x->y edge is not removed
#' 
#' g <- dagitty( "mag { x <-> m <-> y <- x <- i }" )
#' backDoorGraph( g ) # x->y edge is removed
#' 
#' @export
backDoorGraph <- function( x ){
	x <- as.dagitty(x)
	.supportsTypes( x, c("dag","mag","pdag","pag") )
	.graphTransformer( x, "backDoorGraph" )
}

#' Ancestor Graph
#'
#' Creates the induced subgraph containing only the vertices
#' in \code{v}, their ancestors, and the edges between them. All
#' other vertices and edges are discarded.
#'
#' @param x the input graph, a DAG, MAG, or PDAG.
#' @param v variable names.
#'
#' @details If the input graph is a MAG or PDAG, then all *possible* ancestors
#' will be returned (see Examples).
#' 
#' @examples
#' g <- dagitty("dag{ z <- x -> y }")
#' ancestorGraph( g, "z" )
#'
#' g <- dagitty("pdag{ z -- x -> y }")
#' ancestorGraph( g, "y" ) # includes z
#' 
#' @export
ancestorGraph <- function( x, v=NULL ){
	x <- as.dagitty(x)
	.supportsTypes( x, c("dag","mag","pdag") )
	if( is.null(v) ){
		v <- c(exposures(x),outcomes(x),adjustedNodes(x))
	} else {
		v <- as.list(v)
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
#' have one of several statuses. Variables with status \emph{exposure} and 
#' \emph{outcome} are important when determining causal effects via the functions 
#' \code{\link{adjustmentSets}} and \code{\link{instrumentalVariables}}. Variables
#' with status \emph{latent} are assumed 
#' to be unobserved variables or latent constructs, which is respected when deriving
#' testable implications of a graph via the functions 
#' \code{\link{impliedConditionalIndependencies}} or \code{\link{vanishingTetrads}}.
#'
#' \code{setVariableStatus} first removes the given status from all variables in the graph
#' that had it, and then sets it on the given variables.
#' For instance, if  \code{status="exposure"}  and \code{value="X"} are given, then
#' \code{X} will be the only exposure in the resulting graph.
#'
#' @param x the input graph, of any type.
#' @param value character vector; names of variables to receive the given status.
#' @param status character, one of "exposure", "outcome" or "latent".
#'
#' @name VariableStatus
#'
#' @examples
#' g <- dagitty("dag{ x<->m<->y<-x }") # m-bias graph
#' exposures(g) <- "x"
#' outcomes(g) <- "y"
#' adjustmentSets(g)
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
#'
#' Extracts the variable names from an input graph. Useful for iterating
#' over all variables.
#'
#' @param x the input graph, of any type.
#' @export
#' @examples
#' ## A "DAG" with Romanian and Swedish variable names. These can be
#' ## input using quotes to overcome the limitations on unquoted identifiers.
#' g <- dagitty( 'digraph {
#'   "coração" [pos="0.297,0.502"]
#'   "hjärta" [pos="0.482,0.387"]
#'   "coração" -> "hjärta"
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

#' Retrieve Exogenous Variables 
#'
#' Returns the names of all variables that have no directed arrow pointing to them.
#' Note that this does not preclude variables connected to bidirected arrows.
#' 
#' @param x the input graph, of any type.
#' @export
exogenousVariables <- function( x ){
	x <- as.dagitty( x )
	e <- edges( x )
	setdiff( names(x), as.character( e$w[e$e=="->"] ) )
}

#' Plot Coordinates of Variables in Graph
#'
#' The DAGitty syntax allows specification of plot coordinates for each variable in a 
#' graph. This function extracts these plot coordinates from the graph description in a
#' \code{dagitty} object. Note that the coordinate system is undefined, typically one 
#' needs to compute the bounding box before plotting the graph.
#'
#' @param x the input graph, of any type.
#' @param value a list with components \code{x} and \code{y}, 
#' giving relative coordinates for each variable. This format is suitable 
#' for \code{\link{xy.coords}}.
#' 
#' @examples
#' ## Plot localization of each node in the Shrier example
#' plot( coordinates( getExample("Shrier") ) )
#' 
#' ## Define a graph and set coordinates afterwards
#' x <- dagitty('dag{
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
#' @param x the input graph, a DAG or MAG.
#' @return A list containing the following components:
#' \itemize{
#'  \item{g}{The resulting graph.}
#'  \item{L}{Names of newly inserted latent variables.}
#'  \item{S}{Names of newly inserted selection variables.}
#' } 
#' 
#' @examples
#' canonicalize("mag{x<->y--z}") # introduces two new variables
#' @export
canonicalize <- function( x ){
	x <- as.dagitty(x)
	.supportsTypes(x,c("dag","mag"))
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
#' @param x the input graph, of any type.
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
#' @param x the input graph, of any type.
#' @param method the layout method; currently, only \code{"spring"} is supported.
#' @return the same graph as \code{x} but with layout coordinates added. 
#' 
#' @examples
#' ## Generate a layout for the M-bias graph and plot it
#' plot( graphLayout( dagitty( "dag { X <- U1 -> M <- U2 -> Y } " ) ) )
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
#' simple visualization purposes and not as a full-fledged graph drawing
#' function.
#'
#' @param x the input graph, a DAG, MAG, or PDAG.
#' @param ... not used.
#'
#' @export
plot.dagitty <- function( x, ... ){	
	x <- as.dagitty( x )
	.supportsTypes(x,c("dag","mag","pdag"))
	coords <- coordinates( x )
        if( any( !is.finite( coords$x ) | !is.finite( coords$y ) ) ){
                stop("Please supply plot coordinates for graph! See ?coordinates and ?graphLayout.")
        }
	labels <- names(coords$x)
	par(mar=rep(0,4))
	plot.new()
	par(new=TRUE)
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
			ax2[i], -ay2[i], axc[i], -ayc[i], 
			col="gray", 
			code=acode[i], length=0.1, lwd=2 )
	}
	text( coords$x, -coords$y[labels], labels )
}

#' Covariate Adjustment Sets
#'
#' Enumerates sets of covariates that (asymptotically) allow unbiased estimation of causal
#' effects from observational data, assuming that the input causal graph is correct.  
#'
#' @param x the input graph, a DAG, MAG, PDAG, or PAG.
#' @param exposure name(s) of the exposure variable(s). If not given (default), then the 
#'  exposure variables are supposed to be defined in the graph itself.
#' @param outcome name(s) of the outcome variable(s), also taken from the graph if 
#' not given.
#' @param effect which effect is to be identified. If \code{effect="total"}, then the
#' total effect is to be identified, and the adjustment criterion by Perkovic et 
#' al (2015; see also van der Zander et al., 2014), 
#' an extension of Pearl's back-door criterion, is used. Otherwise, if 
#' \code{effect="direct"}, then the average direct effect is to be identified, and Pearl's
#' single-door criterion is used (Pearl, 2009). In a structural equation model (Gaussian
#' graphical model), direct effects are simply the path coefficients.
#' @param type which type of adjustment set(s) to compute. If \code{type="minimal"},
#' then only minimal sufficient adjustment sets are returned (default). For 
#' \code{type="all"}, all valid adjustment sets are returned. For \code{type="canonical"},
#' a single adjustment set is returned that consists of all (possible) ancestors
#' of exposures and outcomes, minus (possible) descendants of nodes on proper causal
#' paths. This canonical adjustment set is always valid if any valid set exists
#' at all.
#'
#' @details
#' If the input graph is a MAG or PAG, then it must not contain any undirected
#' edges (=hidden selection variables).
#'
#' @references
#' J. Pearl (2009), Causality: Models, Reasoning and Inference. 
#' Cambridge University Press.
#'
#' B. van der Zander, M. Liskiewicz and J. Textor (2014),
#' Constructing separators and adjustment sets in ancestral graphs.
#' In \emph{Proceedings of UAI 2014.}
#' 
#' E. Perkovic, J. Textor, M. Kalisch and M. H. Maathuis (2015), A
#' Complete Generalized Adjustment Criterion. In \emph{Proceedings of UAI
#' 2015.}
#' 
#' @examples
#' # The M-bias graph showing that adjustment for 
#' # pre-treatment covariates is not always valid
#' g <- dagitty( "dag{ x -> y ; x <-> m <-> y }" )
#' adjustmentSets( g, "x", "y" ) # empty set
#' # Generate data where true effect (=path coefficient) is .5
#' set.seed( 123 ); d <- simulateSEM( g, .5, .5 )
#' confint( lm( y ~ x, d ) )["x",] # includes .5
#' confint( lm( y ~ x + m, d ) )["x",] # does not include .5
#'
#' # Adjustment sets can also sometimes be computed for graphs in which not all 
#' # edge directions are known
#' g <- dagitty("pdag { x[e] y[o] a -- {i z b}; {a z i} -> x -> y <- {z b} }")
#' adjustmentSets( g )
#' @export
adjustmentSets <- function( x, exposure=NULL, outcome=NULL, 
	type=c("minimal","canonical","all"), effect=c("total","direct") ){
	effect <- match.arg( effect )
	type <- match.arg( type )
	if( effect == "direct" && type != "minimal" ){
		stop("Only minimal adjustment sets are supported for direct effects!")
	}
	x <- as.dagitty( x )
	.supportsTypes( x, c("dag","mag","pdag","pag") )
	if( !is.null( exposure ) ){
		exposures(x) <- exposure
	}
	if( !is.null( outcome ) ){
		outcomes(x) <- outcome
	}
	if( length(exposures(x)) == 0 || length(outcomes(x)) == 0 ){
		stop("Both exposure(s) and outcome(s) need to be set!")
	}

	if( type == "minimal" ){
		xv <- .getJSVar()
		tryCatch({
			.jsassigngraph( xv, x )
			if( effect=="direct" ){	
				.jsassign( xv, .jsp("GraphAnalyzer.listMsasDirectEffect(global.",xv,")") )
			} else {
				.jsassign( xv, .jsp("GraphAnalyzer.listMsasTotalEffect(global.",xv,")") )
			}
			.jsassign( xv, .jsp("DagittyR.adj2r(global.",xv,")"))
			r <- structure( .jsget(xv), class="dagitty.sets" )
		},finally={.deleteJSVar(xv)})
	} else if( type == "all" ){
		covariates <- setdiff( names( x ), c( exposures(x), outcomes(x) ) )
		subsets <- (expand.grid( rep( list(0:1),length(covariates)) ))
		r <- lapply( 1:nrow(subsets), function(i){
			Z <- covariates[as.logical(subsets[i,])]
			if( isAdjustmentSet( x, Z ) ){
				Z
		    	} else {
				NA
			}
		})
		non.r <- which(sapply(r,function(x) isTRUE(is.na(x))))
		if( length(non.r) > 0 ){
			r <- r[-non.r]
		} 
		r <- structure(r,class="dagitty.sets")
	} else { # type == "canonical"
		xv <- .getJSVar()
		tryCatch({
			.jsassigngraph( xv, x )
			.jsassign( xv, .jsp("DagittyR.canonicalAdjustment(global.",xv,")"))
			r <- structure(.jsget(xv),class="dagitty.sets")
		},finally={.deleteJSVar(xv)})
	}
	r
}

#' Adjustment Criterion
#' 
#' Test whether a set fulfills the adjustment criterion, that means,
#' it removes all confounding bias when estimating a *total* effect.
#' This is an extension of Pearl's 
#' Back-door criterion (Shpitser et al, 2010; van der Zander et al, 
#' 2014; Perkovic et al, 2015) 
#' which is complete in the sense that either a set
#' fulfills this criterion, or it does not remove all confounding bias.
#'
#' @param x the input graph, a DAG, MAG, PDAG, or PAG.
#' @param exposure name(s) of the exposure variable(s). If not given (default), then the 
#'  exposure variables are supposed to be defined in the graph itself.
#' @param outcome name(s) of the outcome variable(s), also taken from the graph if 
#' not given.
#' @param Z vector of variable names.
#'
#' @details
#' If the input graph is a MAG or PAG, then it must not contain any undirected
#' edges (=hidden selection variables).
#'
#' @references
#'
#' E. Perkovic, J. Textor, M. Kalisch and M. H. Maathuis (2015), A
#' Complete Generalized Adjustment Criterion. In \emph{Proceedings of UAI
#' 2015.}
#'
#' I. Shpitser, T. VanderWeele and J. M. Robins (2010), On the
#' validity of covariate adjustment for estimating causal effects. In
#' \emph{Proceedings of UAI 2010.}
#'
#' @export
isAdjustmentSet <- function( x, Z, exposure=NULL, outcome=NULL ){
	x <- as.dagitty( x )
	.supportsTypes( x, c("dag","mag","pdag","pag") )
	xv <- .getJSVar()
	Zv <- .getJSVar()
	if( !is.null( exposure ) ){
		exposures(x) <- exposure
	}
	if( !is.null( outcome ) ){
		outcomes(x) <- outcome
	}
	if( length(exposures(x)) == 0 || length(outcomes(x)) == 0 ){
		stop("Both exposure(s) and outcome(s) need to be set!")
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


#' List Implied Conditional Independencies
#'
#' Generates a list of conditional independence statements that must hold in every
#' probability distribution compatible with the given model.
#'
#' @param x the input graph, a DAG, MAG, or PDAG.
#' @param type can be one of "missing.edge" or "basis.set". With the former, one testable 
#' implication is returned per missing edge of the graph. With the latter, one testable
#' implication is returned per vertex of the graph that has non-descendants other than
#' its parents. Basis sets can be smaller, but they involve higher-dimensional independencies,
#' whereas missing edge sets involve only bivariate independencies.
#' @param max.results integer. The listing of conditional independencies is stopped once
#' this many results have been found. Use \code{Inf} to generate them all. This applies
#' only when \code{type="missing.edge"}.
#' @examples
#' g <- dagitty( "dag{ x -> m -> y }" )
#' impliedConditionalIndependencies( g ) # one
#' latents( g ) <- c("m")
#' impliedConditionalIndependencies( g ) # none
#' @export
impliedConditionalIndependencies <- function( x, type="missing.edge", max.results=Inf ){
	if( ! type %in% c("missing.edge","basis.set") ){
		stop("'type' must be one of: missing.edge, basis.set")
	}
	x <- as.dagitty( x )
	.supportsTypes( x, c("dag","mag","pdag") )

	xv <- .getJSVar()
	tryCatch({
		.jsassign( xv, as.character(x) )
		.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,")") )

		if( type == "missing.edge" ){
			if( is.finite( max.results ) ){
				.jsassign( xv,
					.jsp("GraphAnalyzer.listMinimalImplications(global.",xv,",",
					as.numeric(max.results),")"))
			} else {
				.jsassign( xv, 
					.jsp("GraphAnalyzer.listMinimalImplications(global.",xv,")"))
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

#' Find Instrumental Variables
#'
#' Generates a list of instrumental variables that can be used to infer the total effect
#' of an exposure on an outcome in the presence of latent confounding, under linearity
#' assumptions. 
#'
#' @param x the input graph, a DAG.
#' @param exposure name of the exposure variable. If not given (default), then the 
#' exposure variable is supposed to be defined in the graph itself. Only a single
#' exposure variable and a single outcome variable supported.
#' @param outcome name of the outcome variable, also taken from the graph if not given.
#' Only a single outcome variable is supported.
#'
#' @references
#' B. van der Zander, J. Textor and M. Liskiewicz (2015),
#' Efficiently Finding Conditional Instruments for Causal Inference.
#' In \emph{Proceedings of the 24th International Joint Conference on 
#' Artificial Intelligence (IJCAI 2015)}, pp. 3243-3249. AAAI Press, 2015.
#'
#' @examples
#' # The classic IV model
#' instrumentalVariables( "dag{ i->x->y; x<->y }", "x", "y" )
#' # A conditional instrumental variable
#' instrumentalVariables( "dag{ i->x->y; x<->y ; y<-z->i }", "x", "y" )
#' @export
instrumentalVariables <- function( x, exposure=NULL, outcome=NULL ){
	x <- as.dagitty( x )
	.supportsTypes( x, "dag" )

	if( !is.null( exposure ) ){
		exposures(x) <- exposure
	}
	if( !is.null( outcome ) ){
		outcomes(x) <- outcome
	}
	if( length(exposures(x)) != 1 || length(outcomes(x)) != 1 ){
		stop("Both exposure(s) and outcome(s) need to be set!")
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

#' List Implied Vanishing Tetrads
#'
#' Interpret the given graph as a structural equation model and list all the
#' vanishing tetrads that it implies.
#'
#' @param x the input graph, a DAG.
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
#' @examples
#' # Specify two-factor model with 4 indicators each
#' g <- dagitty("dag{{x1 x2 x3 x4} <- x <-> y -> {y1 y2 y3 y4}}")
#' latents(g) <- c("x","y")
#'
#' # Check how many tetrads are implied
#' nrow(vanishingTetrads(g))
#' # Check how these distribute across the typology
#' nrow(vanishingTetrads(g,"within"))
#' nrow(vanishingTetrads(g,"between"))
#' nrow(vanishingTetrads(g,"epistemic"))
#'
#' @references
#' Kenny, D. A. (1979), Correlation and Causality. Wiley, New York.
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


#' Convert Lavaan Model to DAGitty Graph
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
#' plot( graphLayout( lavaanToGraph( mdl ) ) )
#' }
#' @export
lavaanToGraph <- function( x, ... ){
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
	dagitty( paste("dag { ",latents,"\n",
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

#' Parse DAGitty Graph
#'
#' Constructs a \code{dagitty} graph object from a textual description. 
#'
#' @param x character, string describing a graphical model in dagitty syntax.
#' @param layout logical, whether to automatically generate layout coordinates for each
#' variable (see \code{\link{graphLayout}}) 
#' @details
#' The textual syntax for DAGitty graph is based on the dot language of the 
#' graphviz software (\url{http://www.graphviz.org/content/dot-language}). This is a
#' fairly intuitive syntax -- use the examples below and in the other functions to
#' get you started. An important difference to graphviz is that the DAGitty language
#' supports several types of graphs, which have different semantics. However, many users
#' will mainly focus on DAGs.
#'
#' A DAGitty graph description has the following form:
#'
#' \code{[graph type] '{' [statements] '}'}
#'
#' where \code{[graph type]} is one of 'dag', 'mag', 'pdag', or 'pag' and \code{[statements]}
#' is a list of variables statements and edge statements, which may (optionally) be
#' separated by semicolons. Whitespace, including newlines, has no semantic role.
#'
#' Variable statments look like
#'
#' \code{[variable id] '[' [properties] ']'}
#'
#' For example, the statement
#'
#' \code{x [exposure,pos="1,0"]}
#'
#' declares a variable with ID x that is an exposure variable and has a layout position
#' of 1,0.
#'
#' The edge statement
#'
#' \code{x -> y}
#'
#' declares a directed edge from variable x to variable y. Explicit variable statements
#' are not required for the variables involved in edge statements, unless attributes 
#' such as position or exposure/outcome status need to be set.
#'
#' DAGs (directed acyclic graphs) can contain the following edges: \code{->}, \code{<->}. 
#' Bidirected edges in DAGs are simply shorthands for substructures \code{<- U ->}, 
#' where U is an unobserved variable.
#'
#' MAGs (maximal ancestral graphs) can contain the following edges: \code{->},
#' \code{<->}, \code{--}. 
#' The bidirected and directed edges of MAGs can represent latent confounders, and 
#' the undirected edges represent latent selection variables. 
#' For details, see Richardson and Spirtes (2002).
#'
#' PDAGs (partially directed acyclic graphs) can contain the following edges: \code{->},
#' \code{<->}, \code{--}. 
#' The bidirected edges mean the same thing as in DAGs. The undirected edges represent
#' edges whose direction is not known. Thus, PDAGs are used to represent equivalence
#' classes of DAGs (see also the function \code{\link{equivalenceClass}}).
#'
#' PAGs (partial ancestral graphs) are to MAGs what PDAGs are to DAGs: they represent
#' equivalence classes of MAGs. MAGs can contain the following edges: \code{@-@}, 
#' \code{->}, \code{@->}, \code{--}, \code{@--}
#' (the @ symbols are written as circle marks in most of the literature). For
#' details on PAGs, see Zhang et al (2008). For now, only a few DAGitty functions
#' support PAGs (for instance, \code{\link{adjustmentSets}}.
#'
#' The DAGitty parser does not perform semantic validation. That is, 
#' it will not check whether a DAG is actually acyclic, or whether all chain components
#' in a PAG are actually chordal. This is not done because it can be computationally
#' rather expensive.
#'
#' @references
#' Richardson, Thomas; Spirtes, Peter (2002), Ancestral graph Markov models.
#' \emph{The Annals of Statistics} 30(4): 962-1030.
#'
#' J. Zhang (2008), Causal Reasoning with Ancestral Graphs. 
#' \emph{Journal of Machine Learning Research} 9: 1437-1474.
#'
#' B. van der Zander and M. Liskiewicz (2016), 
#' Separators and Adjustment Sets in Markov Equivalent DAGs.
#' In \emph{Proceedings of the Thirtieth AAAI Conference on Artificial Intelligence (AAAI'16)}, 
#' Phoenix, Arizona, USA.
#' @examples
#' # Specify a simple DAG containing one path
#' g <- dagitty("dag{ 
#'   a -> b ;
#'   b -> c ;
#'   d -> c
#'  }")
#' # Newlines and semicolons are optional
#' g <- dagitty("dag{ 
#'   a -> b b -> c c -> d
#'  }")
#' # Paths can be specified in one go; the semicolon below is
#' # optional
#' g <- dagitty("dag{ 
#'   a -> b ->c ; c -> d
#'  }")
#' # Edges can be written in reverse notation
#' g <- dagitty("dag{ 
#'   a -> b -> c <- d
#'  }")
#' # Spaces are optional as well
#' g <- dagitty("dag{a->b->c<-d}")
#' # Variable attributes can be set in square brackets
#' # Example: DAG with one exposure, one outcome, and one unobserved variable
#' g <- dagitty("dag{
#'   x -> y ; x <- z -> y
#'   x [exposure]
#'   y [outcome]
#'   z [unobserved]
#' }") 
#' # The same graph as above
#' g <- dagitty("dag{x[e]y[o]z[u]x<-z->y<-x}")
#' # A two-factor latent variable model
#' g <- dagitty("dag {
#'   X <-> Y
#'   X -> a X -> b X -> c X -> d
#'   Y -> a Y -> b Y -> c Y -> d
#' }")
#' # Curly braces can be used to "group" variables and 
#' # specify edges to whole groups of variables
#' # The same two-factor model
#' g <- dagitty("dag{ {X<->Y} -> {a b c d} }")
#' # A MAG
#' g <- dagitty("mag{ a -- x -> y <-> z }")
#' # A PDAG
#' g <- dagitty("pdag{ x -- y -- z }")
#' # A PAG
#' g <- dagitty("pag{ x @-@ y @-@ z }")  
#' @export
dagitty <- function(x, layout=FALSE){
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
	r <- structure( r, class="dagitty" )
	if( layout ){
		r <- graphLayout(r)
	}
	r
}

#' Load Graph from dagitty.net
#'
#' Downloads a graph that has been built and stored online using the dagitty.net GUI.
#' Users who store graphs online will receive a unique URL for their graph, which
#' can be fed into this function to continue working with the graph in R.
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

#' Test Graph against Data
#'
#' Derives testable implications from the given graphical model and tests them against
#' the given dataset.
#'
#' @param x the input graph, a DAG, MAG, or PDAG.
#' @param tests optional list of the precise tests to perform. If not given, the list
#'  of tests is automatically derived from the input graph. Can be used to restrict 
#'  testing to only a certain subset of tests (for instance, to test only those conditional
#'  independencies for which the conditioning set is of a reasonably low dimension, such
#'  as shown in the example). 
#' @param data matrix or data frame containing the data.
#' @param sample.cov the sample covariance matrix; ignored if \code{data} is supplied.
#' Either \code{data} or \code{sample.cov} and \code{sample.nobs} must be supplied.
#' @param sample.nobs number of observations; ignored if \code{data} is supplied.
#' @param type character indicating which kind of local
#'  test to perform. Supported values are \code{"cis"} (linear conditional independence),
#'  \code{"cis.loess"} (conditional independence using loess regression), 
#'  \code{"tetrads"} and \code{"tetrads.type"}, where "type" is one of the items of the 
#'  tetrad typology, e.g. \code{"tetrads.within"} (see \code{\link{vanishingTetrads}}).
#'  Tetrad testing is only implemented for DAGs.
#' @param R how many bootstrap replicates for estimating confidence
#'   intervals. If \code{NULL}, then confidence intervals are based on normal
#'   approximation. For tetrads, the normal approximation is only valid in 
#'   large samples even if the data are normally distributed.
#' @param conf.level determines the size of confidence intervals for test
#'   statistics.
#' @param loess.pars list of parameter to be passed on to  \code{\link[stats]{loess}}
#'   (for \code{type="cis.loess"}), for example the smoothing range.
#'
#' @details Tetrad implications can only be derived if a Gaussian model (i.e., a linear
#' structural equation model) is postulated. Conditional independence implications (CI)
#' do not require this assumption. However, both Tetrad and CI implications are tested
#' parametrically: for Tetrads, Wishart's confidence interval formula is used, whereas
#' for CIs, a Z test of zero conditional covariance (if the covariance
#' matrix is given) or a test of residual independence after linear regression
#' (it the raw data is given) is performed.
#' Both tetrad and CI tests also support bootstrapping instead of estimating parametric
#' confidence intervals.
#' 
#' @examples
#' # Simulate full mediation model with measurement error of M1
#' set.seed(123)
#' d <- simulateSEM("dag{X->{U1 M2}->Y U1->M1}",.6,.6)
#' 
#' # Postulate and test full mediation model without measurement error
#' plotLocalTestResults(localTests( "dag{ X -> {M1 M2} -> Y }", d, "cis" ))
#'
#' # Simulate data from example SEM
#' g <- getExample("Polzer")
#' d <- simulateSEM(g,.1,.1)
#' 
#' # Compute independencies with at most 3 conditioning variables
#' imp <- Filter(function(x) length(x$Z)<4, impliedConditionalIndependencies(g))
#' plotLocalTestResults(localTests( g, d, "cis.loess", R=100, tests=imp, loess.pars=list(span=0.6) ))
#'
#' @export
localTests <- function(x, data=NULL, 
	type=c("cis","cis.loess","tetrads","tetrads.within","tetrads.between","tetrads.epistemic"),
	tests=NULL,
	sample.cov=NULL,sample.nobs=NULL,
	conf.level=.95,R=NULL,loess.pars=NULL){
	x <- as.dagitty(x)
	type <- match.arg(type)
	if( type=="cis" ){
		.supportsTypes(x,c("dag","pdag","mag"))
	} else {
		.supportsTypes(x,c("dag"))
	}
	if( !is.null(sample.cov) && is.null(sample.nobs) ){
		stop("Please provide sample size (sample.nobs)!")
	}
	if( !is.null(R) && is.null(data) ){
		stop("Bootstrapping requires raw data!")
	}
	if( is.null(R) && type=="cis.loess" ){
		stop("Non-parametric conditional independence testing requires bootstrapping! Please provide R argument.")
	}
	if( is.null(data) && is.null(sample.cov) ){
		stop("Please provide either data or sample covariance matrix!")
	}
	w <- (1-conf.level)/2
	if( type %in% c("tetrads","tetrads.within","tetrads.between","tetrads.epistemic") ){
		if( is.null( tests ) ){
			if( type == "tetrads" ){
				tests <- vanishingTetrads( x )
			} else {
				tests <- vanishingTetrads( x, strsplit(type,"\\.")[[1]][2] )
			}
		}
		if( length(tests) == 0 ){
			return(data.frame())
		}
		if( is.null( sample.cov ) ){
			sample.cov <- cov(data)
		}
		if( is.null( sample.nobs ) ){
			sample.nobs <- nrow(data)
		}
		tetrad.values <- .tetradsFromCov(sample.cov,tests)
		tetrad.sample.sds <- sapply(seq_len(nrow(tests)),
			function(i) .tetrad.sem(tests[i,],sample.cov,sample.nobs))
		r <- data.frame(
				row.names=apply( tests, 1, 
					function(x) paste(x,collapse=",") ),
				estimate=tetrad.values
		)
		if( !is.null(R) ){
			requireNamespace("boot",quietly=TRUE)
			bo <- boot::boot( data,
				function(data,i) .tetradsFromData(data,tests,i), R )
			r <- cbind( r, t(apply( bo$t, 2,
				function(x) c(sd(x), quantile(x,c((1-conf.level)/2,1-(1-conf.level)/2))) )) )
			colnames(r) <- c("estimate","std.error",
				paste0(100*w,"%"),paste0(100*(1-w),"%"))
		} else {
			std.errors <- tetrad.sample.sds
			p.values <- 2*pnorm(abs(tetrad.values/tetrad.sample.sds),
				lower.tail=FALSE)
			conf <- cbind( std.errors, p.values, tetrad.values+qnorm(w)*tetrad.sample.sds,
				tetrad.values+qnorm(1-w)*tetrad.sample.sds )
			r <- cbind( r, conf )
			colnames(r) <- c("estimate","std.error","p.value",
				paste0(100*w,"%"),paste0(100*(1-w),"%"))
		}
	} else if( type %in% c("cis","cis.loess") ){
		if( is.null(tests) ){
			tests <- impliedConditionalIndependencies( x )
		}
		if( length(tests) == 0 ){
			return(data.frame())
		}
		row.names <- sapply(tests,as.character)
		if( !is.null(R) ){
			if( type == "cis" ){
				f <- function(i) .ci.test.lm.perm(data,i,conf.level,R)
			} else {
				f <- function(i) .ci.test.loess.perm(data,i,conf.level,R,loess.pars)
			}
			r <- as.data.frame(
				row.names=row.names,
				t(sapply( tests, f ))
			)
			colnames(r) <- c("estimate","std.error",
				paste0(100*w,"%"),paste0(100*(1-w),"%"))
		} else {
			if( !is.null(data) ){
				r <- as.data.frame(
					row.names=row.names,
					t(sapply( tests, function(i) 
						.ri.test(data,i,conf.level) ))
				)
			} else {
				r <- as.data.frame(
					row.names=row.names,
					t(sapply( tests, function(i) 
						.ci.test.covmat(sample.cov,sample.nobs,i,conf.level) ))
				)
			}
			colnames(r) <- c("estimate","std.error","p.value",
				paste0(100*w,"%"),paste0(100*(1-w),"%"))
		}
	}
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
#' @param axis.pars arguments to be passed on to \code{\link{axis}}
#'  when generating the Y axis for the plot.
#' @param sort.by.statistic logical. Sort the rows of \code{x} by
#'  the absolute value of the test statistic before plotting.
#' @param n plot only the n tests for which the absolute value of 
#'  the test statistics diverges most from 0.
#' @param ... further arguments to be passed on to \code{\link{plot}}.
#'
#' @examples
#' d <- simulateSEM("dag{X->{U1 M2}->Y U1->M1}",.6,.6)
#' par(mar=c(2,8,1,1)) # so we can see the test names
#' plotLocalTestResults(localTests( "dag{ X -> {M1 M2} -> Y }", d, "cis" ))
#'
#' @export
plotLocalTestResults <- function(x,xlab="test statistic (95% CI)",
	xlim=range(x[,c(ncol(x)-1,ncol(x))]),sort.by.statistic=TRUE,
	n=Inf,axis.pars=list(las=1),...){
	x <- x[order(abs(x[1]),decreasing=TRUE),]
	if( is.finite(n) && n > 0 && n < nrow(x) ){
		x <- x[1:n,]
	}
	y <- seq_len(nrow(x))
	plot( x[,1], y,xlab=xlab,xlim=xlim, yaxt="n", ylab="", ... )
	do.call( axis, c( list( 2, at=y, labels=rownames(x)), axis.pars ) )
	segments( x[,ncol(x)-1], y, x[,ncol(x)], y )
	#segments( seq_len(nrow(x))+.1, x[,1]-2*x[,2], 
	#	y1=x[,1]+2*x[,2], col=2 )
	abline( v=0 )
}

#' Show Paths
#'
#' Returns a list with two compontents: \code{path} gives the actual
#' paths, and \code{open} shows whether each path is open (d-connected)
#' or closed (d-separated).
#'
#' @param x the input graph, a DAG, PDAG, or MAG.
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
#' @examples
#' sum( paths(backDoorGraph(getExample("Shrier")))$open ) # Any open Back-Door paths?
#'
#' @export
paths <- function(x,from=exposures(x),to=outcomes(x),Z=list(),limit=100,directed=FALSE){
	x <- as.dagitty(x)
	.supportsTypes(x,c("dag","mag","pdag"))
	xv <- .getJSVar()
	xv2 <- .getJSVar()
	exposures(x) <- from
	outcomes(x) <- to
	if( length(exposures(x)) == 0 || length(outcomes(x)) == 0 ){
		stop("Both start end end node(s) need to be set!")
	}
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

#' d-Separation
#'
#' A set Z d-separates a path p if (1) Z contains a non-collider
#' on p, e.g. x->m->y with \code{Z=c("m")}; or (2) some collider on p is not
#' on Z, e.g. x->m<-y with \code{Z=c()}.
#'
#' @param x the input graph, a DAG, PDAG, or MAG.
#' @param X vector of variable names.
#' @param Y vector of variable names.
#' @param Z vector of variable names.
#'
#' \code{dseparated(x,X,Y,Z)} checks if all paths between X and Y are 
#' d-separated by Z.
#'
#' \code{dconnected(x,X,Y,Z)} checks if at least one path between X and Y
#' is not d-separated by Z.
#'
#' @details
#' The functions also work for mixed graphs with directed, undirected,
#' and bidirected edges. The definition of a collider in such graphs
#' is: a node where two arrowheads collide, e.g. x<->m<-y but not
#' x->m--y.
#'
#' @examples
#' dconnected( "dag{x->m->y}", "x", "y", c() ) # TRUE
#' dconnected( "dag{x->m->y}", "x", "y", c("m") ) # FALSE
#' dseparated( "dag{x->m->y}", "x", "y", c() ) # TRUE
#' dseparated( "dag{x->m->y}", "x", "y", c("m") ) # FALSE
#' 
#' @export
dconnected <- function(x,X,Y=list(),Z=list()){
	x <- as.dagitty(x)
	.supportsTypes(x,c("dag","pdag","mag"))
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
#'
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

#' Convert to DAGitty object
#'
#' Converts its argument to a DAGitty object, if possible.
#'
#' @param x an object.
#' @param ... further arguments passed on to methods.
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

