var target = document.location.href.split("#");

load();


function load(){
	
	chkLogin();
	
}

window.onpopstate = function(){
	
	
	chkLogin();
	
}



$("#homeLink").click(function(){
	
	history.replaceState({},"home","#home");
	loadInterface("home");
		
});

$("#usuariosLink").click(function(){
			
	history.replaceState({},"usuarios","#usuarios");
	loadInterface("usuarios");
	
});


$("#logOut").click(function(){
	
	logOut();
		
});

$("#loginBtn").click(function(){
	
	login();
});

$("#userPssw").keypress(function(event) {
		if ( event.which == 13 ) {
			event.preventDefault();
			login();
		}
	});

$("#recoverPass").click(function(){
	$("#oldPass").val("");
	$("#NewPass").val("");
	$("#ChkNewPass").val("");
	
	$("#passAviso").modal("show");
	
})

$("#updatePass").click(function(){
	
	var pass = $("#oldPass").val();
	var newPass = $("#NewPass").val();
	var chkPass = $("#ChkNewPass").val();
	
	
	
	if(pass == ""){
		toastMsn("ingrese su antigua contraseña");
	}
	if(newPass == ""){
		toastMsn("ingrese su nueva contraseña");
	}
	if(chkPass == ""){
		toastMsn("ingrese de nuevo su nueva contraseña");
	}
	
	if(newPass != chkPass){
		
		toastMsn("La contraseña nueva no coincide");
	}
	
	var info ={};
	info.OLD = pass;
	info.NEW = newPass;
	post_comm("users","updatePass", info,function(response){
		
		if(response.status){
			toastMsn(response.message);
			$("#passAviso").modal("hide");
		}else{
			toastMsn(response.message);
		}
		
	});
	
})
	
$("#recoverPassEmail").click(function(){
	
	var info = {};
	info.EMAIL = $("#emailRecover").val();
		
	if(validateEmail(info.EMAIL)){		
		
		
		post_comm("users","recoverPass", info, function(response){
			console.log(response);
			if(response.status){
				toastMsn(response.message);
				$("#modalForgotPass").modal("hide");
				
			}else{
				toastMsn(response.message);
			}
			
			
		});
		
	}else{
		
		toastMsn("Ingrese un email valido");
	}
	
	
	
})	
	
$("#forgetPass").click(function(){
	$("#emailRecover").val("");
	$('#modalForgotPass').modal('show');
	
	
})


function login(){
	
	// logged = true;
	var info = {};
	info.USER = $("#userLogin").val();
	info.PSSW = $("#userPssw").val();
	
	if(info.user == ""){
		
		console.log("Debe escribir un usuario");
		return;
	}
	if(info.pssw == ""){
		
		// alertBox("Advertencia","Debe escribir una contraseña");
		console.log("Debe escribir una contraseña");
		return;
		
	}
	
	
	post_comm("users","login", info,function(response){
		
		console.log(response);
		
		if(response.status){
			
			
			chkLogin();
			$("#userLogin").val("");
			$("#userPssw").val("");
			
		}else{
			
			$("#loginError").show();
			$("#infoLabelLogin").html(response.message);
			$("#userPssw").val("");
			
		}
	});
	
	 
}

$("#closeAlert").click(function(){
	
	$("#loginError").hide();
	
})

function chkLogin(){
	
	post_comm("users","chkLogin", {},function(response){
		
		if(response.status){
			
			permission();
			loadPages();
			loadState(true);
			chkCenter();
		}else{
			loadLogin();
			loadState(false);
		}		
	});	
}

function loadLogin(){
	
	$("#login-wrapper").show();
	$("#wrapper").hide();
	
}

function logOut(){
	// logged = false;
	post_comm("users","logOut", {},function(response){
		
		history.replaceState({}, '', "#login");
		// $(".loginDiv").show();
		// $(".overlay").hide();
		chkLogin();
		permisos =[];
	});
	
	
}

function loadPages(){
	
	$("#wrapper").show();
	$("#login-wrapper").hide();
		
}







