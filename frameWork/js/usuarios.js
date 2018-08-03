

var userType = "";
var currCent = "";


$(document).ready(function(){
	
	try{
		chkSECpermisos();
		loadTableCenter();
		userIni();
		centerIni();
		
		
	}catch(e){
		
		console.log(e);
	}
	
	
	
	
})





/////////////////////
//////CENTROS////////
/////////////////////



function chkSECpermisos(){
	
	sendAjax("seguridad","SECpermisos","",{}, function(response){
		
		if(response){
			
			$("#liCentros").removeClass("disabled");
			console.log("hola");
			
		}else{
			
			$(".disabled").click(function() {
		
			toastMsn("Acceso unico para usuarios SEC");
			return false;
			});	
			
		}
		
		
	})
}

function centerIni(){
	
	loadSectorList();
	
	$("#btnNewCenter").click(function(){
		cleanNewUser();
		$("#newCenterModal").modal();
		
		
	});
	
	$("#CreateNewCenter").click(createCenter);
	$("#editCenterBtn").click(editCenter);
	
	$("#generateKeyBtn").click(genKey);
	$("#searchCenter").click(loadTableCenter);
	
	
}

function genKey(){
	
	confirmMsn("¿Seguro desea generar una nueva Llave?", function(response){
		
		$("#modalAviso").modal('hide');
		info ={};
	
		info.KEY = $("#wsKey").val(); 
		
		info.CENTER = currCent;

		sendAjax("users", "generateKey", "",info,function(response){
					
			$("#wsKey").val(response.message); 
			toastMsn("Llave generada exitosamente");
		});
	
			
	});
	
}

function deletCenter(id){
	
	info = {};
	
	info.NIT = id;
	
	sendAjax("users","deleteCenter","",info,function(response){
		
		if(response.status){
			
			loadTableCenter();
			$("#modalAviso").modal('hide');
			toastMsn("Centro Eliminado Exitosamente");
			
		}else{
			
			$("#modalAviso").modal('hide');
			toastMsn("Se presentó un error, intentelo nuevamente");
			
		}
		
	});
	
}

function restoreCenter(id){
	
	info = {};
	
	info.NIT = id;
	
	sendAjax("users","restoreCenter","",info,function(response){
		
		if(response.status){
			
			loadTableCenter();
			$("#modalAviso").modal('hide');
			toastMsn("Centro Restaurado Exitosamente");
			
		}else{
			
			$("#modalAviso").modal('hide');
			toastMsn("Se presentó un error, intentelo nuevamente");
			
		}

		
		
	});
	
}

function serviceCenter(id){
	
	info = {};
	
	info.NIT = id;
	
	sendAjax("users","restoreServiceCenter","",info,function(response){
		
		if(response.status){
			
			loadTableCenter();
			$("#modalAviso").modal('hide');
			toastMsn("Suspención removida Exitosamente");
			
		}else{
			
			$("#modalAviso").modal('hide');
			toastMsn("Se presentó un error, intentelo nuevamente");
			
		}

		
		
	});
	
}



