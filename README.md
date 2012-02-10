## Getting a PivotalTracker-token ##

```console
$ curl -d username=$USERNAME -d password=$PASSWORD -X POST https://www.pivotaltracker.com/services/v3/tokens/active
```

## Run the app ##

```console
$ npm install

$ # with a single user:
$ TOKEN=<pivotalTrackerToken> USERNAME="<pivotalTrackerUsername>" PROJECTID=<projectId> node app.js

$ # or with multiple:
$ TOKEN=<pivotalTrackerToken> USERNAME="<pivotalTrackerUsername1>, <pivotalTrackerUsername2>" PROJECTID=<projectId> node app.js
```
