iMacroLibrary
=============

JS library to make working with iMacros easier.

=============
__NOTE__

**I am no longer maintaining this library.**
For other alternatives for web scraping, please check out Python (e.g. Splinter, Beautiful Soup), PHP cURL, or NodeJS. It'll be worth your time; I guarantee it. They're pretty awesome. Python especially is one of my favorites, and doing scraping with multithreading speeds things up immensely.

This was originally a pet project when I had just started out with web automation and didn't know about all those tools or languages and had only low-level Javascript knowledge in my toolbelt. I came back to it and refactored it a bit for a sense of closure back in early 2015 (looking back at my old code is painful!), but there were still some issues/quirks involved with iMacros that I did not completely resolve, as well as some iMacros features that I hadn't added. As I mainly use other tools for web scraping nowadays, I will no longer be actively adding to this library, but feel free to extend on it and send me a pull request if you want to work with it.

When you run gulp, any new macros in the macros folder will be automatically joined with the library and put into the run folder. (It was a quirk with gulp that I didn't resolve. I might get back to it eventually...but for now, if a new file is added, close (Ctrl+C) then restart gulp to have your new file compiled.)

**General Functions**
* $M.log(message)
* $M.alert(message)
* $M.goto(url)
* $M.reload())
* $M.pause(seconds) 
* $M.csv.out(csvarray, filename))
* $M.csv.in(file_name, line_num, fields_num))

**Some Private Functions in Library**
* isDocAlive() 
	* checks if document is alive
* keepAlive())
	* keeps document alive
* play(m))
* setAttribute(element)
	* chooses which attribute to use for the TAG

**Main objects/functions)**
* $M(selector, number)
	* Returns a Tag object with the element's type, attr, position
	* Accepts a CSS selector and a number (if there are more than one matching elements).)
	* If no number is provided and there is more than one matching element, the first match is used.)
* Tag({type, attr, pos}) 
	* Constructor for a tag element with relevant macro functions
	* __Action__
		* .playAll	.playNow()	.playLater()
		* .play(macro))
		* .do(macro)//either store macro or play immediately depending on .playAll switch)
		* .click())
	* __Extraction__
		* .extract(extracttype, nolog))
		* .download(opt_screenshot))
		* DROPDOWN-SPECIFIC<br />
			* .extractAll(nolog) //extracts all entries in the dropdown)
			* .choose(chooseby, choice))
			* .chooseByName(choice))
			* .chooseByText(choice))
			* .chooseByIndex(choice))
			* .chooseCarefully(chooseby, choice) //chooses only if dropdown is loaded)
			* .isLoaded() //true or false)
			* .notLoaded() //true or false)

=============

**iMacros issues/notes)**

1. Many essential window methods/properties such as window.console, window.alert, etc are blocked through iMacros. An unsafeWindow can be created that overcomes this, and in the library window is redefined as unsafeWindow early on.
 realwindow is holding the real/original window object.

2. Accessing DOM elements, however, requires using the real/original window object's document.
 document = realWindow.document

3. Sometimes a "can't access dead object" error comes up when trying to access some property of an old document element. isDocAlive() checks if the document is dead. keepAlive() checks if the document is alive and revives it if it is dead.
     
=============

**Todos**

1. Fix gulpfile so that its watch/concat is up-to-date when a new file is added
2. Add jQuery capability