function editCenter(){
	
	

	var info ={};

	info.NIT = $("#editCenterNIT").val();
	info.DV = $("#editCenterDV").val();
	info.NAME = $("#editCenterName").val();
	info.ADDRESS = $("#editCenterDir").val();
	info.SECTOR = $("#editCenterSector").val();
	info.PHONE = $("#editCenterPhone").val();
	info.EMAIL = $("#editCenterEmail").val();

	
	
	if(info.NIT == ""){
		
		 notification("editCenterMsn", "El campos NIT es obligatorio", "danger");
		 
		return;
	}
	
	if(!verificar_DV_NIT(info.NIT+"-"+info.DV)){
		
		notification("editCenterMsn", "El nit no es válido", "danger");
		 
		return;
	}
	
	if(info.DV == ""){
		
		 notification("editCenterMsn", "El campos NIT es obligatorio", "danger");
		 
		return;
	}
	
	if(info.DV == ""){
		
		 notification("editCenterMsn", "El campos DV es obligatorio", "danger");
		 
		return;
	}
	
	
	if(info.CENTER == ""){
		
		notification("editCenterMsn", "El campos Nombre es obligatorio", "danger");
		
		return;
	}
	
	if(info.SECTORCENTER == ""){
		
		notification("editCenterMsn", "El campos Sector es obligatorio", "danger");
		
		return;
	}
	
	if(info.PHONECENTER == ""){
			
		notification("editCenterMsn", "El campos Teléfono es obligatorio", "danger");
		
		return;
	}
	
	if(info.ADDRECENTER == ""){
			
		notification("editCenterMsn", "El campos Dirección es obligatorio", "danger");
		
		return;
	}
	
	
	
	sendAjax("users","editCenter","",info,function(response){
			
			var data = response.message;
			if(response.status){
				$('#editCenterModal').modal('hide');
				loadTableCenter();
				
				toastMsn("Centro "+data["NIT"]+"-"+data["DV"]+" Actualizado Exitosamente");
				
				// notification("editCenterMsn", "Centro "+data["NIT"]+"-"+data["DV"]+" Actualizado Exitosamente", "success");
		
			}else{
				toastMsn("Se presento un error al acutalizar el centro "+data["NIT"]+"-"+data["DV"]);
				// notification("editCenterMsn", "Se presento un error al acutalizar el centro "+data["NIT"]+"-"+data["DV"], "danger");

			}
			
	});	
	
}

function clearNewCenter(){
	
	$("#NewCenterNIT").val("");
	$("#NewCenterDV").val("");
	$("#NewCenterName").val("");
	$("#NewCenterDir").val("");
	$("#NewCenterSector").val("");
	$("#NewCenterPhone").val("");
	$("#NewCenterEmail").val("");
	
}

function createCenter(){
	
	var info ={};

	info.NIT = $("#NewCenterNIT").val();
	info.DV = $("#NewCenterDV").val();
	info.CENTER = $("#NewCenterName").val();
	info.ADDRECENTER = $("#NewCenterDir").val();
	info.SECTORCENTER = $("#NewCenterSector").val();
	info.PHONECENTER = $("#NewCenterPhone").val();
	info.EMAILCENTER = $("#NewCenterEmail").val();

	
	
	if(info.NIT == ""){
		
		 notification("newCenterMsn", "El campo NIT es obligatorio", "danger");
		 
		return;
	}
	
	if(!verificar_DV_NIT(info.NIT+"-"+info.DV)){
		
		notification("newCenterMsn", "El nit no es válido", "danger");
		 
		return;
	}
	
	
	if(info.DV == ""){
		
		 notification("newCenterMsn", "El campo DV es obligatorio", "danger");
		 
		return;
	}
	
	
	if(info.CENTER == ""){
		
		notification("newCenterMsn", "El campo Nombre es obligatorio", "danger");
		
		return;
	}
	
	if(info.SECTORCENTER == ""){
		
		notification("newCenterMsn", "El campo Sector es obligatorio", "danger");
		
		return;
	}
	
	if(info.PHONECENTER == ""){
			
		notification("newCenterMsn", "El campo Teléfono es obligatorio", "danger");
		
		return;
	}
	
	if(info.ADDRECENTER == ""){
			
		notification("newCenterMsn", "El campo Dirección es obligatorio", "danger");
		
		return;
	}
	
	if(info.EMAILCENTER == ""){
			
		notification("newCenterMsn", "El campo Correo electrónico es obligatorio", "danger");
		
		return;
	}
	
	
	
	
	sendAjax("users","createCenter","",info,function(response){
			

			if(response.status){
				
				loadTableCenter();
				clearNewCenter();
				notification("newCenterMsn", response.message, "success");
		
			}else{

				notification("newCenterMsn", response.message, "danger");

			}
			
	});	
	
}

