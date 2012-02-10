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

## Output of the app ##

```console
Stories for Sascha Depold
==============================
[2012/02/09 08:14:12 CET] [BUG] ACCEPTED: bark bark
[2012/02/09 08:16:18 CET] [BUG] ACCEPTED: another bug
[2012/02/09 10:16:14 CET] [FEATURE] ACCEPTED: a feature
[2012/02/09 20:15:52 CET] [CHORE] UNSTARTED: a chore

Stories for John Doe
==============================
[2012/02/09 10:44:28 CET] [BUG] ACCEPTED: a bug
[2012/02/09 11:38:20 CET] [FEATURE] STARTED: a feature
```
