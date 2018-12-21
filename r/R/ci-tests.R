## BEGIN functions that implement conditional independence tests

.rmsea <- function( r ){
	if( r$statistic==0 ){
		return( 0 )
	}
	sqrt( max( r$statistic/r$parameter-1, 0 ) / (sum(r$observed)-1) )
}

.chisq.test <- function( x ){
	x <- x[complete.cases(x),]
	y <- x[,2]
	x <- x[,1]
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

.ci.test.chisq <- function( x, ind ){
	if( length(ind$Z) > 0 ){
	  # Determine sample size per stratum
	  #rrn <- by(x[,c(ind$X,ind$Y)], x[,ind$Z], nrow)
	
	  # Perform separate chi-square tests for each stratum
		rr <- by(x[,c(ind$X,ind$Y)], x[,ind$Z],
			 .chisq.test)
		rr.null <- sapply(rr,is.null)
		if( any(rr.null) ){
			rr <- rr[-which(rr.null)]
		}
		
		rmsea <- weighted.mean( sapply( rr, .rmsea ),
				       weights=sapply(rr,`[[`,'observed') )
		tst <- list(
			  parameter=sum(sapply(rr,`[[`,'parameter')),
			  statistic=sum(sapply(rr,`[[`,'statistic'))
		)
	} else {
		tst <- .chisq.test( x[,c(ind$X,ind$Y)] )
		rmsea <- .rmsea(tst)
	}
	r <- c(rmsea, 
	       tst$statistic,tst$parameter,
	       pchisq(tst$statistic,tst$parameter,lower.tail=FALSE)
	       )
	names(r) <- c("rmsea","x2","df","p.value")
	r
}

.ci.test.chisq.perm <- function( x, ind, conf.level, R ){
	requireNamespace("boot",quietly=TRUE)
	bo <- boot::boot( x, function(data,i){
		.ci.test.chisq(x[i,],ind)[1]
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

