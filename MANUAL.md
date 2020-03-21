# Usage Manual

This is a usage manual for the Chrome Extension "Amazon Video Progress Resetter". If you want 
to know more more about what it is, please refer to the [readme](README.md).

##  Instructions

Once you have installed the extension you will notice the extension icon almost always
being grayed out like this:

![Grayed out icon](/images/logo-40-gray.png?raw=true)

only when you open a season page (meaning an overview page that shows the episodes of a
season on Amazon video) in your browser, the icon will become green:

![Enabled icon](/images/logo-40.png?raw=true)

When on a season page, click the extension icon and a dialog will appear:

![Enabled icon](/manual/1.png?raw=true)

Here you can choose whether to cancel the process or actually start resetting the whole season.

If you click on "Start!" the process will begin and a new tab will be opened for each episode
that is to be reset. Meanwhile, the open dialog will inform you about the current progress 
of resetting the entire season:

![Enabled icon](/manual/2.png?raw=true)

![Enabled icon](/manual/3.png?raw=true)

Once the process has finished, the dialog will remain open with a hint that the page will be
refreshed upon opening the dialog:

![Enabled icon](/manual/4.png?raw=true)

And thats it! If you wish to reset more seasons of the same series (or a different one), just
go to the next season overview page and click the extension icon in your browser again: ![Enabled icon](/images/logo-20.png?raw=true)

## Troubleshooting

In rare cases it might happen that the extension thinks it can reset something on that page,
but then can not find any episodes to work with. Should this occur, an alert will show up
in your browser:

![Enabled icon](/manual/alert.png?raw=true)

If you find that this alert is wrong, please feel free to [open an issue](https://github.com/ArSn/chrome-amazon-video-progress-resetter/issues/new)
and describe the problem with as much detail as possible (e.g. what page are you on).

Apart from that, should you find anything of the extension not working for you, feel free to
[open an issue](https://github.com/ArSn/chrome-amazon-video-progress-resetter/issues/new)
as well.