function loadSectorList(){
	
	sendAjax("masters","getSector","",{},function(response){
		
		if(response.status){

			var data = response.message;

			var newSector = document.getElementById("NewCenterSector");
			var editSector = document.getElementById("editCenterSector");
			var searchSector = document.getElementById("searchSector");
			
			newSector.innerHTML = "";
			editSector.innerHTML = "";
			searchSector.innerHTML = "";
			
			var newSectorOption = document.createElement("option");
			var editSectorOption = document.createElement("option");
			var searchSectorOption = document.createElement("option");
			
			newSectorOption.text = "";
			newSectorOption.value = "";
			newSector.appendChild(newSectorOption);
			
			editSectorOption.text = "";
			editSectorOption.value = "";
			editSector.appendChild(editSectorOption);
			
			searchSectorOption.text = "";
			searchSectorOption.value = "";
			searchSector.appendChild(searchSectorOption);

			for(var i = 0; i < data.length; i++){
				
				newSectorOption = document.createElement("option");
				newSectorOption.text = data[i].NAME;
				newSectorOption.value = data[i].CODE;
				
				newSector.appendChild(newSectorOption);
				
				editSectorOption = document.createElement("option");
				editSectorOption.text = data[i].NAME;
				editSectorOption.value = data[i].CODE;
				
				editSector.appendChild(editSectorOption);
				
				searchSectorOption = document.createElement("option");
				searchSectorOption.text = data[i].NAME;
				searchSectorOption.value = data[i].CODE;
				
				searchSector.appendChild(searchSectorOption);

				
				
			}
		}
		
	});
}

