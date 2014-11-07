iMacroLibrary
=============

JS library to make working with iMacros easier.

=============
General Functions
<ul>
	<li>debugOn()<li>debugOff()</li>
	<li>log(message)<li>dlog(message))</li>
	<li>alert(message)<li>dalert(message))</li>
	<li>reload())</li>
	<li>pause(time) //pause immediately)</li>
	<li>isDocAlive() //checks if document is alive)</li>
	<li>keepAlive())</li>
	<li>play(m))</li>
	<li>setAttribute(element) //chooses which attribute to use for the TAG)</li>
	<li>exportcsv(csvarray, filename))</li>
	<li>importcsv(file_name, line_num, fields_num))</li>
</ul>
Main objects/functions)
<ul>
	<li>$M(selector, number) --> returns a Tag object with the element's type, attr, position)</li>
	<li>Accepts a CSS selector and a number (if there are more than one matching elements).)</li>
	<li>If no number is provided and there is more than one matching element, the first match is used.)</li>
	<li>Tag({type, attr, pos}) --> constructor for a tag element with relevant macro functions)</li>
	<li>PLAY<br />
		<ul>
			<li>.playAll<li>.playNow()<li>.playLater()<li>)</li>
			<li>.play(macro))</li>
			<li>.do(macro)<li>//either store macro or play immediately depending on .playAll switch)</li>
			<li>.click())</li>
		</ul>
	</li>
	<li>EXTRACTION<br />
		<ul>
			<li>.extract(extracttype, nolog))</li>
			<li>.download(opt_screenshot))</li>
			<li>DROPDOWN-SPECIFIC)</li>
			<li>.extractAll(nolog) //extracts all entries in the dropdown)</li>
			<li>.choose(chooseby, choice))</li>
			<li>.chooseByName(choice))</li>
			<li>.chooseByText(choice))</li>
			<li>.chooseByIndex(choice))</li>
			<li>.chooseCarefully(chooseby, choice) //chooses only if dropdown is loaded)</li>
			<li>.isLoaded() //true or false)</li>
			<li>.notLoaded() //true or false)</li>
		</ul>
	</li>
</ul>
=============

iMacros issues/notes)</li>
  1. Many essential window methods/properties such as window.console, window.alert, etc are blocked through iMacros. )</li>
     An unsafeWindow can be created that overcomes this, and in the library window is redefined as unsafeWindow early on.)</li>
     realwindow is holding the real/original window object.)</li>
  2. Accessing DOM elements, however, requires using the real/original window object's document. )</li>
     document = realWindow.document)</li>
  3. Sometimes a "can't access dead object" error comes up when trying to access some property of an old document element)</li>
     
