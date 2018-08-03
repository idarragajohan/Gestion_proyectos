

//jQuery dependency
var methodLoad = null;

var dynamicTable = function(parentDiv, method) {

	this.parentDiv = parentDiv,
	this.width = this.parentDiv.width(),
	this.headers = {},
	this.data = {}
	this.page = 0,
	this.batch = 200,
	this.qty = 0,
	this.colWidth = [],
	methodLoad = method,

	this.headerConstructor = function(row, headers, colWidth, type){


		var rowCount = 0;
		$.each(headers, function(key, value){

			var cell = row.insertCell();

			if(type == "value"){
				cell.innerHTML = value;
			}else{
				cell.innerHTML = key;
			}

			if(colWidth.length > 0){

				cell.style.width = colWidth[rowCount]+"px";
			}

			rowCount++;
		});

	}

};

dynamicTable.prototype.getLimits = function(){


	var limits = {};

	if(this.page == 0){
		limits.lower = this.batch*this.page;
	}else{
		limits.lower = this.batch*(this.page-1);
	}

	limits.upper = this.batch;

	return limits;

}

dynamicTable.prototype.drawTable = function(){

	if(this.parentDiv.length > 0){

		this.parentDiv.empty();
	}

	if(Object.keys(this.data).length == 0 && Object.keys(this.headers).length == 0){


		throw "data variable can not be empty";

	}else{


		var table = document.createElement("table");
		table.className = "table table-striped table-bordered table-hover";
		table.id = "responsiveTable";
		var header = table.createTHead();

		var row = header.insertRow();

		var rowCount = 0;

		if(Object.keys(this.headers).length == 0){

			this.headerConstructor(row, this.data[0], this.colWidth, "key");

		}else{

			this.headerConstructor(row, this.headers, this.colWidth, "value");


		}

		var tbody = document.createElement("tbody");
		var headIndex = Object.keys(this.headers);


		for(var i = 0; i < this.data.length; i++){
			var tr = document.createElement("tr");

			for (var keyHeader in this.headers) {

				for(var keyData in this.data[i]){

					if(keyHeader == keyData){

						var td = document.createElement("td");
						if(typeof(this.data[i][keyData]) == "object"){

							if(this.data[i][keyData]){
								td.appendChild(this.data[i][keyData]);
							}

						}else{

							var span = document.createElement("span");
							span.className = "dynamicTableSpan";
							span.appendChild(document.createTextNode(this.data[i][keyData]));

							td.appendChild(span);

						}

						tr.appendChild(td);
					}
				}
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);

		// $('#'+table.id).DataTable({
                // responsive: true
        // });
		this.parentDiv.append(table);

		var pagerCont = document.createElement("div");
		pagerCont.className = "dataTables_paginate paging_simple_numbers";
		var pagerDiv = document.createElement("ul");


		var leftArrow = document.createElement("li");
		var rightArrow = document.createElement("li");

		pagerDiv.className = "pagination";


		leftArrow.className = "paginate_button previous aria-controls='dataTables-example'";
		rightArrow.className = "paginate_button next";

		leftArrow.innerHTML = '<a href="javascript:void(0)">Anterior</a>';
		rightArrow.innerHTML = '<a href="javascript:void(0)">Siguiente</a>';

		pagerDiv.appendChild(leftArrow);



		if(this.qty > this.batch){

			var qty = Math.ceil(this.qty/this.batch);
			if(qty == 0){

				qty = 1;
			}
			for(var i = 1; i <= qty; i++){
				var tmpPage = 0;
				if(this.page == 0){
					tmpPage = 1;
				}else{

					tmpPage = this.page;
				}
				var spanNumber = document.createElement("li");
				spanNumber.innerHTML = '<a href="javascript:void(0)">'+i+'</a>';

				if(i == tmpPage){

					spanNumber.className = "paginate_button";

				}else{

					spanNumber.className = "paginate_button";

					spanNumber.onclick = function(){

						methodLoad(this.innerHTML);
					}
				}

				pagerDiv.appendChild(spanNumber);


			}

		}else{

			var spanNumber = document.createElement("li");
			spanNumber.innerHTML = '<a href="javascript:void(0)">1</a>';
			spanNumber.className = "paginate_button";
			pagerDiv.appendChild(spanNumber);
		}


		pagerDiv.appendChild(rightArrow);
		pagerCont.appendChild(pagerDiv);
		this.parentDiv.append(pagerCont);

	}


}