function loadTableCenter(page){
	
	if(typeof(page) === 'undefined'){
	  page = 0;
	};
	
	var table = new dynamicTable($("#centerTable"), loadTableCenter);
	
	var reloadTable = loadTableCenter;
	
	var info = {};
	info.NIT = $("#NITSearch").val();
	info.NAME = $("#centerNameSearch").val();;
	info.STATUS = $('input[name=centerStatus]:checked').val();;
	info.TYPE = $("#searchSector").val();
	
	info.limits = table.getLimits();
	
	sendAjax("users","getCenters","",info,function(response){
		
		
		var data = response.message;
		
		for(var i = 0; i < data.length; i++){
		
		
			var divBtns = document.createElement("div");
			var divActions = document.createElement("div");	
			
			divBtns.className = "divActionsBtn";

			var btnEdit = document.createElement("button");
			btnEdit.id = data[i].NIT;			
			btnEdit.title = "Editar";
			btnEdit.className = "btn btn-primary btn-circle";
			btnEdit.type = "button";
			btnEdit.innerHTML = '<i class="fa fa-edit"></i>';
			
			btnEdit.onclick = function(){
				
				var info = {};
				info.NIT = this.id;
				
				sendAjax("users","getCenter","",info,function(response){
					

					if(response.status){
						
						data = response.message[0];
						
						tmpNit = data["NIT"].split("-");						
						
						$("#editCenterSector").val(data["SECTOR"]);
						$("#editCenterNIT").val(tmpNit[0]);
						$("#editCenterDV").val(data["DV"]);
						$("#editCenterName").val(data["OFFICE"]);
						$("#editCenterDir").val(data["ADDRESS"]);
						$("#editCenterPhone").val(data["PHONE"]);
						$("#editCenterEmail").val(data["EMAIL"]);
						$("#editCenterName").val(data["NAME"]);
						$("#editCenterModal").modal();
					}
				});
			}
				
			divBtns.appendChild(btnEdit);
			
			if(data[i].STATUS == "1"){
				
				var btnDel = document.createElement("button");
				btnDel.id = data[i].NIT;			
				btnDel.title = "Eliminar";
				btnDel.className = "btn btn-danger btn-circle";
				btnDel.type = "button";
				btnDel.innerHTML = '<i class="glyphicon glyphicon-remove"></i>';
				 
				
				btnDel.onclick = function(){
					
					var centerNIT = this.id;
					
					confirmMsn("¿Seguro desea eliminar el centro "+this.id+"?", function(response){
						
						deletCenter(centerNIT); 
						
					});
						
					
				}
				
				divBtns.appendChild(btnDel);
			}
			
			if(data[i].STATUS == "2"){
				
				var btnDel = document.createElement("button");
				btnDel.id = data[i].NIT;			
				btnDel.title = "Remover suspención";
				btnDel.className = "btn btn-warning btn-circle";
				btnDel.type = "button";
				btnDel.innerHTML = '<i class="glyphicon glyphicon-plus-sign"></i>';
				 
				
				btnDel.onclick = function(){
					
					var centerNIT = this.id;
					
					confirmMsn("¿Seguro desea Remover la suspención del centro "+this.id+"?", function(response){
						
						serviceCenter(centerNIT); 
						
					});
						
					
				}
				
				divBtns.appendChild(btnDel);
			}
			
			if(data[i].STATUS == "0"){
				
				var btnRestore = document.createElement("button");
				btnRestore.id = data[i].NIT;			
				btnRestore.title = "Restaurar";
				btnRestore.className = "btn btn-success btn-circle";
				btnRestore.type = "button";
				btnRestore.innerHTML = '<i class="fa fa-undo"></i>';
				 
				
				btnRestore.onclick = function(){
					
					var centerNIT = this.id;
					
					confirmMsn("¿Seguro desea restaurar el centro "+this.id+"?", function(response){
						
						restoreCenter(centerNIT); 
						
					});
					
				}
				
				divBtns.appendChild(btnRestore);
			}
			
			var btnKey = document.createElement("button");
			btnKey.id = data[i].NIT;			
			btnKey.title = "Generar Llave";
			btnKey.className = "btn btn-info btn-circle";
			btnKey.type = "button";
			btnKey.innerHTML = '<i class="fa fa-key"></i>';
			 
			
			btnKey.onclick = function(){
				
				currCent = this.id;
				info.NIT = this.id;
				sendAjax("users","getKey","",info,function(response){
					// console.log(response);
					$("#wsKey").val(response.message.KEY_WS); 
					
					$("#keyCenterModal").modal();
					
				});
				
				
			}
			
			divBtns.appendChild(btnKey);

			data[i].ACTIONS = divBtns;
		} 
		//////////
		
		
		table.page = page;
		data.limits = table.getLimits();	
		table.data = data;
		table.qty = data.length;
				
		table.headers = {
			"NIT": "NIT",
			"SECTOR_ECO": "Sector",
			"NAME":"Nombre",
			"PHONE":"Teléfono",
			"EMAIL":"Email",		
			"ACTIONS": "Acciones"
		};
		try{
			
			table.drawTable();	
			
		}catch(e){
			
			// alertBox("Excepción",e);
			console.log(e);
		}
	
	});
	
}

/////////////////////
//////USUARIOS///////
/////////////////////

function userIni(){
	
	
	checkUswerType();
	loadTable();
	loadTypeUser();
	loadCenterUser();
	
	$("#searchUser").click(function(){
		loadTable();
		
		
	});
	
	$("#btnNewUser").click(function(){
		cleanNewUser();
		$("#newUserModal").modal();
		
		
	});
	
	$("#CreateNewUser").click(createUser);
	$("#editUser").click(editUser);
	
}

