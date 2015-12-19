# Take Screenshot


The purpose of this script is to take screenshots of a given URL across multiple countries and short ids, and upload them to an Azure storage container.

For example:

`msdn.microsoft.com/en-us/dn12345`
`msdn.microsoft.com/en-au/dn12345`

Start by editing the URL on `screenshot.js:19`. Then add your list of country codes in `lib/config.js`. There is both a `prod` and `dev` array that you can test against to make sure the screenshots are correct.

## Things that I need help on/todo:
* **Unit tests**: I'm not sure where to begin in order to start this - probably requires rewriting a lot of code.
* **To make the more modular/reusable**: I need to decouple code. This was made for a specific purpose; hence why it's tightly-coupled. I *believe* it has a wider use to others; if it doesn't, it's still a good learning process.
* **Use of promises**: I *think* they way I'm using it is an example of an anti-pattern. 
* **Error/Exceptional Handling**: I'm not sure I'm handling this correctly. I've run into issues when I have this up and running on a linux VM, and I'll get an exception like `ECONNRESET`, that will shut down the whole script. *Currently running this on Ubuntu VM and script is running as a cronjob*.


Stackoverflow Questions I've asked (for reference):

* [Async.js - ETIMEDOUT and Callback was already called](http://stackoverflow.com/questions/33310078/async-js-etimedout-and-callback-was-already-called)
* [Q promise chain exists promise chain after error](http://stackoverflow.com/questions/33441209/q-promise-chain-exists-promise-chain-after-error)
