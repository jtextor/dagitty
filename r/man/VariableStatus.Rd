% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/dagitty.R
\name{VariableStatus}
\alias{VariableStatus}
\alias{exposures}
\alias{exposures<-}
\alias{outcomes}
\alias{outcomes<-}
\alias{latents}
\alias{latents<-}
\alias{adjustedNodes}
\alias{adjustedNodes<-}
\alias{setVariableStatus}
\title{Variable Statuses}
\usage{
exposures(x)

exposures(x) <- value

outcomes(x)

outcomes(x) <- value

latents(x)

latents(x) <- value

adjustedNodes(x)

adjustedNodes(x) <- value

setVariableStatus(x, status, value)
}
\arguments{
\item{x}{the input graph, of any type.}

\item{value}{character vector; names of variables to receive the given status.}

\item{status}{character, one of "exposure", "outcome" or "latent".}
}
\description{
Get or set variables with a given status in a graph. Variables in dagitty graphs can
have one of several statuses. Variables with status \emph{exposure} and 
\emph{outcome} are important when determining causal effects via the functions 
\code{\link{adjustmentSets}} and \code{\link{instrumentalVariables}}. Variables
with status \emph{latent} are assumed 
to be unobserved variables or latent constructs, which is respected when deriving
testable implications of a graph via the functions 
\code{\link{impliedConditionalIndependencies}} or \code{\link{vanishingTetrads}}.
}
\details{
\code{setVariableStatus} first removes the given status from all variables in the graph
that had it, and then sets it on the given variables.
For instance, if  \code{status="exposure"}  and \code{value="X"} are given, then
\code{X} will be the only exposure in the resulting graph.
}
\examples{
g <- dagitty("dag{ x<->m<->y<-x }") # m-bias graph
exposures(g) <- "x"
outcomes(g) <- "y"
adjustmentSets(g)

}
