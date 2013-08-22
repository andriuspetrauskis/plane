
var num = 10; //rodyti 10 geriausių

var render_table = function(data){
var ot = document.getElementsByTagName("table")[0];
var table = document.createElement("table");
var hr = document.createElement("tr");
Element.prototype.text = function(text) { if (text){ this.innerText = text; return this; } else return this.innerText; }
hr.appendChild(document.createElement("th").text("Vieta"));
hr.appendChild(document.createElement("th").text("Vardas"));
hr.appendChild(document.createElement("th").text("Taškai"));
table.appendChild(hr);
	if (ot){
		ot.parentNode.removeChild(ot);
	}
if (document.getElementsByTagName('canvas')) document.body.appendChild(table);
if (data)
	{
		var keys = Object.keys(data).sort(function(a,b){return data[b].score-data[a].score});
		var n = 0;
		for (var i in keys){
			sc = data[keys[i]];
			var r = document.createElement("tr");
				r.appendChild(document.createElement("td").text(i*1+1));
				r.appendChild(document.createElement("td").text(sc.name));
				r.appendChild(document.createElement("td").text(sc.score));
				table.appendChild(r);
				if (++n>=num) break;
		}
	}
}

var update_scores = function(){
	request('../scores',null, render_table);
}

function request(url, data, callback){

var  xhr = new XMLHttpRequest();

xhr.onreadystatechange=function()
  {
  if (xhr.readyState==4 && xhr.status==200)
    {
		callback(typeof JSON!=="undefined"?JSON.parse(xhr.responseText):eval(xhr.responseText), xhr);
    }
  }
xhr.open(data?"POST":"GET",url,true);
xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
if (data){
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xhr.send(data);
} else {
xhr.send();
}
}

//update_scores();
setInterval(update_scores, 2000); //atnaujinam kas 5s