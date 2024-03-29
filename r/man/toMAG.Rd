% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/dagitty.R
\name{toMAG}
\alias{toMAG}
\title{Convert DAG to MAG.}
\usage{
toMAG(x)
}
\arguments{
\item{x}{the input graph, a DAG}
}
\description{
Given a DAG, possibly with latent variables, construct a MAG that represents its
marginal independence model.
}
\examples{
toMAG( "dag { ParentalSmoking->Smoking 
  { Profession [latent] } -> {Income->Smoking}
  Genotype -> {Smoking->LungCancer} }")
}
