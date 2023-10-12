# dagitty

This is a collection of algorithms, a GUI frontend and an R package for analzing
graphical causal models (DAGs).

The main componsents of the repository arre:

 * `jslib`: a JavaScript library implementing many DAG algorithms. This library underpins
 both the web interface and the R package, but could also be used independently, like in node.js.
 * `gui`: HTML interface for a GUI that exposes most of the functions in the JavaScript library.
 * `r`: R package that exposes most of the functions in the JavaScript library.
 * `website`: The current content of [https://dagitty.net](dagitty.net), including a version of the
 GUI (which may be older than the one in `gui`. 
 * `doc`: LaTeX source of the dagitty PDF documentation.



## Running the web interface locally

Clone the repository and open the file `gui/dags.html` in your web browser.
Currently most functionality should work locally, but you will need an internet
connection if you want to load or save DAG models on [https://dagitty.net](dagitty.net).

## Running the R package

The R package can be installed from CRAN, but this version is not updated very
frequently. If you want to install the most recent version of the dagitty R package,
you can:

```
install.packages("remotes") # unless you have it already
remotes::install_github("jtextor/dagitty/r")
```

If you encounter any problems installing the R package, it is probably not due to dagitty
itself, but due to the package "V8" that it depends on. I may try to remove this dependence
in a future version.

# More information

You can get more information on dagitty at [https://dagitty.net](dagitty.net) and
 [https://dagitty.net](dagitty.net/learn). The R package is documented through the standard
R interface. There are also a few papers available:


1. Textor, J., van der Zander, B., Gilthorpe, M. S., Liśkiewicz, M., & Ellison, G. T. H. (2017). Robust causal inference using directed acyclic graphs: the R package ‘dagitty.’ In International Journal of Epidemiology (p. dyw341). Oxford University Press (OUP). https://doi.org/10.1093/ije/dyw341

2. Ankan, A., Wortel, I. M. N., & Textor, J. (2021). Testing Graphical Causal Models Using the R Package “dagitty.” In Current Protocols (Vol. 1, Issue 2). Wiley. https://doi.org/10.1002/cpz1.45


 
