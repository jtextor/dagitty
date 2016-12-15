
.dagitty.cache <- new.env()

.crossprod <- function( vx, vy, wx, wy ) vx*wy-vy*wx

.autoControlPoint <- function( x1, y1, x2, y2, asp, delta=.2 ){
	mx <- (x1+x2)/2
	my <- (y1+y2)/2
	omy <- (x1-x2)*asp
	omx <- (y2-y1)/asp
	list(x=mx+delta*omx,y=my+delta*omy)
}

.supportsTypes <- function( x, y ){
	gt <- graphType( x )
	if( !(gt %in% y) ){
		stop("Graph type not supported : ",gt)
	}
}

.arc <- function( x1, y1, x2, y2, xm, ym, col="gray", length=0.1, code=3, lwd=1 ){
	x <- c(x1,xm,x2)
	y <- c(y1,ym,y2)
	res <- xspline(x, y, 1, draw=FALSE)
	lines(res, col=col, lwd=lwd)
	nr <- length(res$x)
	if( code >= 3 ){
		arrows(res$x[1], res$y[1], res$x[4], res$y[4], col=col, 
			code = 1, length = length, lwd=lwd)
	}
	if( code >= 2 ){
		arrows(res$x[nr-3], res$y[nr-3], res$x[nr], res$y[nr], 
			col=col, code = 2, length = length, lwd=lwd)	
	}
}

.lineSegIntersect <- function( px, py, p2x, p2y,
	qx, qy, q2x, q2y ){
	rx <- p2x-px; ry <- p2y-py
	sx <- q2x-qx; sy <- q2y-qy
	rxs <- .crossprod( rx, ry, sx, sy ) 
	if( rxs == 0 ){
		return( NULL )
	}
	t <- .crossprod( qx-px, qy-py, 
		sx, sy ) / rxs
	u <- .crossprod( qx-px, qy-py, 
		rx, ry ) / rxs
	if( u < 0 || u > 1 || t < 0 || t > 1 ){
		return( NULL )
	}
	list( x=qx+u*sx, y=qy+u*sy )
}

# (p,q) are box coordinates
# (a,b) are line segment coordinates
.lineSegBoxIntersect <- function(
	px, py, qx, qy, ax, ay, bx, by ){
	c(
	.lineSegIntersect( 
		px, py, qx, py, 
		ax, ay, bx, by ),
	.lineSegIntersect( 
		px, py, px, qy, 
		ax, ay, bx, by ),
	.lineSegIntersect( 
		px, qy, qx, qy, 
		ax, ay, bx, by ),
	.lineSegIntersect( 
		qx, py, qx, qy, 
		ax, ay, bx, by )
	)
}

.getJSContext <- function(){
	if( !exists("ct",.dagitty.cache) ){
		requireNamespace("V8",quietly=TRUE)
		ct <- V8::new_context()
		ct$source(system.file("js/underscore.js",package="V8"))
		ct$source(system.file("js/dagitty-alg.js",package="dagitty"))
		ct$source(system.file("js/RUtil.js",package="dagitty"))
		ct$source(system.file("js/example-dags.js",package="dagitty"))
		assign("ct",ct,.dagitty.cache)
	}
	get("ct",.dagitty.cache)
}

.getJSVar <- function(){
	if( !exists("nvars",.dagitty.cache) ){
		assign("nvars",0,.dagitty.cache)
		with( .dagitty.cache, vars.available <- list() )
	}
	va <- get("vars.available",.dagitty.cache)
	if( length(va)>0 ){
		r <- names(tail(va,1))
		.dagitty.cache$vars.available[[r]] <- NULL
		return(r)
	} else {
		.dagitty.cache$nvars <- .dagitty.cache$nvars+1
		return(paste0("y",get("nvars",.dagitty.cache)))
	}
}

.deleteJSVar <- function(x){
	if( !exists("nvars",.dagitty.cache) ){
		assign("nvars",0,.dagitty.cache)
		with( .dagitty.cache, vars.available <- list() )
	}
	.getJSContext()$eval( paste0("delete global.",x) )
	if( is.null(.dagitty.cache$vars.available[[x]]) ){
		.dagitty.cache$vars.available[[x]] <- 1
	}
}

