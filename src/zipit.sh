#!/bin/bash
gzip -9 ../dist/rentcheck/runtime.*.js
gzip -9 ../dist/rentcheck/main.*.js
gzip -9 ../dist/rentcheck/polyfills.*.js
gzip -9 ../dist/rentcheck/styles.*.css

for f in ../dist/rentcheck/*.gz; do mv "$f" "${f%.gz}"; done