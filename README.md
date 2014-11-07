iMacroLibrary
=============

JS library to make working with iMacros easier.

=============
General Functions)<br />
	debugOn()	debugOff()<br />
	log(message)	dlog(message))<br />
	alert(message)	dalert(message))<br />
	reload())<br />
	pause(time) //pause immediately)<br />
	isDocAlive() //checks if document is alive)<br />
	keepAlive())<br />
	play(m))<br />
	setAttribute(element) //chooses which attribute to use for the TAG)<br />
	exportcsv(csvarray, filename))<br />
	importcsv(file_name, line_num, fields_num))<br />
Main objects/functions)<br />
	$M(selector, number) --> returns a Tag object with the element's type, attr, position)<br />
		Accepts a CSS selector and a number (if there are more than one matching elements).)<br />
		If no number is provided and there is more than one matching element, the first match is used.)<br />
	Tag({type, attr, pos}) --> constructor for a tag element with relevant macro functions)<br />
		PLAY)<br />
			.playAll	.playNow()	.playLater()	)<br />
			.play(macro))<br />
			.do(macro)	//either store macro or play immediately depending on .playAll switch)<br />
			.click())<br />
		EXTRACTION)<br />
			.extract(extracttype, nolog))<br />
			.download(opt_screenshot))<br />
		DROPDOWN-SPECIFIC)<br />
			.extractAll(nolog) //extracts all entries in the dropdown)<br />
			.choose(chooseby, choice))<br />
				.chooseByName(choice))<br />
				.chooseByText(choice))<br />
				.chooseByIndex(choice))<br />
			.chooseCarefully(chooseby, choice) //chooses only if dropdown is loaded)<br />
			.isLoaded() //true or false)<br />
				.notLoaded() //true or false)<br />

=============

iMacros issues/notes)<br />
  1. Many essential window methods/properties such as window.console, window.alert, etc are blocked through iMacros. )<br />
     An unsafeWindow can be created that overcomes this, and in the library window is redefined as unsafeWindow early on.)<br />
     realwindow is holding the real/original window object.)<br />
  2. Accessing DOM elements, however, requires using the real/original window object's document. )<br />
     document = realWindow.document)<br />
  3. Sometimes a "can't access dead object" error comes up when trying to access some property of an old document element)<br />
     
