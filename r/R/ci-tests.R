#' @importFrom stats qchisq

## BEGIN functions that implement conditional independence tests

## the functions below are convenience functions called from within the CI tests.

.rmsea <- function( r ){
	if( r$statistic==0 ){
		return( 0 )
	}
	sqrt( max( r$statistic/r$parameter-1, 0 ) / (sum(r$observed)-1) )
}

.conf.interval.chisq <- function( r, w ){
	chi <- qchisq( w, df=r$parameter, ncp=r$statistic )
	.rmsea( list( parameter=r$parameter,
                      statistic=chi,
                      observed=r$observed ) )
}

.perm.cor.test <- function( a, b, conf.level, R ){
	requireNamespace("boot",quietly=TRUE)
	bo <- boot::boot( cbind(a,b), function(data,i){
		cor(data[i,1],data[i,2])
	}, R )
	r <- c(
		bo$t0,
		sd(bo$t),
		quantile(bo$t,c((1-conf.level)/2,1-(1-conf.level)/2),na.rm=TRUE)
	)
	w <- (1-conf.level)/2
	names(r) <- c("estimate","std.error",
		      paste0(100*w,"%"),paste0(100*(1-w),"%"))
	r
}

.chisq.test <- function( x ){
	x <- x[complete.cases(x),]
	y <- x[[2]]
	x <- x[[1]]
	Oi <- table(x,y)
	n <- length(x)
	sX <- rowSums(Oi)
	sY <- colSums(Oi)
	if( (sum(sX>0)<2) || (sum(sY>0)<2) ){
		return( NULL )
	}
	Ei <- outer(sX, sY,"*")/n
	Oi <- Oi[sX>0,sY>0]
	Ei <- Ei[sX>0,sY>0]
	residuals <- (Oi-Ei)^2 / Ei
	chisq <- sum(residuals)
	df <- (nrow(residuals)-1)* (ncol(residuals)-1)
	list( parameter=df,
		statistic=chisq,
	       observed=n ) 
}

# These functios implement the actual CI tests.

.ci.test.pillai <- function( x, ind, conf.level ){
	w <- (1-conf.level)/2
	r <- c(NA,NA,NA,NA)

	X <- x[,ind$X,drop=FALSE]
	if( is.logical(X[,1]) ){
		X[,1] <- as.numeric(X[,1])
	} else if( is.factor(X[,1]) ){
		if( length(levels(X[,1])) <= 2 ){
			X[,1] <- as.integer(X[,1])
		} else {
			if( !requireNamespace( "fastDummies", quietly=TRUE ) ){
				stop("This function requires the 'fastDummies' package!")
			}
			X <- fastDummies::dummy_cols( X, remove_most_frequent_dummy=TRUE,remove_selected_columns=TRUE )
		}
	} else if( !is.numeric(X[,1]) ){
		stop(paste0("Variable ",ind$X," must be numeric or factor, found ",class(X[,1])))
	}


	Y <- x[,ind$Y,drop=FALSE]
	if( is.logical(Y[,1]) ){
		Y[,1] <- as.numeric(Y[,1])
	} else if( is.factor(Y[,1]) ){
		if( length(levels(Y[,1])) <= 2 ){
			Y[,1] <- as.integer(Y[,1])
		} else {
			if( !requireNamespace( "fastDummies", quietly=TRUE ) ){
				stop("This function requires the 'fastDummies' package!")
			}
			Y <- fastDummies::dummy_cols( Y, remove_most_frequent_dummy=TRUE,remove_selected_columns=TRUE )
		}
	} else if( !is.numeric(Y[,1]) ){
		stop(paste0("Variable ",ind$Y," must be numeric or factor, found ",class(Y[,1])))
	}

	if( !is.numeric(X[,1]) ){
		X[,1] <- as.integer(X[,1])
	}
	if( !is.numeric(Y[,1]) ){
		Y[,1] <- as.integer(Y[,1])
	}


	if( length(ind$Z) > 0 ){
		Z <- x[,ind$Z,drop=FALSE]
		for( i in seq_len(ncol(X)) ){
			X[,i] <- lm( data=cbind(X[,i],Z) )$residuals
		}
		for( i in seq_len(ncol(Y)) ){
			Y[,i] <- lm( data=cbind(Y[,i],Z) )$residuals
		}
	}

	if( ncol(X) == 1 && ncol(Y) == 1 ){
		tst <- cor.test( X[,1], Y[,1] )
		r[1] <- tst$estimate
		r[2] <- tst$p.value
		r[c(3,4)] <- tst$conf.int
	} else {
		if( !requireNamespace( "CCP", quietly=TRUE ) ){
			stop("This function requires the 'CCP' package!")
		}
		rho <- cancor(X,Y)$cor
		N = dim(X)[1]; p = dim(X)[2]; q = dim(Y)[2]
		r[c(1,3,4)] <- sqrt(mean(rho^2))
		capture.output( pv <- CCP::p.asym( rho, N, p, q, tstat="Pillai" ) )
		r[2] <- pv$p.value[1]
	}
	names(r) <- c("estimate","p.value",
		      paste0(100*w,"%"),paste0(100*(1-w),"%"))
	r
}

