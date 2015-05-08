var express = require("express");
var logfmt = require("logfmt");
var request = require('request');
var app = express();

// App setup
app.use(logfmt.requestLogger());
app.use (function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });
    req.on('end', function() {
        req.body = data;
        next();
    });
});

// Setup the configurations
var configurations = [
  {
    requestUrl: '/mixpanel/RunCustomSetup',
    postHost: 'https://hooks.slack.com',
    postPath: '/services/T0299RBGC/B04PUL2A9/UVHDNz3KGuWUwa7BZayRjvJs',
    formatter: function(data) {
      try {
        // First we need to format the mixpanel data
        data = data.substr(6).replace(/\+/g,'');
        // Then we parse it
        data = JSON.parse(data);
        
        console.log(data[0]);
      } catch(error) {
        console.error('Failed to process data');
        console.error(error);
      }
      return {"text": "This is a line of text in a channel.\nAnd this is another line of text.",
              "icon_emoji": ":monkey:"};
    }
  }
];


// Handle posted messages
app.post('/*', function(req, res) {
  var url = req.url;
  var body = req.body;
  var startedRequests = 0;
  var completedRequests = 0;
  configurations.filter(function(item) {
    return item.requestUrl == url;
  })
  .forEach(function(item) {
    var bodyReformatted = item.formatter(body);
    console.log('Found formatter');
    if (bodyReformatted) {
       console.log('Reformatting done, will pass the data to the next hook');
       /*
       request({url: 'https://hooks.slack.com/services/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',
      method: 'POST',
      json: true, 
      
                body: bodyReformatted},
                    function(err,httpResponse,body){
                      completedRequests++;
               
                      if (completedRequests == startedRequests) {
                        res.send('OK');
                      }
                    });
       startedRequests++;
       */
    }
  });
  if (startedRequests == 0) {
    res.send('OK');
  }
});

// Start server
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