function editUser(){
	
	var info ={};

	info.ID = $("#EditUserID").val();
	info.NAMES = $("#EditUserName").val();
	info.SURNAMES = $("#EditUserSurname").val();
	
	info.OFFICE = $("#EditOfficeName").val();
	info.TYPE = $("#EditUserType").val();
	info.IND = $("#EditUserTelInd").val();
	info.PHONE = $("#EditUserTel").val();
	info.EMAIL = $("#EditUserEmail").val();

	if(userType){

		info.CENTER = $("#EditUserCenter").val();
 
	}

	
	if(info.ID == ""){
		
		 notification("editserMsn", "El campos ID es obligatorio", "danger");
		 
		return;
	}
	
	
	if(info.NAMES == ""){
		
		notification("editUserMsn", "El campos Nombre es obligatorio", "danger");
		
		return;
	}
	
	if(info.TYPE == ""){
		
		notification("editUserMsn", "El campos Tipo es obligatorio", "danger");
		
		return;
	}
	
	if(!validateEmail(info.EMAIL)){
			
		notification("editUserMsn", "Por favor ingrese un correo valido para el superadmin", "danger");
		
		return;
	}
	
	console.log(info);

	sendAjax("users","updateUser","",info,function(response){
			
			if(response.status){
				var data = response.message;
				
				loadTable();
				cleanNewUser();
				notification("editUserMsn", "Usuario "+data.ID+" Actualizado Exitosamente ", "success");
				
				

			}else{

				notification("editUserMsn", "Error al actualizar, intentelo más tarde", "danger");
				// console.log(response);
			}
			
	});	


}

function cleanNewUser(){

	$("#NewUserID").val("");
	$("#NewUserName").val("");
	$("#NewUserSurname").val("");
	$("#NewOfficeName").val("");
	$("#NewUserType").val("");
	$("#NewUserTelInd").val("");
	$("#NewUserPhone").val("");
	$("#NewUserEmail").val("");
	$("#NewUserPass").val("");
	$("#NewUserPassCheck").val("");
	$("#NewUserCenter").val("");

}

function checkUswerType(){
	
	sendAjax("users","getCurrentTypeUser","",{},function(response){
		
		if(response){
			
			userType = true;
			$("#newUserCenterCont").show();	
			$("#editUserCenterCont").show();	


		}else{
			userType = false;
			$("#newUserCenterCont").hide();	
			$("#editUserCenterCont").hide();	
		}
		
		loadCenterList();
	});
}

function createUser(){
	
	
	var info ={};

	info.ID = $("#NewUserID").val();
	info.NAMES = $("#NewUserName").val();
	info.SURNAMES = $("#NewUserSurname").val();
	
	info.OFFICE = $("#NewOfficeName").val();
	info.TYPE = $("#NewUserType").val();
	info.IND = $("#NewUserTelInd").val();
	info.PHONE = $("#NewUserPhone").val();
	info.EMAIL = $("#NewUserEmail").val();
	
	
	if(userType){

		info.CENTER = $("#NewUserCenter").val();

	}
	

	info.PASS = $("#NewUserPass").val();
	info.PASSCHK = $("#NewUserPassCheck").val();
	

	if(info.ID == ""){
		// console.log("hola");
	// return;
		 notification("newUserMsn", "El campos ID es obligatorio", "danger");
		 
		return;
	}
	
	
	if(info.NAMES == ""){
		
		notification("newUserMsn", "El campos Nombre es obligatorio", "danger");
		
		return;
	}
	
	if(info.TYPE == ""){
		
		notification("newUserMsn", "El campos Tipo es obligatorio", "danger");
		
		return;
	}
	
	if(!validateEmail(info.EMAIL)){
			
		notification("newUserMsn", "Por favor ingrese un correo valido para el superadmin", "danger");
		
		return;
	}
	
	if(!validatePass(info.PASS)){
		
		notification("newUserMsn", "La contraseña debe tener entre 6 y 20 caracteres", "danger");
		
		return;
	}
	
	if(info.PASS != info.PASSCHK){
			
			notification("newUserMsn", "Las contraseñas no coinciden", "danger");
			
			return;
	}
	
	
	
	sendAjax("users","addUsers","",info,function(response){
			
			
			// return;
			if(response.status){
				loadTable();
				cleanNewUser();
				notification("newUserMsn", response.message, "success");
		
				

			}else{

				notification("newUserMsn", response.message, "danger");

			}
			
	});	


}

function loadCenterList(){
	
	
	if(userType){
		

		$("#newUserCenterCont").show();
		$("#EditUserCenter").show();
		
	}else{
		
		
		$("#newUserCenterCont").hide();
		$("#EditUserCenter").hide();
		
	}
	
	sendAjax("users","getCenterList","",{},function(response){

		
	});
	
}

