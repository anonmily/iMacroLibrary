/*__________________ Define unsafeWindow __________________*/

// iMacro prevents access to the window object of the browser, so we 
// must force access by creating an unsafeWindow

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

/*--------------------- General Variables / objects ---------------------*/
	var realwindow = window,
		window = unsafeWindow,		
			//many window operations are unavailable due to safety considerations
			//unsafeWindow allows us to override this and use console.log, alert etc
		document = realwindow.content.document,
			//accessing the DOM, however, requires using the real document
		on = true, off = false, ON = on, OFF = off, On = on, Off = off, //for convenience
		debug = off, //switch for debugging mode (on=true or off=false)
		wait = {
			value: 0.5, //holds current wait value (changes)
			step: 0.25, //holds step interval for incrementing wait time
			atad: 0.25, //holds shortest wait
			asec: 1, //holds short wait
			abit: 2, //holds long wait
			awhile: 3, //holds longest waittime
			increment: function(inc){ 
				this.value= inc ? Number(this.value)+Number(inc) : this.value + this.step;
			},
			reset: function(){ this.value = this.start; }
		};
/*--------------------- General Functions---------------------*/

	var debugOn = function(){ debug = on; }, //TURN ON DEBUGGING MODE
		debugOff = function(){ debug = off; }, //TURN OFF DEBUGGING MODE
		log = function(message){ window.console.log(message); },
		dlog = function(message){ if(debug){ window.console.log(message); } }, //DEBUGGING

		alert = function(message){ window.alert(message); },
		dalert = function(message){ if(debug){ window.alert(message); } }, //DEBUGGING

		reload = function(){ window.location.reload(true); }, //RELOAD PAGE

		pause = function(time){ //Pauses the program immediately for a given time
			if (time) {
				log("PAUSE, " + time + " sec");
				iimPlay("CODE: WAIT SECONDS=" + time);
			}else{
				var defaultpause = wait.value || wait.asec ;
				iimPlay("CODE: WAIT SECONDS=" + defaultpause);
				log("PAUSE, " + defaultpause + " sec");
			}
		},
		play = function(m){
			//this.macro = m || _current;
			dlog("______________PLAY______________ \n" + m + "\n"); 
			iimPlay("CODE: " + m); //play macro
		},
		setAttribute = function(elem){ 
			//Chooses which attribute to use for the TAG
			
			var att, 
				attributes = {};

			//get tag attribute names and values
				log(elem.attributes);
				for (var j=0; j<elem.attributes.length ; j++){
					attributes[elem.attributes[j].name] = elem.attributes[j].nodeValue;
				}

			//set attribute type
				if(attributes.id) {
					att = "ID:" + attributes.id;
				} else if (attributes.class) {
					att = "CLASS:" + attributes.class;
				} else if (attributes.name) {
					att = "NAME:" + attributes.name;
				} else if (attributes.href){
					att = "HREF:" + attributes.href;
				} else if (attributes.src){
					att = "SRC:" + attributes.src;
				} else if (attributes.onclick){
					att = "ONCLICK:" + attributes.onclick;
				} else {
					att = "TXT:" + elem.innerHTML.replace(" ","<SP>");
				}

			return att;
		},
		exportcsv = function(csvarray, filename){
			var csvstring = "Data:text/csv;charset=utf-8,";
			for(var row=0; row<csvarray.length; row++){
				csvstring += csvarray[row].replace(new RegExp(", ", 'g'), ",")+ "\n";
			}
			var encodedURI = encodeURI(csvstring);

			//Workaround for allowing download of CSV file with specified filename
			var a = window.document.createElement('a');
			a.id='download';
			a.href = encodedURI;
			a.download = filename +'.csv';
			//a.onclick = "return ExcellentExport.csv(this,'this.exportcsv.string')";
			a.innerHTML = "Download "+ filename;
			a.style.display = "none"; //hides the new element
			document.body.appendChild(a); //document manipulation requires real window object
			
			document.querySelector("#download").click();

			log("EXPORT || " + csvarray.length + " entries | " + filename + ".csv");

		},
		importcsv = function(file_name, line_num, fields_num){
			//Source csv file should be in the iMacro\Datasource folder.
			//File needs to be in UTF-8 encoding, so problems may occur when saving on a Mac.
			//If theres an encoding problem "Component returned failure code: 0x80500001" error will be returned.
			//Try opening in Notepad and resaving with UTF-8 encoding.

			//Both column and row numbering starts at 1, not 0.
			//setting line_num=0 would give an error!
			
			//standardizing arguments
				fields_num = Number(fields_num); line_num = Number(line_num);
				if(line_num <= 0){
					log("() line_num is invalid! Row numbers start at 1.");
					throw "() line_num is invalid! Row numbers start at 1.";
				}

			//write macro
				var macro = "VERSION BUILD=8820413 RECORDER=FX \n";
				macro += "SET !DATASOURCE "+file_name+" \n";
				macro += "SET !DATASOURCE_COLUMNS "+fields_num+" \n";
				macro += "SET !DATASOURCE_LINE "+line_num+"\n";
				
				var stringholder = "SET !EXTRACT ";
				var data = "";

				//loop through all columns (starts from 1 because there is no COL0, columns
				//in iMacro are numbered starting from 0)
				for(var a=1; a <= fields_num; a++){	
					macro += "SET column"+ a +" {{!COL"+a+"}} \n";
					stringholder += "{{column" + a + "}}";
					if (a !== fields_num ){stringholder += "," ; }
				}
				macro += stringholder;
				
				log(macro);
			//play macro
				iimPlay("CODE:"+macro);
			//receive extracted data, split entries by commas
				data = String(iimGetLastExtract()).split(",");
			//set data (returns the row data as an array)
				log("Imported CSV row data is "+data);
				return data;
		};

	
