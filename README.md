## Getting a PivotalTracker-token ##

```console
$ curl -d username=$USERNAME -d password=$PASSWORD -X POST https://www.pivotaltracker.com/services/v3/tokens/active
```

This will result in something like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<token>
  <guid>the lovely user token</guid>
  <id type="integer">a number which is most likely your user id</id>
</token>
```

## Run the web version ##

```console
$ npm install
$ cp config/config.json.example config/config.json
$ pico config/config.json
$ node app.js
```

## The config file ##

```json
{
  // add the projectId here
  // you can get that id from the url of the project
  // e.g.: https://www.pivotaltracker.com/projects/123456789
  "projectId": 123456789,

  // add the user token here
  "token": "abcd1234"
}
```

Now open `http://localhost:3000/scrum-board`.
