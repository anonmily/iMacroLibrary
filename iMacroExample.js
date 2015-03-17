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

	//var DOM=realwindow.document,on=true,off=false,ON=on,OFF=off,On=on,Off=off,debug=off,wait={value:undefined,step:0.25,atad:0.25,asec:1,abit:2,awhile:3,increment:function(inc){this.value=inc?Number(this.value)+Number(inc):this.value+this.step},reset:function(){this.value=this.start}};var debugOn=function(){debug=on},debugOff=function(){debug=off},log=function(message){window.console.log(message)},dlog=function(message){if(debug){window.console.log(message)}},alert=function(message){window.alert(message)},dalert=function(message){if(debug){window.alert(message)}},reload=function(){window.location.reload(true)},pause=function(time){if(time){log("PAUSE, "+time+" sec");iimPlay("CODE: WAIT SECONDS="+time)}else{var defaultpause=wait.value||wait.asec;iimPlay("CODE: WAIT SECONDS="+defaultpause);log("PAUSE, "+defaultpause+" sec")}},play=function(m){dlog("______________PLAY______________ \n"+m+"\n");iimPlay("CODE: "+m)},setAttribute=function(elem){var att,attributes={};for(var j=0;j<elem.attributes.length;j++){attributes[elem.attributes[j].name]=elem.attributes[j].nodeValue}if(attributes.id){att="ID:"+attributes.id}else if(attributes.class){att="CLASS:"+attributes.class}else if(attributes.name){att="NAME:"+attributes.name}else if(attributes.href){att="HREF:"+attributes.href}else if(attributes.src){att="SRC:"+attributes.src}else if(attributes.onclick){att="ONCLICK:"+attributes.onclick}else{att="TXT:"+elem.innerHTML.replace(" ","<SP>")}return att},exportcsv=function(csvarray,filename){var csvstring="Data:text/csv;charset=utf-8,";for(var row=0;row<csvarray.length;row++){csvstring+=csvarray[row].replace(new RegExp(", ",'g'),",")+"\n"}var encodedURI=encodeURI(csvstring);var a=window.document.createElement('a');a.id='download';a.href=encodedURI;a.download=filename+'.csv';a.innerHTML="Download "+filename;a.style.display="none";DOM.body.appendChild(a);document.querySelector("#download").click();log("EXPORT || "+csvarray.length+" entries | "+filename+".csv")},importcsv=function(file_name,line_num,fields_num){fields_num=Number(fields_num);line_num=Number(line_num);if(line_num<=0){log("() line_num is invalid! Row numbers start at 1.");throw"() line_num is invalid! Row numbers start at 1.";}var macro="VERSION BUILD=8820413 RECORDER=FX \n";macro+="SET !DATASOURCE "+file_name+" \n";macro+="SET !DATASOURCE_COLUMNS "+fields_num+" \n";macro+="SET !DATASOURCE_LINE "+line_num+"\n";var stringholder="SET !EXTRACT ";var data="";for(var a=1;a<=fields_num;a++){macro+="SET column"+a+" {{!COL"+a+"}} \n";stringholder+="{{column"+a+"}}";if(a!==fields_num){stringholder+=","}}macro+=stringholder;log(macro);iimPlay("CODE:"+macro);data=String(iimGetLastExtract()).split(",");log("Imported CSV row data is "+data);return data};alert("iMacro Library is loaded!");var $M=function(selector,number){var node,type="TYPE=",attr="ATTR=",pos="POS=",num=number||1;selector=String(selector);try{node=DOM.querySelectorAll(selector)||DOM.querySelector(selector)}catch(e){iimPlay("CODE: TAB OPEN \n TAB T=2 \n TAB CLOSE \n TAB T=1");realwindow=realwindow;DOM=realwindow.document;node=DOM.querySelectorAll(selector)||DOM.querySelector(selector)}if(node.length>1){node=node.item(num-1);dlog("More than one element matches the selector: "+selector+"\n Matching element #"+num+" was used.")}else if(node.length==1){node=node[0]}type+=node.nodeName;pos+=1;attr+=setAttribute(node);return new Tag({type:type,attr:attr,pos:pos,})};var Tag=function(s){this.tag="TAG "+s.pos+" "+s.type+" "+s.attr;this.type=s.type.replace("TYPE=","");this.pos=s.pos;this.attr=s.attr.replace("ATTR=","");this._current="";this._store="";this.exResult=[];this.playAll=true;this.ex=false;this.playNow=function(){this.play=true};this.playLater=function(){this.play=false};this.play=function(m){var macro=m||this._current;play(macro);if(!m){this._current=""}if(this.ex){this.exResult=String(iimGetLastExtract());switch(this.type){default:dlog("element type extracted is: "+this.type);break;case"SELECT":case"SELECT":this.exResult=this.exResult.split("[OPTION]");break;case"TABLE":this.exResult=this.exResult.split("\n");for(var t_row=0;t_row<this.exResult.length;t_row++){this.exResult[t_row]=this.exResult[t_row].split(",")}break}if(this.exResult.length<=1){this.exResult=this.exResult[0].toString()}this.ex=false;return this.exResult}else{return this}};this.do=function(x){if(this.playAll){this._store=x;this.play(this._store)}else{this.current+=x}return this};this.click=function(){this.do(this.tag+"\n");return this};this.extract=function(extracttype,nolog){var all="ALL";if(extracttype){extracttype=(extracttype.toUpperCase()=="ALL")?"TXTALL":"TXT"}else{extracttype="TXT"}var m=this.tag+" EXTRACT="+extracttype+"\n";this.ex=true;this.do(m);if(!nolog){log("EXTRACT || Target: "+this.type+" "+this.attr+" | "+this.exResult)}return this.exResult};this.download=function(opt_screenshot){var savetype;if(this.type=="IMG"&&!opt_screenshot){savetype="SAVEITEM"}else if(this.type==="IMG"&&opt_screenshot){savetype="SAVE_ELEMENT_SCREENSHOT"}else if(this.type!=="IMG"){savetype="SAVETARGETAS"}this.do(this.tag+" CONTENT=EVENT:"+savetype);return this};if(this.type=="SELECT"){this.extractAll=function(nolog){this.extract("ALL",nolog)};this.choose=function(chooseby,choice){var props={name:"$",value:"%",index:"#",text:"$",n:"$",v:"%",i:"#",t:"$","$":"$","%":"%","#":"#"};var dropdownlist=this.extract("all","nolog"),type=props[chooseby],desired="",value="";log(dropdownlist);switch(chooseby){case"name":desired=dropdownlist[dropdownlist.indexOf(choice)];value="\""+choice+"\"";break;case"value":desired=dropdownlist[dropdownlist.indexOf(choice)];value="\""+choice+"\"";break;case"index":value=Number(choice)+1;desired=dropdownlist[choice];break;default:dlog("CHOOSE, invalid chooseby type: should be name, value, or index");break}this.do(this.tag+" CONTENT="+type+value+"\n");log("CHOOSE || Intended: "+desired+" | Chosen: "+this.extract("TXT","nolog"));return this};this.chooseByName=function(choice){this.choose("name",choice)};this.chooseByText=function(choice){this.choose("name",choice)};this.chooseByValue=function(choice){this.choose("value",choice)};this.chooseByIndex=function(choice){this.choose("index",choice)};this.isLoaded=function(){dlog("isLoaded check for 'Loading...'"+this.extract("TXT","nolog")+" | "+String(this.extract("TXT","nolog")).search("Load"));if(this.extract("TXT","nolog").indexOf("Load")>=0){dlog("Still Loading!");return false}else{dlog("Loaded. Ready for Extraction.");return true}};this.notLoaded=function(){return!this.isLoaded()};this.chooseCarefully=function(chooseby,choice){var thismethod=this.chooseCarefully;while(this.notLoaded()&&thismethod.attempt<thismethod.attemptLimit){log("Not loaded...attempt "+this.method.attempt);pause();wait.increment();thismethod.attempt++}if(this.isLoaded()){Year.choose(chooseby,choice)}else{throw"Still Loading";}wait.reset;thisattempt=0};this.chooseCarefully.attempt=0;this.chooseCarefully.attemptLimit=10}this.input=function(){if(this.playAll){play(this._current)}}};
	function loadScript(url, callback)
	{
	    // Adding the script tag to the head as suggested before
	    var head = realwindow.document.getElementsByTagName('head')[0];
			script = realwindow.document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;
	    //script.onreadystatechange = callback;
	    script.onload = callback;

	    head.appendChild(script);
	}

	//--------------------- MAIN DEFINITIONS TIME YEEE-HAAAAAW ---------------------
	function main(){

		debugOff();
		wait.value = 0.1;

		var Make = $M("select[name='autoMake']",1)

		var x = [],
			finaldata = [],
			attempt={};

		alert('all is well!');

		//--------------------- ACTION TIME, Ka-BOOOOOOOOOOOOM ---------------------

		//for(var y = 1; y <= 2 ; y++){
			var y=2, mk=3, md=2, o=1;

			Make.extractAll();
			//Make.choose("index",5);
			/*
			Model.extractAll();
			Model.chooseCarefully("index",1);
			Options.extractAll();
			Options.chooseCarefully("index",0);
			*/

		//};
	}//end main function

	loadScript(librarylocation,main);

	//main();

})(window, unsafeWindow, unsafeWindow.document, iimPlay, iimGetLastExtract, iimSet);