/*--------------------- MAIN iMacro OBJECT ---------------------*/

	var $M = function(selector, number){
		//takes css input like "a #id", "a .class", "a[name='somename']", returns an 
		// object on which further manipulations can be done (pseudo classes not yet supported)
		var node,
			type = "TYPE=",
			attr = "ATTR=",
			pos = "POS=",
			num = number || 1; //position # starts from 1

		//GET SELECTED ELEMENT
			selector  = String(selector);
			try{
				node = document.querySelectorAll(selector) || document.querySelector(selector);
			} catch(e){
				//iimPlay("CODE: TAB OPEN \n TAB T=2 \n TAB CLOSE \n TAB T=1");
				//realwindow = realwindow;
				//document = realwindow.document;
				realwindow = realwindow;
				realwindow.document.domain = realwindow.document.domain;
				var document = realwindow.document;
				node = document.querySelectorAll(selector) || document.querySelector(selector);
			}
			//Use POS if more than one element is selected, and dlog
			if(node.length > 1){
				node = node.item(num - 1);
				//dlog(node);
				dlog("More than one element matches the selector: " + selector +"\n Matching element #"+ num + " was used.");
			}else if(node.length == 1){
				node = node[0];
			}

		//GET ELEMENT DATA
			//get tag type
			type += node.nodeName;
			pos += 1;
			attr += setAttribute(node);

		//RETURN TAG OBJECT (FED TO TAG)
		return new Tag({ 
			type: type, 
			attr: attr, 
			pos: pos,
		});
	};