function loadCenterUser(){
	
	sendAjax("users","getCenterList","",{},function(response){
		
		if(response.status){

			var data = response.message;

			var editCenter = document.getElementById("EditUserCenter");
			var NewCenter = document.getElementById("NewUserCenter");
			
			editCenter.innerHTML = "";
			NewCenter.innerHTML = "";
			
			var editCenterOption = document.createElement("option");
			var NewCenterOption = document.createElement("option");
			
			editCenterOption.text = "";
			editCenterOption.value = "";
			
			NewCenterOption.text = "";
			NewCenterOption.value = "";

			
			editCenter.appendChild(editCenterOption);
			NewCenter.appendChild(NewCenterOption);
			
			
			for(var i = 0; i < data.length; i++){
				
				editCenterOption = document.createElement("option");
				editCenterOption.text = data[i].NAME;
				editCenterOption.value = data[i].NIT;
				
				editCenter.appendChild(editCenterOption);
				
				NewCenterOption = document.createElement("option");
				NewCenterOption.text = data[i].NAME;
				NewCenterOption.value = data[i].NIT;
				
				NewCenter.appendChild(NewCenterOption);

				
				
			}
		}
		
	});
	
}

function loadTypeUser(){
	
	
	sendAjax("users","getTypeUser","",{},function(response){

		var data = response.message;
		
		var search = document.getElementById("searchTipo");
		var NewUserType = document.getElementById("NewUserType");
		var EditUserType = document.getElementById("EditUserType");
		
		search.innerHTML = "";
		NewUserType.innerHTML = "";
		EditUserType.innerHTML = "";
		
		var searchOption = document.createElement("option");
		// var newUserOption = document.createElement("option");
		var editUserOption = document.createElement("option");
		
		
		searchOption.text = "";
		searchOption.value = "";
		editUserOption.value = "";
		
		// newUserOption.text = "";
		// newUserOption.value = "";
		editUserOption.value = "";
		
		search.appendChild(searchOption);
		// NewUserType.appendChild(newUserOption);
		EditUserType.appendChild(editUserOption);
		
		
		
		for(var i = 0; i < data.length; i++){
			
			searchOption = document.createElement("option");
			searchOption.text = data[i].NAME;
			searchOption.value = data[i].CODE;
			
			search.appendChild(searchOption);
			
			newUserOption = document.createElement("option");
			newUserOption.text = data[i].NAME;
			newUserOption.value = data[i].CODE;
			
			NewUserType.appendChild(newUserOption);
			
			editUserOption = document.createElement("option");
			editUserOption.text = data[i].NAME;
			editUserOption.value = data[i].CODE;
			
			EditUserType.appendChild(editUserOption);
			
			
		}
		
	});
}

function deletUser(id){
	
	info = {};
	
	info.ID = id;
	
	sendAjax("users","deleteUser","",info,function(response){
		
		if(response.status){
			
			loadTable();
			$("#modalAviso").modal('hide');
			toastMsn("Usuario Eliminado Exitosamente");
			
		}else{
			
			$("#modalAviso").modal('hide');
			toastMsn("Se presentó un error, intentelo nuevamente");
			
		}
		
	});
	
}

function restoreUser(id){
	
	info = {};
	
	info.ID = id;
	
	sendAjax("users","restoreUser","",info,function(response){
		
		if(response.status){
			
			loadTable();
			$("#modalAviso").modal('hide');
			toastMsn("Usuario Restaurado Exitosamente");
			
		}else{
			
			$("#modalAviso").modal('hide');
			toastMsn("Se presentó un error, intentelo nuevamente");
			
		}

		
		
	});
	
}

