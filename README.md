# Horatio: Absentee Ballot Client

A client for an absentee ballot request form, with [a corresponding server](https://github.com/TrustTheVote-Project/horatio-server/).

## Overview

This is a responsive form that collects the information required to request an absentee ballot, encodes it as JSON, and transmits it to a server. The client can be used directly, or the JSON-encoding components can be ripped out and used on any website, or, really, anything that produces JSON can produce conformant JSON and submit it to the server, obviating the client.

## Stack

* Bower
* Bootstrap SASS
* Compass

## Installation

1. Copy onto a web server.
2. Edit `/assets/js/functions.js` and change `$.post( "https://www.democraticabsentee.com/api/submit/"` to replace the URL with the URL for your installation, including the `/submit/` API method at the end of the URL.
3. Set up mandatory HTTPS on the site because it’s 2015 and you’re handling people’s personally identifying information.