.jsassign <- function(name, value, auto_unbox = TRUE, ...){
    stopifnot(is.character(name))
    requireNamespace("jsonlite",quietly=TRUE)
    ct <- .getJSContext()
    obj <- if (any(is(value, "JS_EVAL"), is(value, "AsIs"))) {
        invisible(ct$eval(paste("global.", name, "=", value)))
    }
    else {
        invisible(ct$eval(paste("global.", name, "=", jsonlite::toJSON(value, 
            auto_unbox = auto_unbox, ...))))
    }
}

.jsget <- function (name, ...) 
{
    stopifnot(is.character(name))
    requireNamespace("jsonlite",quietly=TRUE)
    ct <- .getJSContext()
    jsonlite::fromJSON(ct$eval(c("JSON.stringify(global.", name, ")")), 
        ...)
}

.jsassigngraph <- function( xv, x ){
	.jsassign( xv, as.character(x) )
	.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,")") )
}

.jsgetgraph <- function( xv ){
	r <- .jsget(paste0("GraphSerializer.toDot(global.",xv,")"))
	structure(r,class="dagitty")
}

.jsglobals <-function (){
	setdiff( .getJSContext()$get("Object.keys(global)"),
		c("console","print","global","ArrayBuffer","Int8Array","Uint8Array","Int16Array",
		"Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array","DataView"
		) )
}

.jseval <-function (...){
	.getJSContext()$eval(...)
}

.jsp <- function (...){
	requireNamespace("V8",quietly=TRUE)
	V8::JS( paste0( ... ) )
}

.kins <- function( x, v, type="descendants" ){
	supported <- c("descendants","ancestors","neighbours","posteriors","anteriors",
		"children","parents","spouses","adjacentNodes")
	if( ! type %in% supported ){
		stop("Supported kinship types : ",paste(supported,collapse=", ") )
	}
	r <- c()
	xv <- .getJSVar()
	vv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		
		for( w in v ){
			.jsassign( vv, as.character(w) )
			.jsassign( vv, .jsp("global.",xv,".getVertex(global.",vv,")") )
			.jsassign( vv, .jsp("global.",xv,".",type,"Of([global.",vv,"])") )
			r <- union(r, .jsget( paste0("_.pluck(global.",vv,",'id')") ))
		}
	},finally={
		.deleteJSVar(xv)
		.deleteJSVar(vv)
	})
	as.character(r)
}

.capitalizeFirst <- function(s){
	paste0(toupper(substring(s, 1, 1)), substring(s, 2))
}

.nodesWithProperty <- function( x, type="source" ){
	supported <- c("source","target","latentNode","adjustedNode","selectionNode")
	if( ! type %in% supported ){
		stop("Supported properties : ",paste(supported,collapse=", ") )
	}
	xv <- .getJSVar()
	tryCatch({
		.jsassign( xv, as.character(x) )
		.jsassign( xv, .jsp("GraphParser.parseGuess(global.",xv,")") )
		.jsassign( xv, .jsp("global.",xv,".get",.capitalizeFirst(type),"s()") )
		r <- .jsget( paste0("_.pluck(global.",xv,",'id')") )
	},finally={
		.deleteJSVar(xv)
	})
	r
}

.edgeAttributes <- function( x, a ){
	x <- as.dagitty( x )
	xv <- .getJSVar()
	yv <- .getJSVar()
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( yv, a )
		.jsassign( xv, .jsp("DagittyR.edgeAttributes2r(global.",xv,",global.",yv,")") )
		r <- .jsget(xv)
	}, finally={.deleteJSVar(xv);.deleteJSVar(yv)})
	as.data.frame(r)
}

## BEGIN functions that implement conditional independence tests

