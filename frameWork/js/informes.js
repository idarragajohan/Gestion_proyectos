$(document).ready(function(){


//fechas

	sendAjax("informes","checkTypeUser","",{},function(response){

		//console.log(response);

		if(response == "5"  || response == "6" || response == "7"){

			var type = document.getElementById("informeType");

			var option = document.createElement("option");
			option.text = "";
			option.value = "";

			type.appendChild(option);

			var select = document.createElement("option");
			select.text = "Información del Crédito";
			select.value = "informacion";
			type.appendChild(select);

			var select = document.createElement("option");
			select.text = "Estudio de Crédito";
			select.value = "estudio";
			type.appendChild(select);

			var select = document.createElement("option");
			select.text = "información de analistas";
			select.value = "analista";
			type.appendChild(select);

		}

		if(response == "2"){

			document.getElementById("boxEstado").style.display ="none";

			var type = document.getElementById("informeType");

			var option = document.createElement("option");
			option.text = "";
			option.value = "";

			type.appendChild(option);

			var select = document.createElement("option");
			select.text = "Información de creditos";
			select.value = "creditos";
			type.appendChild(select);

			var select = document.createElement("option");
			select.text = "Información de Clientes";
			select.value = "clientes";
			type.appendChild(select);

			var select = document.createElement("option");
			select.text = "Estudio de Crédito";
			select.value = "estudio";
			type.appendChild(select);

			try{
				$('.date').each(function(){
						$(this).datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM',
							locale: 'es'
						});

					});

				}catch(e){
					console.log(e);
				}

		}



		var target = document.location.href.split("#");

		if(target.length > 2){

			console.log(target);

			drawInformeTable("",target);

		}
	})
})

//cambio de filtros segun el informe
document.getElementById("informeType").onchange = function(){

	var type = $("#informeType").val();

	if(type == "analista"){
		document.getElementById("boxEstado").style.display ="none";


		$("#inp_dateIni").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});
		$("#inp_dateEnd").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});

	}

	if(type == "informacion"){
		document.getElementById("boxEstado").style.display ="inline";


		$("#inp_dateIni").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});
		$("#inp_dateEnd").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});
	}

	if(type == "estudio"){

		document.getElementById("boxEstado").style.display ="inline";

		$("#inp_dateIni").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});

		$("#inp_dateEnd").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});

	}

	if(type == "creditos"){

		document.getElementById("boxEstado").style.display ="none";

		$("#inp_dateIni").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});

		$("#inp_dateEnd").datetimepicker({
							defaultDate: 'moment',
							format: 'YYYY/MM/DD',
							locale: 'es'
						});

	}

}

//boton buscar informe
document.getElementById("buttonInformes").onclick = function(){

	drawInformeTable();

}

//boton descargar informe
document.getElementById("buttonDownload").onclick = function(){

	var info={};
	info.TYPE = $("#informeType").val();
	info.DATEINI = $("#inp_dateIni").val();
	info.DATEEND = $("#inp_dateEnd").val();
	info.STATUS = $("#estadoInfo").val();

	if(info.TYPE == ""){
		toastMsn("Debe seleccionar un tipo de informe");
		return;
	}

	sendAjax("informes","downloadInforme","",info,function(response){
		// console.log(response);

		var data = document.getElementById("informeInfo");
		var name = document.getElementById("informeName");

		name.value = "Informe_de_"+info.TYPE;
		data.value = JSON.stringify(response.message);

		var form = document.getElementById("formReports");
		form.action = "http://"+window.location.host+"/"+response.server+'/frameWork/php/csvDownload.php';

			// return;
		form.submit();


	});

}