/*--------------------- Tag Constructor ---------------------*/

	var Tag = function(s){ //accepts a spec object (type, attr, pos)

		this.tag = "TAG "+ s.pos + " " + s.type + " " + s.attr;
		
		this.type = s.type.replace("TYPE=",""); this.pos = s.pos; this.attr = s.attr.replace("ATTR=","");
		
		this._current = ""; //placeholder for current macro
		this._store = ""; //holds last created macro line
		this.exResult = []; //holds extraction result(s)

		// SWITCHES
			this.playAll = true; //determine whether to play all macros immediately (line by line), or just write the macro
			this.ex = false; //remembers whether or not an extraction is done

		// .play() method and the .playAll switch, .playNow(), .playLater()
			this.playNow = function(){this.play = true;};
			this.playLater = function(){this.play = false;};
			this.play = function(m){
				var macro = m || this._current;
				play(macro); //play macro

				if(!m){ 
					this._current = ""; //clear stored macro if used 
				}

				if(this.ex){ //if an extraction is done (ex switch is on)
					this.exResult = String(iimGetLastExtract());
					//split depending on type
					switch(this.type){
						default:
							dlog("element type extracted is: " + this.type);
							break;
						case "SELECT":
							case "SELECT":
							this.exResult = this.exResult.split("[OPTION]");
							break;
						case "TABLE":
							//split into rows
							this.exResult = this.exResult.split("\n");
							//split rows into row entries/columns
							for(var t_row=0; t_row<this.exResult.length ; t_row++){
								this.exResult[t_row] = this.exResult[t_row].split(",");
							}
							break;
					}

					//if there's only one (or no) entry in the extraction array, return a string instead.
					if(this.exResult.length <= 1){this.exResult = this.exResult[0].toString();}

					//turn off extraction switch
					this.ex = false;

					//return extraction result
					return this.exResult;

				}else{ return this; }
			}; //end of this.play()


		this.do = function(x){ //Either store macro or play immediately
			if(this.playAll){  //if playAll switch is on
				this._store = x; //store macro line
				this.play(this._store); //play immediately
			} else {
				this.current += x; //add macro line
			}
			return this;
		};

		this.click = function(){
			this.do( this.tag + "\n" );
			return this;
		};

		// --------------------- DATA EXTRACTION ---------------------

		this.extract = function(extracttype, nolog){
			//extracttype = "TXT" | Just interior text of currently displayed element/value
			//extracttype = "TXTALL" | All options for a select/dropdown
			var all = "ALL";
			if(extracttype){
				extracttype = (extracttype.toUpperCase() == "ALL") ? "TXTALL" : "TXT";
			} else { extracttype = "TXT"; }
			var m = this.tag + " EXTRACT=" + extracttype + "\n";
			this.ex = true;
			this.do( m );

			if(!nolog){ log("EXTRACT || Target: " + this.type + " " + this.attr + " | " + this.exResult); }
			return this.exResult;
		};

		this.download = function(opt_screenshot){
			// opt_screenshot is an optional argument (any truthy value) to save an image 
			// element as a screenshot rather than downloading it. Useful when trying to 
			// save what an element looks like at a particular time/event (e.g. hover)
			var savetype;

			if(this.type=="IMG" && !opt_screenshot){
	    		savetype = "SAVEITEM";
	    	} else if(this.type === "IMG" && opt_screenshot){
	    		savetype = "SAVE_ELEMENT_SCREENSHOT";
	    	} else if(this.type !== "IMG"){
	    		savetype = "SAVETARGETAS";
	    	}

	    	this.do( this.tag + " CONTENT=EVENT:" + savetype );
	    	
	    	return this;

		};

		// --------------------- DROPDOWN-SPECIFIC ---------------------
		
		if(this.type == "SELECT"){ 

			this.extractAll = function(nolog){
				this.extract("ALL",nolog);
			};
		
			this.choose = function(chooseby, choice){
				var props = {
					name: "$", value: "%", index: "#", text: "$",
					n: "$", v: "%", i: "#", t: "$",
					"$": "$", "%": "%", "#": "#"
				};
				var dropdownlist = this.extract("all", "nolog"),
					type = props[chooseby],
					desired = "",
					value = "";
				log(dropdownlist);
				switch(chooseby){
					case "name": //by display text
						desired = dropdownlist[dropdownlist.indexOf(choice)];
						value = "\""+choice+"\"";
						break;
					case "value": //by value attribute
						desired = dropdownlist[dropdownlist.indexOf(choice)];
						value = "\""+choice+"\"";
						break;
					case "index": //by index/number in the list
						//dropdownlist is a javascript array and so starts from 0

						//iMacro starts indexing the dropdown from 1, so for the 
						// iMacro TAG CONTENT, we need to add one (choice + 1) to 
						//the inputted choice/index to compensate for javascript's array 
						//numbering, which starts from 0. 
							//If you input 0, the new index# is 1...which will select 
							//the first item in the dropdown, as you originally intended.

						value = Number(choice) +1;
						//dlog("choice:" + choice + " | Value:" + value);
						desired = dropdownlist[choice];
						break;
					default:
						dlog("CHOOSE, invalid chooseby type: should be name, value, or index");
						break;
				}
				this.do( this.tag + " CONTENT=" + type + value + "\n" );
				log("CHOOSE || Intended: " + desired + " | Chosen: " + this.extract("TXT", "nolog"));
				return this;
			};
			this.chooseByName = function(choice){ this.choose("name",choice); };
			this.chooseByText = function(choice){ this.choose("name",choice); };
			this.chooseByValue = function(choice){ this.choose("value",choice); };
			this.chooseByIndex = function(choice){ this.choose("index",choice); };

			this.isLoaded = function(){

				//check for "Loading" in current dropdown
				dlog("isLoaded check for 'Loading...'" + this.extract("TXT", "nolog") + " | " + String(this.extract("TXT", "nolog")).search("Load"));
				if(this.extract("TXT", "nolog").indexOf("Load") >= 0){
					dlog("Still Loading!");
					return false;
				}else{ 
					dlog("Loaded. Ready for Extraction.");
					return true;
				}

				//check for a disabled dropdown

			};
			this.notLoaded = function(){ return !this.isLoaded(); };

			this.chooseCarefully = function(chooseby, choice){
				var thismethod = this.chooseCarefully;
				while(this.notLoaded() && thismethod.attempt < thismethod.attemptLimit){
					log("Not loaded...attempt "+this.method.attempt);
					pause();
					wait.increment();
					thismethod.attempt++;
				}
				if(this.isLoaded()){
					this.choose(chooseby, choice);
				} else {
					throw "Still Loading";
				}
				wait.reset;
				thisattempt = 0;
			};

			this.chooseCarefully.attempt = 0;
			this.chooseCarefully.attemptLimit = 10;
		}

		// --------------------- FORM-SPECIFIC ---------------------

		this.input = function(){
			//incomplete
			if(this.playAll){ play(this._current); }
		};

		
	};

//--------------------- MAIN DEFINITIONS TIME YEEE-HAAAAAW ---------------------

debugOff();
wait.value = 0.1;

var Year = $M("select",1),
	Make = $M("select",2),
	Model = $M("select",3),
	Options = $M("select",4);
	SubmitButton = $M("#plc_lt_zoneContent_PagePlaceholder_PagePlaceholder_lt_zoneTopLeft_HomeSearchControl_NSCNormalSearch_btnFindTires",1);
var x = [],
	finaldata = [],
	
	attempt={};

attempt.y = 0;
attempt.mk = 0;
attempt.md = 0;
attempt.o = 0;


//--------------------- ACTION TIME, Ka-BOOOOOOOOOOOOM ---------------------

//for(var y = 1; y <= 2 ; y++){

	var y=2, mk=3, md=2, o=1;
	document.domain = document.domain;

	
	Year.extractAll();
	Year.chooseCarefully("index",6);
	Make.extractAll();
	Make.chooseCarefully("index",5);
	Model.extractAll();
	Model.chooseCarefully("index",1);
	Options.extractAll();
	Options.chooseCarefully("index",1);
	SubmitButton.click();
	pause();
	var document = realwindow.document;
	//document.domain = document.domain;
	log(document);

//};