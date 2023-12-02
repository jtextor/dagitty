
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

	v <- .vertexAttributes( x, "eps" )
	v$a <- as.double(as.character(v$a))
	v.not.set <- is.na(v$a)
	v$a[v.not.set] <- eps

	ovars <- names(x)
	lats <- c()
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
			veps <- rep( eps, nV+nL )
			veps[1:nV] <- v$a[match(ovars,v$v)]
			Phi <- diag( veps, nV+nL )
		}
		Sigma <- t(Li) %*% Phi %*% Li
	} else {
		if( standardized == TRUE ){
			Sigma <- diag(eps,nV+nL)
		} else {
			veps <- rep( eps, nV+nL )
			veps[1:nV] <- v$a[match(ovars,v$v)]
			Sigma <- diag( veps, nV+nL )
		}
	}
	if( verbose ){
		SigmaC <- Sigma
		colnames( SigmaC ) <- rownames( SigmaC ) <- c(ovars,lats)
		print( veps )
		print( SigmaC )
	}
	r <- MASS::mvrnorm( N, rep(0,nV+nL), Sigma, empirical=empirical )[,1:nV,drop=FALSE]
	colnames(r) <- ovars
	r <- as.data.frame(r)
	r[,setdiff(ovars,latents(x)),drop=FALSE]
}

#' Simulate Binary Data from DAG Structure
#'
#' Interprets input DAG as a structural description of a logistic
#' model in which each variable is binary and its log-odds ratio is 
#' a linear combination of its parent values.
#'
#' @param x the input graph, a DAG (which may contain bidirected edges).
#' @param N number of samples to generate.
#' @param b.lower lower bound for random path coefficients, applied if \code{b.default=NULL}.
#' @param b.upper upper bound for path coefficients.
#' @param b.default default path coefficient applied to arrows for which no coefficient is 
#'  defined in the model syntax.
#' @param eps base log-odds ratio.
#' @param verbose logical. If true, prints the order in which the data are generated (which
#'  should be a topological order).
#' 
#' @export
simulateLogistic <- function( x, b.default=NULL, 
	b.lower=-.6, b.upper=.6, eps=0, N=500,
	verbose=FALSE ){
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

	v <- .vertexAttributes( x, "eps" )
	v$a <- as.double(as.character(v$a))
	v.not.set <- is.na(v$a)
	v$a[v.not.set] <- eps
	v$v <- paste0("v",v$v)
	ovars <- names(x)
	nV <- length(ovars)
	nL <- sum(e$e=="<->")
	lats <- c()
	vars <- paste0("v",ovars)
	if( nrow(e) > 0 ){
		if( nL > 0 ){
			lats <- paste0("l",seq_len(nL))
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
	} else {
		Beta <- diag(1,nV)
		colnames(Beta) <- vars
	}
	if( verbose ){
		print(Beta)
	}
	rootNodes <- which( Beta != 0 )
	r <- matrix( 0, ncol=ncol(Beta), nrow=N )
	colnames(r) <- colnames(Beta)
	roots <- !(colnames(Beta) %in% paste0("v",unique(e$w)))

	for( i in colnames(Beta)[roots] ){
		if( verbose ){
			print(paste("Generating",i))
		}
		r[,i] <- 2*rbinom( N, 1, .odds2p( v$a[v$v==i] ) )-1
	}
	tord <- unlist(topologicalOrdering( x )[ovars])
	if( verbose ){
		print("topological ordering: ")
		print(tord)
	}
	for( i in which(!roots)[order(tord[!roots])] ){
		cn <- colnames(Beta)[i]
		if( verbose ){
			print(paste("Generating",cn))
		}
		p <- .odds2p( r %*% Beta[,i] + v$a[v$v==cn] )
		r[,cn] <- 2*rbinom( N, 1, p )-1
	}
	r <- r[,seq(1,nV),drop=FALSE]
	colnames(r) <- ovars
	r <- as.data.frame(r)
	r <- r[,setdiff(ovars,latents(x)),drop=FALSE]
	r[] <- lapply(r,function(x) factor(x,levels=c(-1,1)))
	r
}