//boton de grafica
document.getElementById("graficaTorta").onclick = function(){

	var info ={};
	info.TYPE = $("#informeType").val();
	info.DATEINI = $("#inp_dateIni").val();
	info.DATEEND = $("#inp_dateEnd").val();
	info.STATUS = $("#estadoInfo").val();

	sendAjax("informes","getGraphPie","",info, function(response){

		// console.log(response);


		var data = response.message;
		var sum = response.sum;
		if(sum == 0){
			toastMsn("No hay datos que mostrar");
			return;
		}

		$("#popUpGraph").modal("show");

		$.plot('#placeholder', data, {
			series: {
				pie: {
					show: true,
					radius: 1,
					label: {
						show: true,
						radius: 1,
						 formatter: function(label,point){
							return(point.percent.toFixed(2) + '%');
							}
					}
				}
			},
			legend: {
				show: true
			}
		});

	});


}

//informe
document.getElementById("yaDinero").onclick = function(){

sendAjax("informes","getYadinero","",{},function(response){
	// console.log(response);


	var data = document.getElementById("informeInfo");
	var name = document.getElementById("informeName");

		name.value = "informe solicitudes";
		data.value = JSON.stringify(response.message);

		var form = document.getElementById("formReports");
		form.action = "http://"+window.location.host+"/"+response.server+'/frameWork/php/csvDownload.php';

		form.submit();
})

}

////TABLA INFORMES JEFE FABRICA

