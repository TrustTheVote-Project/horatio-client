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

## FAQ

### Can I pre-fill the election date, type, district, etc?

Absolutely. That's as simple as modifying [`index.html`](https://github.com/TrustTheVote-Project/horatio-client/blob/master/index.html). You could even make those hidden form fields with assigned values, although you must make sure that the form states very clearly what those values will be, or else you may run afoul of election board regulations, or even state law.

### How do I get this data into my campaign’s management software?

The Horatio client emits JSON, and can POST it to any endpoint. Modify [`assets/js/functions.js`](https://github.com/TrustTheVote-Project/horatio-client/blob/master/assets/js/functions.js), specifically the stanza contained by `.done(function(json, textStatus, ErrorThrown) {...}`, which is executed when the Horatio server responds with a `200` status code. You can re-POST the JSON to any other endpoint.

### How do I track use of Horatio?

That’s what website traffic software is for. For example, [Google Analytics supports event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events). So after adding Google’s `analytics.js` snippet to [`index.html`](https://github.com/TrustTheVote-Project/horatio-client/blob/master/index.html), you might add this code to [`assets/js/functions.js`](https://github.com/TrustTheVote-Project/horatio-client/blob/master/assets/js/functions.js), within the `$('form').submit(function(e) {...}` stanza.

```
ga('send', 'event', 'absentee', 'submit', 'success');
```

Specifically, you might put that within the `.done(function(json, textStatus, ErrorThrown) {...}` stanza, and a `fail` version within the `.fail(function(json, textStatus, ErrorThrown) {...}` stanza, to track failed efforts to submit the form.
