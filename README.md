# dagitty
Graphical Analysis of Structural Causal Models

This repository contains both the HTML-based graphical user interface and
the R package (in subfolder `r/`).

## Preparation

After checkout, first the jslib directory, and run "make". This will generate the dagitty js-libraries from the individual source files.

## Running the web interface

After preparation, open the file `gui/dags.html`.

## Running the R package

```
install.packages("devtools") # unless you have it already
library(devtools)
install_github("jtextor/dagitty/r")
```

