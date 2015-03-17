var librarylocation = "iMacroLibrary.js";

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
}

//--------------------- MAIN DEFINITIONS TIME YEEE-HAAAAAW ---------------------
function main(){

	debugOff();
	wait.value = 0.1;

	var Year = $M("select",1),
		Make = $M("select",2),
		Model = $M("select",3),
		Options = $M("select",4);

	var x = [],
		finaldata = [],
		attempt={};

	//--------------------- ACTION TIME, Ka-BOOOOOOOOOOOOM ---------------------

	//for(var y = 1; y <= 2 ; y++){
		var y=2, mk=3, md=2, o=1;

		/*
		chooseYear();
		extractMake();
		chooseMake();
		extractModel();
		chooseModel();
		extractOptions();
		chooseOptions();
		*/

		Year.extractAll();
		Year.choose("index",5);
		Make.extractAll();
		Make.choose("index",5);
		/*
		Model.extractAll();
		Model.chooseCarefully("index",1);
		Options.extractAll();
		Options.chooseCarefully("index",0);
		*/

	//};
}//end main function

loadScript(librarylocation,main);