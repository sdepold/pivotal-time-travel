## Getting a PivotalTracker-token ##

```console
$ curl -d username=$USERNAME -d password=$PASSWORD -X POST https://www.pivotaltracker.com/services/v3/tokens/active
```

## Run the web version ##

```console
$ npm install
$ cp config/config.json.example config/config.json
$ pico config/config.json
$ node app.js
```

Now open `http://localhost:3000/scrum-board`.
