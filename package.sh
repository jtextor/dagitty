#!/bin/bash

# Make a ZIP package containing
# the current version of the dagitty GUI
# and store it in a file called dagitty.zip

( cd jslib/ ; make )
( cd gui ; zip -r ../dagitty.zip * )
