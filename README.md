# Horatio: Absentee Ballot Client


A client for an absentee ballot request form, with [a corresponding server](https://github.com/waldoj/absentee-server/).

## Overview

This is a responsive form that collects the information required to request an absentee ballot, encodes it as JSON, and transmits it to a server.

## Stack

* Bower
* Bootstrap SASS
* Compass

## Installation

1. Copy onto a web server.
2. Edit `/assets/js/functions.js` and change `$.post( "http://example.com/submit/"` to replace the URL with the URL for your installation, including the `/submit/` directory.
3. You are done.
