# acidtab

![logo](blob32.png)
*A chrome extension to store and manage your tabs*

## OwO WHAT'S THIS?
If you are anything like me, you probably have hundreds of tabs open eating up your poor computer's RAM.

Maybe you've tried to fix this by copying URLs into meticulously labled files, or by emailing yourself the links, or even by using an external service like OneTab. I've done all of those things and, quite frankly, the process has gotten so annoying that I refuse to make another `links_june3_2020.txt` ever again. I no longer use OneTab after it lost my tabs for seemingly no reason, so I made myself a tool that I can trust.

## INSTALL
I haven't added Acid Tab to the Chrome web store yet (should I?), so for now you can use this process to load the extension on your own computer:

1. Clone this repository to your computer
2. Navigate to `chrome://extensions/`
3. Enable developer mode
4. Click "Load unpacked"
5. Select this directory in the menu that pops up

And that's it!

## SCREENSHOTS

![popup](screenshots/sc1.png)
![main view](screenshots/sc2.png)
![search demo](screenshots/sc3.png)
![import demo](screenshots/sc4.png)
![import formats](screenshots/sc5.png)
![delete tab demo](screenshots/sc6.png)
![sample downloaded files](screenshots/sc7.png)

## TRUST
I trust this software, but you don't have to. It doesn't do anything stupid like close your tabs for you or otherwise meddle with your business. The only interaction the program has with your tabs is when you select one of the `Export tabs...` options in the pinned popup window, at which time it cycles through all of the tabs and copies their URL, title, and favicon. After that, it only deals with this data which has already been written down. But, like I said, you don't have to trust that this software works. You can download a snapshot of the page with your tabs as many times as you want (file is timestamped), or export the tabs as a txt file as many times as you want (also timestamped). Once you have the data downloaded and assured that it's to your liking, it's not going anywhere (unless you lose your hard drive in a freak accident, but that's on you, chief).

#### PERSISTENCE OF YOUR TABS
The program uses the [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) browser API to store your tabs (as a JSON string). This storage persists until you clear the cache of your browser. Of course, to be truly safe, download your data.

## CONTRIBUTING

## LICENSE
MIT