function drawInformeTable(page, target){


	if(typeof(page) === 'undefined'){
	  page = 0;
	};
	if(typeof(target) === 'undefined'){
	  target = 0;
	};

	var table = new dynamicTable($("#informesTable"), drawInformeTable);

	var info ={};
	info.TYPE = $("#informeType").val();
	info.DATEINI = $("#inp_dateIni").val();
	info.DATEEND = $("#inp_dateEnd").val();
	info.STATUS = $("#estadoInfo").val();

	info.limits = table.getLimits();


	if(target != 0){

		if(target[2] == "fabrica" && target[3] == "mes"){

			info.TYPE = "analista";
			info.TARGET = target;

		}

		if(target[2] == "fabrica" && target[3] == "dia"){

			info.TYPE = "informacion";
			info.TARGET = target;

		}

		if(target[2] == "gerencia" && target[3] == "mes"){

			info.TYPE = "creditos";
			info.TARGET = target;

		}

		if(target[2] == "gerencia" && target[3] == "dia"){

			info.TYPE = "creditos";
			info.TARGET = target;

		}

	}


	if(info.TYPE == ""){
		toastMsn("Debe seleccionar un tipo de informe");
		return;
	}

	// console.log(info);
	sendAjax("informes","getReportes","",info, function(response){

		console.log(response);

		var data = response.message.data;
		$("#dataQty").html(response.message.qty);
		if(info.TYPE == "estudio"){

			for(i=0;i<data.length;i++){

				if(data[i].TOTAL_TIME == null){
					data[i].TOTAL_TIME = "N/A";
				}

				var divActions = document.createElement("div");

				var divBtns = document.createElement("div");

				divBtns.className = "divActionsBtn";
			//////boton simulador
			var btnSimulador = document.createElement("button");
				btnSimulador.id = data[i].SOLICITUD_ID;
				btnSimulador.title = "Info. Definición";
				btnSimulador.className = "btn btn-primary btn-circle";
				btnSimulador.type = "button";
				btnSimulador.innerHTML = '<i class="fa fa-gears"></i>';

				btnSimulador.onclick = function(){

					var info = {};
					info.ID = this.id;

					sendAjax("informes","infoSimulador","",info, function(response){
						// console.log(response);
						var data = response.message;
						loadInformeSimPop(data);
						$("#myModalLabel").html("INFORMACION DETALLADA DEL CREDITO");
					})
				}

				divBtns.appendChild(btnSimulador);



			/////// boton fabrica
			var btnFabrica = document.createElement("button");
				btnFabrica.id = data[i].SOLICITUD_ID;
				btnFabrica.title = "Info. Fabrica";
				btnFabrica.className = "btn btn-primary btn-circle";
				btnFabrica.type = "button";
				btnFabrica.innerHTML = '<i class="fa fa-building-o"></i>';

				btnFabrica.onclick = function(){

					var info = {};
					info.ID = this.id;

					sendAjax("informes","infoFabrica","",info, function(response){
						// console.log(response);
						var data = response.message;
						loadInformeFabPop(data);
						$("#myModalLabel").html("INFORMACION DETALLADA DE FABRICA");
					})
				}


				divBtns.appendChild(btnFabrica);

/////// boton Codeudores
			var btnCood = document.createElement("button");
				btnCood.id = data[i].SOLICITUD_ID;
				btnCood.title = "Info. Codeudores";
				btnCood.className = "btn btn-primary btn-circle";
				btnCood.type = "button";
				btnCood.innerHTML = '<i class="fa fa-child"></i>';

				btnCood.onclick = function(){

					var info = {};
					info.ID = this.id;

					sendAjax("informes","infoCood","",info, function(response){
						console.log(response);
						var data = response.message;
						loadInformeCoodPop(data);
						$("#myModalLabel").html("INFORMACION DETALLADA DE CODEUDORES");
					})
				}


				divBtns.appendChild(btnCood);

				//fin
				divActions.appendChild(divBtns);
				data[i].ACTIONS = divActions;
			}

		}

		var qty = response.message.qty;

		if(info.TYPE == "creditos" || info.TYPE == "clientes"){

			qty = data.length;

		}

		table.page = page;
		data.limits = table.getLimits();
		table.data = data;
		table.qty = qty;

		if(info.TYPE == "informacion"){

			if(target != 0){

				if(target[2] == "fabrica" && target[3] == "dia"){

					$("#informeType").val("informacion");
					$("#informeType").trigger("change");
					$("#inp_dateIni").val(response.message.dateIni);
					$("#inp_dateEnd").val(response.message.dateEnd);

				}

			}

			table.headers = {
				"CREATION_DATE": "FECHA",
				"SOLICITUD_ID": "SOLICITUD",
				"USER": "ANALISTA",
				"OFFICE": "OFICINA",
				"DATE_DEFINICION": "FECHA DEFINICION",
				"DOC_NUM":"CEDULA",
				"CLIENT_TYPE":"TIPO DE CLIENTE",
				"STATUS":"ESTADO",
				"DENIAL_TYPIFICATION":"TIPIFICACION",
				"COOD1":"CEDULA CODEUDOR1",
				"COOD2":"CEDULA CODEUDOR2",
				"VALUE":"VALOR SOLICITADO"

			};
		}

		if(info.TYPE == "estudio"){
			table.headers = {
				"CREATION_DATE": "FECHA CREACION",
				"SOLICITUD_ID": "SOLICITUD",
				"DOC_NUM":"CEDULA",
				"STATUS":"ESTADO",
				"DENIAL_TYPIFICATION":"TIPIFICACION",
				"PLAZO":"PLAZO",
				"CITY":"CIUDAD",
				"OFFICE":"ALMACEN",
				"VALUE":"VALOR SOLICITADO",
				"DATE_REGIS":"FECHA ASIGNACION",
				"DATE_DEFINICION_INI":"FECHA DEFINICION INICIAL",
				"DATE_DEFINICION":"FECHA DEFINICION",
				"TOTAL_TIME":"TIEMPO EN FABRICA",				
				"ACTIONS":"ACCIONES"
			};
		}

		if(info.TYPE == "creditos"){

			$("#informeType").val("creditos");
			$("#informeType").trigger("change");
			$("#inp_dateIni").val(response.message.dateIni);
			$("#inp_dateEnd").val(response.message.dateEnd);


			table.headers = {
				"CREATION_DATE": "MES",
				"TOTAL":"TOTAL CREDITOS",
				"APROBADO":"APROBADO  %",
				"NEGADO":"NEGADO   %",
				"PENDIENTE":"PENDIENTE  %"
			};
		}

		if(info.TYPE == "clientes"){
			table.headers = {
				"SOLICITUD_DATE": "MES",
				"TOTAL":"TOTAL CLIENTES",
				"CLIENTE_NUEVO":"NUEVO  %",
				"CLIENTE_PREFERENCIAL":"PREFERENCIAL  %",
				"CLIENTE_RENOVACION":"RENOVACION  %"
			};
		}

		if(info.TYPE == "analista"){

			if(target != 0){

				if(target[2] == "fabrica" && target[3] == "mes"){

					$("#informeType").val("analista");
					$("#informeType").trigger("change");
					$("#inp_dateIni").val(response.message.dateIni);
					$("#inp_dateEnd").val(response.message.dateEnd);

				}

			}

			table.headers = {
				"USER": "ID",
				"NAMES":"ANALISTA",
				"APROBADO":"APROBADO",
				"NEGADO":"NEGADO",
				"PENDIENTE":"PENDIENTE",
				"TOTAL":"TOTAL"
			};
		}



		try{

			table.drawTable();

		}catch(e){


			console.log(e);
		}


	});



}


