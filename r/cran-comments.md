As requested by Kurt Hornik, this small update fixes a bug in which "order" was used on a 1-column data frame, which is no longer possible.

No other changes were made.

## Test environments
* local OS X 10.14.6, R Under development (unstable) (2021-01-19 r79847) 
* local ubuntu 18.04 (bionic), R 4.0.1
* local Windows 10, R 4.1.0
* winbuilder R Under development (unstable) (2021-01-18 r79846)
* remote macOS 10.15.5, R 4.0.2
* remote Windows Server x64, R 4.0.2
* remote ubuntu 18.04, R 4.0.2

Remote tests were done using github actions.

## R CMD check results
On local systems:
0 errors | 0 warnings | 0 notes.