# standard chi-square test
.ci.test.chisq <- function( x, ind, conf.level ){
	w <- (1 - conf.level) / 2
	if( length(ind$Z) > 0 ){
	  # Determine sample size per stratum
	  #rrn <- by(x[,c(ind$X,ind$Y)], x[,ind$Z], nrow)
	
	  # Perform separate chi-square tests for each stratum
		rr <- by(x[,c(ind$X,ind$Y)], x[,ind$Z],
			 .chisq.test)
		rr.null <- sapply(rr,is.null)

		if( all(rr.null) ){
			tst <- list( parameter=0, statistic=0 )
			rmsea.lower <- 0
			rmsea.upper <- 0
		} else {
			if( any(rr.null) ){
				rr <- rr[-which(rr.null)]
			}

			rmsea <- weighted.mean( sapply( rr, .rmsea ),
				    weights=sapply(rr,`[[`,'observed') )
			rmsea.lower <- weighted.mean( sapply(rr, .conf.interval.chisq, w=w),
		    		weights=sapply(rr, `[[`, 'observed') )
					rmsea.upper <- weighted.mean( sapply(rr, .conf.interval.chisq, w=(1-w)),
		                 	weights=sapply(rr, `[[`, 'observed') )
			tst <- list(
			 	parameter=sum(sapply(rr,`[[`,'parameter')),
			 	statistic=sum(sapply(rr,`[[`,'statistic'))
			)
		}
	} else {
		tst <- .chisq.test( x[,c(ind$X,ind$Y)] )
		rmsea <- .rmsea(tst)
		rmsea.lower <- .conf.interval.chisq(tst, w=w)
		rmsea.upper <- .conf.interval.chisq(tst,w=(1-w))
	}

	if( tst$parameter == 0 ){
		r <- c(0,0,0,1,0,0)
	} else {
		r <- c(rmsea, 
			tst$statistic,tst$parameter,
	    	pchisq(tst$statistic,tst$parameter,lower.tail=FALSE),
	      	rmsea.lower, rmsea.upper)
	}
	names(r) <- c("rmsea","x2","df","p.value",paste0("rmsea ",100*w,"%"),
	              paste0("rmsea ",100*(1-w),"%"))
	r
}

.ci.test.chisq.perm <- function( x, ind, conf.level, R ){
	requireNamespace( "boot", quietly=TRUE )
	bo <- boot::boot( x, function(data,i){
		.ci.test.chisq(x[i,],ind,conf.level)[1]
	}, R )
	r <- c(
		bo$t0,
		sd(bo$t),
		quantile(bo$t,c((1-conf.level)/2,1-(1-conf.level)/2),na.rm=TRUE)
	)
	w <- (1-conf.level)/2
	names(r) <- c("rmsea","std.error",
		      paste0(100*w,"%"),paste0(100*(1-w),"%"))
	r
}

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


.ci.test.covmat <- function( sample.cov, sample.nobs,
	ind, conf.level, tol ){
	vars <- unlist(c(ind$X,ind$Y,ind$Z))
	sample.cov <- sample.cov[vars,vars]
	M <- MASS::ginv(sample.cov)
	pcor <- -M[1,2] / sqrt( M[1,1] * M[2,2] )
	pcor.z <- atanh( pcor )
	df <- sample.nobs - length(ind$Z) - 3
	pcor.z.sem <- 1 / sqrt( df )
	if( is.null( tol ) ){ 
		pcor.pval <- pchisq( pcor.z^2*df, 1, lower.tail=FALSE )
	} else {
		tol.z <- atanh( tol )
		pcor.pval <- pchisq( pcor.z^2*df, 1, ncp=tol.z^2*df, lower.tail=FALSE )
	}
	crit <- qnorm( (1-conf.level)/2, lower.tail=FALSE )
	r <- c( pcor, 
		pcor.pval,
		atan( pcor.z-crit*pcor.z.sem ),
		atan( pcor.z+crit*pcor.z.sem ) )
	w <- (1-conf.level)/2
	names(r) <- c("estimate","p.value",
		      paste0(100*w,"%"),paste0(100*(1-w),"%"))
	r
}