function loadTable(page){
	
	if(typeof(page) === 'undefined'){
	  page = 0;
	};
	
	

	var table = new dynamicTable($("#usersTable"), loadTable);
	
	var reloadTable = loadTable;

	var info = {};
	info.ID = document.getElementById("IDSearch").value;
	info.STATUS = $('input[name=optradio]:checked').val();
	info.NAMES = document.getElementById("NameSearch").value;
	info.SURNAME = document.getElementById("surnameCenterSearch").value;
	info.TYPE = document.getElementById("searchTipo").value;
	info.limits = table.getLimits();
	


	sendAjax("users","getUsersList","",info,function(response){
		
	
	
		var data = response.message.info;
			
		for(var i = 0; i < data.length; i++){
			
		var divBtns = document.createElement("div");
		var divActions = document.createElement("div");	
		
		divBtns.className = "divActionsBtn";
		//////
		var btnEdit = document.createElement("button");
			btnEdit.id = data[i].ID;			
			btnEdit.title = "Editar";
			btnEdit.className = "btn btn-primary btn-circle";
			btnEdit.type = "button";
			btnEdit.innerHTML = '<i class="fa fa-edit"></i>';
			 
			
			btnEdit.onclick = function(){
				
				var info = {};
				info.ID = this.id;
				
				sendAjax("users","getUser","",info,function(response){

					if(response.status){

						data = response.message[0];
						
						$("#EditUserID").val(data["ID"]);
						$("#EditUserName").val(data["NAMES"]);
						$("#EditUserSurname").val(data["SURNAMES"]);
						$("#EditOfficeName").val(data["OFFICE"]);
						$("#EditUserType").val(data["TYPE"]);
						$("#EditUserCenter").val(data["CENTER"]);
						$("#EditUserTelInd").val(data["IND1"]);
						$("#EditUserTel").val(data["TEL1"]);
						$("#EditUserEmail").val(data["EMAIL"]);

						$("#editUserModal").modal();
					}
					

				});
				
				
				
			
			
			}
				
			divBtns.appendChild(btnEdit);

		
		if(data[i].STATUS == "1"){

			var btnDel = document.createElement("button");
			btnDel.id = data[i].ID;			
			btnDel.title = "Eliminar";
			btnDel.className = "btn btn-danger btn-circle";
			btnDel.type = "button";
			btnDel.innerHTML = '<i class="glyphicon glyphicon-remove"></i>';

			divBtns.appendChild(btnDel);

			btnDel.onclick = function(){
				
				
				var userId = this.id;
				
				confirmMsn("¿Seguro desea eliminar el usuario "+this.id+"?", function(response){
					
					deletUser(userId); 
					
				});
					
				
				

			}
		}
		if(data[i].STATUS == "0"){
			
			var btnRestore = document.createElement("button");
			btnRestore.id = data[i].ID;			
			btnRestore.title = "Restaurar";
			btnRestore.className = "btn btn-success  btn-circle";
			btnRestore.type = "button";			
			btnRestore.innerHTML = '<i class="fa fa-undo "></i>';

			divBtns.appendChild(btnRestore);

			btnRestore.onclick = function(){
				
				
				var userId = this.id;
				
				confirmMsn("¿Seguro desea restaurar el usaurio "+this.id, function(){
					 
					restoreUser(userId); 
			});
					
				
				

			}
			
		}	
			//fin
			divActions.appendChild(divBtns);
			data[i].ACTIONS = divActions;
		}
		//////////
				
		table.page = page;
		data.limits = table.getLimits();	
		table.data = data;
		table.qty = data.length;
		

		if(userType){
			
			table.headers = {
				"ID": "ID",
				"CENTER": "Centro",
				"NAMES":"Nombre",
				"SURNAMES":"Apellidos",
				"NAME":"Tipo de usuario",		
				"ACTIONS": "Acciones"
			};
			
		}else{
			
			table.headers = {
				"ID": "ID",
				"NAMES":"Nombre",
				"SURNAMES":"Apellidos",
				"NAME":"Tipo de usuario",		
				"ACTIONS": "Acciones"
			};
			
		}
		
		
		
		try{
			
			table.drawTable();	
			
		}catch(e){
			
			
			console.log(e);
		}
	
	});
	
}