//Pop Up con informacion detallada del los informes de estudio
function loadInformeSimPop(data){


	if(typeof(page) === 'undefined'){
	  page = 0;
	};

	var table = new dynamicTable($("#infoTablePop"), loadInformeSimPop);


		table.page = page;
		data.limits = table.getLimits();
		table.data = data;
		table.qty = data.length;


		table.headers = {
			"SALIDAS": "DETALLE",
			"VALUE": "VALOR"
		};

		try{

			table.drawTable();

		}catch(e){


			console.log(e);
		}

	$("#popUpInfoDetail").modal("show");

}

//Pop Up con informacion detallada del los informes de estudio
function loadInformeFabPop(data){


	if(typeof(page) === 'undefined'){
	  page = 0;
	};

	var table = new dynamicTable($("#infoTablePop"), loadInformeFabPop);
		console.log(data);
		for(i=0;i<data.length;i++){

			if(data[i].NAMES == null){
			  data[i].NAMES = "N/A";

			};
			if(data[i].ASIGNACION_TIME == null){
			  data[i].ASIGNACION_TIME = "N/A";
			};
			if(data[i].ANALISIS_TIME == null){
			  data[i].ANALISIS_TIME = "N/A";
			};
			if(data[i].PRUEBAS_TIME == null){
			  data[i].PRUEBAS_TIME = "N/A";
			};
			if(data[i].REFERENCES_TIME == null){
			  data[i].REFERENCES_TIME = "N/A";
			};
			if(data[i].DEFINITION_TIME == null){
			  data[i].DEFINITION_TIME = "N/A";
			};
			if(data[i].TOTAL == null){
			  data[i].TOTAL = "N/A";
			};
		}


		table.page = page;
		data.limits = table.getLimits();
		table.data = data;
		table.qty = data.length;


		table.headers = {
			"USER": "ID_USUARIO",
			"ASIGNACION_TIME": "TIEMPO EN ASIGNACION",
			"ANALISIS_TIME": "TIEMPO EN ANALISIS",
			"PRUEBAS_TIME": "TIEMPO EN PRUEBAS",
			"REFERENCES_TIME": "TIEMPO EN REFERENCIAS",
			"DEFINITION_TIME": "TIEMPO EN DEFINICION",
			"TOTAL": "TIEMPO TOTAL"
		};

		try{

			table.drawTable();

		}catch(e){


			console.log(e);
		}

	$("#popUpInfoDetail").modal("show");

}

//Pop Up con informacion detallada del los informes de estudio
function loadInformeCoodPop(data){


	if(typeof(page) === 'undefined'){
	  page = 0;
	};

	var table = new dynamicTable($("#infoTablePop"), loadInformeCoodPop);
		console.log(data);
		for(i=0;i<data.length;i++){

			if(data[i].SALIDAS == null){
			  data[i].SALIDAS = "N/A";

			};
			if(data[i].VALUE == null){
			  data[i].VALUE = "N/A";
			};
			
		}


		table.page = page;
		data.limits = table.getLimits();
		table.data = data;
		table.qty = data.length;


		table.headers = {
			"COOD_DOC_NUM": "CEDULA CODEUDOR",
			"SALIDAS": "VARIABLE",
			"VALUE": "RESPUESTA DEL SIM"
		};

		try{

			table.drawTable();

		}catch(e){


			console.log(e);
		}

	$("#popUpInfoDetail").modal("show");

}
