var librarylocation = "https://raw.githubusercontent.com/anonmily/iMacroLibrary/master/iMacroLibrary.js";

/*__________________ Define unsafeWindow __________________*/
var bGreasemonkeyServiceDefined = false;
try {  
	if (typeof Components.interfaces.gmIGreasemonkeyService === "object") { bGreasemonkeyServiceDefined = true;  } 
} catch (err) { /*Ignore.*/ }

if (typeof unsafeWindow === "undefined" || !bGreasemonkeyServiceDefined) {
    unsafeWindow = (function(){
        var dummyElem = window.document.createElement('p');
        dummyElem.setAttribute('onclick', 'return window;');
        return dummyElem.onclick();
    })();
}

(function( realwindow, window, document, iimPlay, iimGetLastExtract, iimSet, undefined) {

	function loadScript(url, callback)
	{
	    // Adding the script tag to the head as suggested before
	    var head = realwindow.document.getElementsByTagName('head')[0];
			script = realwindow.document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;
	    script.onreadystatechange = callback;
	    script.onload = callback;

	    head.appendChild(script);
	}

	//--------------------- MAIN DEFINITIONS TIME YEEE-HAAAAAW ---------------------
	function main(){

		alert("Main function loaded");

		debugOff();
		wait.value = 0.1;

		var Make = $M("select",1);

		alert(Make);
		var x = [],
			finaldata = [],
			attempt={};

		alert('all is well!');

	}//end main function

	loadScript(librarylocation,main);

	//main();

})(window, unsafeWindow, unsafeWindow.document, iimPlay, iimGetLastExtract, iimSet);