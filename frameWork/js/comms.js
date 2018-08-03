
//VALIDACIONES//
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//MODALES//
function toastMsn(msn){
	
	$("#toastText").html(msn);
	$('#toastMsn').stop().fadeIn(400).delay(2000).fadeOut(400); //fade out after 2 seconds
	
}

function confirmMsn(message, action){

	$("#aceptModal").show();
	document.getElementById("aceptModal").onclick = function(){		
		action();		
	};
	 
	$("#msnContent").html(message);
	$("#modalAviso").modal();
	
}

function alertMsn(message){

	$("#aceptModal").hide();
	$("#aceptModal").click(null);
	$("#msnContent").html(message);
	$("#modalAviso").modal();

}

//SEGURIDAD///
function permission(){
	
	
post_comm("seguridad", "chkSecurity", {}, function(response){
					
	if(response.status){
		for(var i=0; i<response.message.length;i++){
		permisos[i] = response.message[i].OBJECT;

		}
		
		changeDisableClass();
		chkSECpermisos();
	
		}else{
								
		}
	
					
	});
	
}

function chkSecurity(cod){
	
		for(var i=0; i< permisos.length; i++){
			if(permisos[i]==cod){
				
				return true;
			}
		}
		return false;
}

function changeDisableClass(){
	
	for(i=0;i<permisos.length;i++){
			
		switch(permisos[i]) {
				
				case "1000":
				
				$("#analisisLink").removeClass("disabled");
					
				break;
				
				case "2000":
				
				$("#formularioLink").removeClass("disabled");
					
				break;
				
				case "3000":
				
				$("#clienteLink").removeClass("disabled");
					
				break;
				
				case "4000":
				
				$("#solicitudLink").removeClass("disabled");
					
				break;
				
				case "5000":
				
				$("#usuariosLink").removeClass("disabled");
					
				break;
				
				case "6000":
				
				$("#seguridadLink").removeClass("disabled");
					
				break;
				
				case "7000":
				
				$("#liConfig").removeClass("disabled");
					
				break;
				
				
			
		}
		
		
	}
}

//INTERFACES
function loadInterface(target){
	
	
	
	post_comm("api","getInterface",target,function(response){
		
		
		var data = response.message;
		target = data.target;

		$("#page-wrapper").html(data.html);
		

		$.getScript( "frameWork/js/"+target+".js", function( data, textStatus, jqxhr ) {
				  
		  $('head').append('<link rel="stylesheet" href="frameWork/estilos/'+target+'.css?version='+Math.random()+'" type="text/css" />');
 
		});
		
		
	});

}

function loadState(logged){


	if(logged){
		var target = document.location.href.split("#");
		if(target.length > 1){
			if(target[1] == "" || target[1] == "login"){
				
				history.replaceState({}, "home", "#home");
				loadInterface("home");
			}else{
				
				var longUrl = "";
				
				for(var i = 1; i < target.length; i++){
					
					if(i > 1){
						longUrl = longUrl+"#"+target[i];
						
					}else{
						
						longUrl = longUrl+target[i];
					}
					
				}
				
				history.pushState({}, target, "#"+longUrl);
				
				loadInterface(target[1]);
			}

		}else{
			
			history.pushState({}, "home", "#home");
			loadInterface("home");
		}

		
	}else{
		
		history.replaceState({},"login","");
	}
	
}


//COMUNICACIONES

//////////////////////////////
///unicode problem solution///
//////////////////////////////
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
//////////////////////////////
///unicode problem solution/// 
/////////////////////////////

function post_comm(classes, method, data, responseFunction){

	 var info = {};
	 info.class = classes;
	 info.method = method;
	 info.data = data;
	 
	$.ajax({
		type: 'POST',
		url: 'frameWork/php/server.php',
		contentType: 'application/json',
		data: b64EncodeUnicode(JSON.stringify(info)),
		cache: false,
		success: function(data){
			
			 try{
				
				data = b64DecodeUnicode(data);
				
				var tmpJson = $.parseJSON(data);
				
				if(tmpJson.exception != ""){
					
					if(tmpJson.data == "0000"){
				
						logOut();
						return;						
					}
					console.log(tmpJson.exception);
					return;
				}else{
					
					responseFunction(tmpJson.data);  
					
				}
			 }catch(e){
				
				 console.log(data);
				 console.log(e);
			 }
			 
		},
		
		error: function( jqXhr, textStatus, errorThrown ){ 
			console.log( errorThrown ); 
		}

	})
	
   

}
	
	
