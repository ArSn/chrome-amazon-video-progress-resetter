# Chrome Amazon Video Progress Resetter

This is a browser extension to be used in [Google Chrome](https://www.google.com/chrome/), which allows the user to reset
the watch progress of a video series on Amazon video.

Since there is currently no feature on Amazon to reset the progress of a series, the only
option is to start each episode and stop it after a couple of seconds, so Amazon will reset
your progress on this particular episode. 

Especially when resetting a lot of episodes on series that have plenty of seasons and episodes,
this can become tiresome very quickly. As an example, [The Big Bang Theory](https://en.wikipedia.org/wiki/The_Big_Bang_Theory) (which is one of
my favorites) has a total of 279 episodes in 12 seasons.

I have therefore created this simple chrome extension
in order to automate exactly that process. The extension grabs a list of episodes from a
season page in your browser and opens each of them individually, waiting for the episode
to be actually playing and then playing a few seconds to ensure the progress is reset.

## Possible features in the future
Here is a list of features that could be added in the future:
- localization for all amazon sites, possibly automatically recognizing locale based on site
- add advanced feature to reset all seasons of the series, not just the current page

## Technical improvements
Here is a list of technical tasks that could be completed to improve the technical quality
of the code without adding any benefit for the user:
- do not add debug function to each file individually (how to make something global?)
- use ES6 class sugar
- add tests and CI and stuff

## Usage manual

Once you have installed the extension you will notice the extension icon almost always
being grayed out like this:

![Grayed out icon](/images/logo-40-gray.png?raw=true)

only when you open a season page (meaning an overview page that shows the episodes of a
season on Amazon video) in your browser, the icon will become green:

![Enabled icon](/images/logo-40-gray.png?raw=true)

When on a season page, click the extension icon and a dialog will appear.