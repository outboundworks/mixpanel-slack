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
    postUrl: 'https://hooks.slack.com/services/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',
    formatter: function(data) {
      var ret = [];
      try {
        // First we need to format the mixpanel data
        data = decodeURIComponent(data).substr(6).replace(/\+/g,' ');
        // Then we parse it
        data = JSON.parse(data);
        data.forEach(function(event) {
          var id = event['$distinct_id'];
          var name = event['$properties']['$name'];
          var message = "@gabriel\n" + name + " clicked the RunCustomSetup button\n<" +
              "https://mixpanel.com/report/270423/explore/#user?distinct_id=" + id +
              "| View in Mixpanel>";
          var payload = {
            text: message,
            icon_emoji: ":monkey:",
            username: "Mixpanel"
          };
          ret.push(payload);
        });
      } catch(error) {
        console.error('Failed to process data');
        console.error(error);
      }
      return ret;
    }
  },
  {
    requestUrl: '/mixpanel/signup',
//    postUrl: 'https://hooks.slack.com/services/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',
    postUrl: 'https://hooks.slack.com/services/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',
    formatter: function(data) {
      var ret = [];
      try {
        // First we need to format the mixpanel data
        data = decodeURIComponent(data).substr(6).replace(/\+/g,' ');
        // Then we parse it
        data = JSON.parse(data);
        data.forEach(function(event) {
          var id = event['$distinct_id'];
          var name = event['$properties']['$name'];
          var org = event['$properties']['org'];
          var phone = event['$properties']['phone'];
          var timezon = event['$properties']['$timezone'];
          var message = name + "@" + org + " just signed up";
              //"\nCall: " + phone +
              //"\nTimezone: " + timezone +
              //"\n<https://mixpanel.com/report/270423/explore/#user?distinct_id=" + id +
              //"| View in Mixpanel>";
          var payload = {
            text: message,
            icon_emoji: ":moneybag:",
            username: "Mixpanel"
          };
          ret.push(payload);
        });
      } catch(error) {
        console.error('Failed to process data');
        console.error(error);
      }
      return ret;
    }
  }
];

// Handle posted messages
app.post('/*', function(req, res) {
  var url = req.url;
  var body = req.body;
  var startedRequests = 0;
  var completedRequests = 0;
  
  var doPost = function(item, data) {
    request({url: item.postUrl,
             method: 'POST',
             json: true, 
             body: data},
             function(err,httpResponse,body){
               completedRequests++;               
                if (completedRequests == startedRequests) {
                  res.send('OK');
                }
              });
     startedRequests++;
  };
  
  configurations.filter(function(item) {
    return item.requestUrl == url;
  })
  .forEach(function(item) {
    var bodyReformatted = item.formatter(body);
    console.log('Found formatter');
    if (bodyReformatted) {
       console.log('Reformatting done, will pass the data to the next hook');
       
       if (bodyReformatted instanceof Array) {
         bodyReformatted.forEach(function(postData){
           doPost(item, postData);
         });
       } else {
          doPost(item, bodyReformatted);
       }
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
