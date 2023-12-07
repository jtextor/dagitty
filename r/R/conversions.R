#' Convert from DAGitty object to other graph types
#'
#' Converts its argument from a DAGitty object (or character string describing it)
#' to another package's format, if possible.
#'
#' @param x a \code{dagitty} object or a character string.
#' @param to destination format, currently one of "dagitty", "tikz", "lavaan", "bnlearn", "igraph", or "causaleffect".
#' @param ... further arguments passed on to methods (currently unused)
#' @export
convert <- function( x, to, ... ) UseMethod("convert")

#' @export
convert.character <- function( x, to, ... ){
	convert( dagitty( x ), to, ... )
}

#' @export
convert.dagitty <- function( x, to, ... ){
	to <- match.arg( to, 
		c("dagitty","tikz","lavaan","dagitty.old","bnlearn","singular","causaleffect","edgelist","igraph") )
	if( to %in% c("dagitty","tikz","lavaan","dagitty.old","bnlearn","singular","edgelist") ){
		return( toString( x, to ) )
	}
	if( to == "igraph" ){
		.supportsTypes( x, c("dag","mag","pdag") )
		if( !requireNamespace( "igraph", quietly=TRUE ) ){
			stop("This function requires the package 'igraph'!")
		}
		vv <- data.frame( name=names(x) )
		cc <- coordinates( x )
		if( any( !is.na(cc$x) ) ){
			vv[,"x"] <- cc$x
			vv[,"y"] <- cc$y
		}
		eps <- .vertexAttributes( x, "eps" )
		if( any( !is.na(eps$a) ) ){
			vv[,"eps"] <- eps$a
		}
		beta <- .edgeAttributes( x, "beta" )
		if( any( !is.na(beta$a) ) ){
			ee[,"beta"] <- beta$a
		}
		ge <- edges( x )
		ee <- data.frame( from=ge$v, to=ge$w, arrow.mode=ge$e )
		return( igraph::graph_from_data_frame( ee, directed=TRUE, vertices=vv ) )
	}
	if( to == "causaleffect" ){
		.supportsTypes( x, "dag" )
		if( !requireNamespace( "igraph", quietly=TRUE ) ){
			stop("This function requires the package 'igraph'!")
		}
		ge <- edges( x )
		ee <- character()
		i.bidirected <- c()
		for( i in seq_len( nrow(ge) ) ){
			if( ge[i,"e"] == "->" ){
				ee <- c( ee, ge[i,"v"], ge[i,"w"] )
			} else if( ge[i,"e"] == "<->" ){
				i.bidirected <- c(i.bidirected, length(ee)/2+1,length(ee)/2+2)
				ee <- c( ee, ge[i,"v"], ge[i,"w"], ge[i,"w"], ge[i,"v"] )
			}
		}
		g <- igraph::make_graph( ee, directed=TRUE, isolates=setdiff( names(x), ee ) )
		if( length(i.bidirected) > 0 ){
			g <- igraph::set.edge.attribute( g, "description", i.bidirected, "U" )
		}
		return( g )
	}
	NULL
}

#' @export
toString.dagitty <- function( x, format="dagitty", ... ){
	format <- match.arg( format, 
		c("dagitty","tikz","lavaan","dagitty.old","bnlearn","edgelist","singular") )
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
	} else if( format %in% c("lavaan","tikz","singular","edgelist","bnlearn") ){
		if( format %in% c("bnlearn","edgelist") ){
			.supportsTypes( x, "dag" )
			if( any( edges(x)[,"e"] == "<->" ) ){
				stop( paste0("Bidirected edges not supported in ",format,"!" ) )
			}
		} 
		xv <- .getJSVar()
		tryCatch({
			.jsassign( xv, as.character(x) )
			.jsassign( xv, .jsp("DAGitty.GraphSerializer.to",
				toupper(substring(format, 1,1)), substring(format, 2),
				"(DAGitty.GraphParser.parseGuess(global.",xv,"))") )
			r <- as.character( .jsget(xv) )
		}, error=function(e){
			stop( e )
		},finally={.deleteJSVar(xv)})
	}
	r
}


#' Convert Lavaan Model to DAGitty Graph
#'
#' The \code{lavaan} package is a popular package for structural equation 
#' modeling. To provide interoperability with lavaan, this function 
#' converts models specified in lavaan syntax to dagitty graphs.
#'
#' @param x data frame, lavaan parameter table such as returned by 
#' \code{\link[lavaan]{lavaanify}}. Can also be a \code{lavaan} object
#' or a lavaan model string.
#' @param digits number of significant digits to use when representing 
#' path coefficients, if any
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
#' plot( lavaanToGraph( mdl ) )
#' }
#' @export
lavaanToGraph <- function( x, digits=3, ... ){
	if( is(x,"lavaan") ){
		x <- lavaan::parTable(x)
	} else if( is.character(x) ) {
		x <- lavaan::lavaanify(lavaan::lavParseModelString(x))
		x$est <- x$ustart
	}
	if( "est" %in% colnames(x) ){
		bt <- function(i){
			paste(" [beta=",signif(x$est[i],digits),"]",sep="")
		}
	} else {
		bt <- function(i){ "" }
	}
	latents <- c()
	arrows <- c()
	for( i in seq_len( nrow(x) ) ){
		if( x$op[i] == "=~" ){
			latents <- union(latents,x$lhs[i])
			arrows <- c(arrows,paste(x$lhs[i]," -> ",x$rhs[i],bt(i)))
		}
		if( x$op[i] == "~" ){
			arrows <- c(arrows,paste(x$lhs[i]," <- ",x$rhs[i],bt(i)))
		}
		if( x$op[i] == "~~" && (x$lhs[i] != x$rhs[i]) ){
			arrows <- c(arrows,paste(x$lhs[i]," <-> ",x$rhs[i],bt(i)))
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
as.dagitty.bn <- function( x, ... ){
	nodes <- names( x$nodes )
	ee <- c()
	if( nrow(x$arcs) > 0 ){
		ee <- apply(x$arcs, 1, function(a) {
			if( nrow(merge(data.frame(from=a[2],to=a[1]),x$arcs))>0 ){
				if( a[1] < a[2] ){
					paste(a[1],"--",a[2])
				} else { 
					""
				}
			} else {
				paste(a[1],"->",a[2])
			}
		})
	}
	dagitty(paste("pdag{ " , 
		paste(nodes, collapse="\n"), 
		paste(ee, collapse="\n"), 
		" }"))
}

#' @export
as.dagitty.default <- function( x, ... ){
	if( is.dagitty(x) ){
		x
	} else {
		stop("Cannot coerce object to class 'dagitty': ",x)
	}
}

#' @export
c.dagitty <- function( ... ){
	args <- list(...)
	xvs <- replicate( length(args), .getJSVar() )
	rv <- .getJSVar()
	tryCatch({
		for( i in seq_along(args) ){ 
			.jsassigngraph( xvs[[i]], as.dagitty( args[[i]] ) )
		}
		.jsassign( rv, .jsp("DAGitty.GraphTransformer.mergeGraphs(",
			paste(xvs,collapse=","),").toString()") )
		r <- .jsget( rv )
	},finally={
		lapply( xvs, .deleteJSVar )
		.deleteJSVar( rv )
	})
	as.dagitty(r)
}

#' @export
print.dagitty <- function( x, ... ){
	cat(x)
	invisible(x)
}