.ci.test.lm.perm <- function( x, ind, conf.level, R=500 ){
	if( length(ind$Z) > 0 ){
		ix <- lm( paste(ind$X,"~",paste(ind$Z,collapse=" + ")), data=x )$residuals
		iy <- lm( paste(ind$Y,"~",paste(ind$Z,collapse=" + ")), data=x )$residuals
	} else {
		ix <- x[,ind$X]
		iy <- x[,ind$Y]
	}
	.perm.cor.test(ix,iy,conf.level,R)
}

.ci.test.loess.perm <- function( x, ind, conf.level, R=500, loess.pars=list() ){
	if( length(ind$Z) > 0 ){
		ix <- do.call( loess, c(
			list(formula=paste(ind$X,"~",paste(ind$Z,collapse=" + ")),
			data=x),loess.pars
			))$residuals
		iy <- do.call( loess, c(
			list(formula=paste(ind$Y,"~",paste(ind$Z,collapse=" + ")),
			data=x),loess.pars
			))$residuals
	} else {
		ix <- x[,ind$X]
		iy <- x[,ind$Y]
	}
	.perm.cor.test(ix,iy,conf.level,R)
}

.perm.cor.test <- function( a, b, conf.level, R ){
	requireNamespace("boot",quietly=TRUE)
	bo <- boot::boot( cbind(a,b), function(data,i){
		cor(data[i,1],data[i,2])
	}, R )
	c(
		Estimate=bo$t0,
		"Std. Error"=sd(bo$t),
		quantile(bo$t,c((1-conf.level)/2,1-(1-conf.level)/2))
	)
}

.ci.test.covmat <- function( sample.cov, sample.nobs,
	ind, conf.level, tol ){
	vars <- unlist(c(ind$X,ind$Y,ind$Z))
	sample.cov <- sample.cov[vars,vars]
	M <- MASS::ginv(sample.cov)
	pcor <- -M[1,2] / sqrt( M[1,1] * M[2,2] )
	pcor.z <- atanh( pcor )
	tol.z <- atanh( tol )
	df <- sample.nobs - length(ind$Z) - 3
	pcor.z.sem <- 1 / sqrt( df )
	if( is.null( tol ) ){ 
		pcor.pval <- pchisq( pcor.z^2*df, 1, lower.tail=FALSE )
	} else {
		pcor.pval <- pchisq( pcor.z^2*df, 1, ncp=tol.z^2*df, lower.tail=FALSE )
	}
	crit <- qnorm( (1-conf.level)/2, lower.tail=FALSE )
	c( pcor, mean( pcor-atan( pcor.z-pcor.z.sem ), atan( pcor.z+pcor.z.sem )-pcor ),
		pcor.pval,
		atan( pcor.z-crit*pcor.z.sem ),
		atan( pcor.z+crit*pcor.z.sem ) )
}

## END functions that implement conditional independence tests

.tetradsFromData <- function( x, tets, i=seq_len(nrow(x)) ){
	M <- cov(x[i,])
	sapply( seq_len(nrow(tets)), 
		function(j) det(M[tets[j,c(1,4)],tets[j,c(2,3)]]) )
}

.tetradsFromCov <- function( M, tets ){
	sapply( seq_len(nrow(tets)), 
		function(j) det(M[tets[j,c(1,4)],tets[j,c(2,3)]]) )
}

.tetrad.sem <- function( x, M, n ){
	Msub <- M[x,x]
	d <- det(Msub)
	d12 <- det(Msub[c(1,4),c(1,4)])
	d34 <- det(Msub[c(2,3),c(2,3)])
	sqrt((d12 * d34 * (n+1) / (n-1) - d)/(n-2))
}

.graphTransformer <- function( x, method="moralGraph" ){
	x <- as.dagitty(x)
	xv <- .getJSVar()
	r <- NULL
	tryCatch({
		.jsassigngraph( xv, x )
		.jsassign( xv, .jsp("GraphTransformer.",method,"(global.",xv,")") )
		.jsassign( xv, .jsp("global.",xv,".toString()") )
		r <- .jsget( xv )
	}, 
	error=function(e) stop(e),
	finally={.deleteJSVar(xv)})
	structure(r,class="dagitty")
}

