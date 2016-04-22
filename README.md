# brisk-io/mixpanel-slack

The mixpanel-slack application is used to connect mixpanel and slack. It:

1. Listens to incomming webhooks from mixpanel
2. Reformats the data into slack messages
3. Posts to slack

### Configuration

To add a new meesage three configuration parts are needed

#### mixpanel-slack
In the [main.js]() a new configuration is needed. Just add one more object in the `configurations` array. The object shalll have the following properties:
* **requestUrl** - This url shall match a webhock url in mixpanel, to make sense this needs to be uniqu between all configurations
* **postUrl** - Post url o slack, see slack configuration. Multiple configurations can have the same `postUrl`
* **formatter** - A function that transforms the data received from mixpanel and builds a slack message out of it

#### Mixpanel
Create a webhook in mixpanel that triggers on whatever you want to trigger on, the path in the webhook url must match a `requestUrl` in a mixpanel-slack configuration. For example, if you mixpanel-slack configuration have the `requestUrl` "mixpanel/signup", then the matching webhook url is _https://brisk-mixpanel-slack.herokuapp.com/mixpanel/signup_

#### Slack
A mixpane-slack configuration need a slack post Url, this is done using the [Incoming webhooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) integration in Slack.
For each channel a mixpanel-slack configuration shall post to a post url needs to be created. If multiple configurations shall use the same channel then can also use the same mixpanel post Url.


### Testing

No testing provided

### Deployment

The service is hosted on heruoku as [brisk-mixpanel-slack](https://dashboard.heroku.com/apps/brisk-mixpanel-slack)
