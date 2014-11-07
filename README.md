iMacroLibrary
=============

JS library to make working with iMacros easier.

=============
General Functions
	debugOn()	debugOff()
	log(message)	dlog(message)
	alert(message)	dalert(message)
	reload()
	pause(time) //pause immediately
	isDocAlive() //checks if document is alive
	keepAlive()
	play(m)
	setAttribute(element) //chooses which attribute to use for the TAG
	exportcsv(csvarray, filename)
	importcsv(file_name, line_num, fields_num)
Main objects/functions
	$M(selector, number) --> returns a Tag object with the element's type, attr, position
		Accepts a CSS selector and a number (if there are more than one matching elements).
		If no number is provided and there is more than one matching element, the first match is used.
	Tag({type, attr, pos}) --> constructor for a tag element with relevant macro functions
		PLAY
			.playAll	.playNow()	.playLater()	
			.play(macro)
			.do(macro)	//either store macro or play immediately depending on .playAll switch
			.click()
		EXTRACTION
			.extract(extracttype, nolog)
			.download(opt_screenshot)
		DROPDOWN-SPECIFIC
			.extractAll(nolog) //extracts all entries in the dropdown
			.choose(chooseby, choice)
				.chooseByName(choice)
				.chooseByText(choice)
				.chooseByIndex(choice)
			.chooseCarefully(chooseby, choice) //chooses only if dropdown is loaded
			.isLoaded() //true or false
				.notLoaded() //true or false

=============

iMacros issues/notes
  1. Many essential window methods/properties such as window.console, window.alert, etc are blocked through iMacros. 
     An unsafeWindow can be created that overcomes this, and in the library window is redefined as unsafeWindow early on.
     realwindow is holding the real/original window object.
  2. Accessing DOM elements, however, requires using the real/original window object's document. 
     document = realWindow.document
  3. Sometimes a "can't access dead object" error comes up when trying to access some property of an old document element
     
