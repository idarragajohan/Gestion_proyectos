
function validarOperation(value){
	
	var patron = /^(-?\d+(\.\d+)?)(\+|-|\*|\/)(\d+(\.\d+)?|\(-\d+(\.\d+)?\))$/;
	return patron.test(value);
	
}

function enteroValidar(numero){
	

	var patron = /^\d*$/;                          //Expresión regular para aceptar solo números enteros
									   //Variable a analizar
		if ( !patron .test(numero)) {              //Este método regresa tru si la cadena coincide con el patrón definido en la expresión regular

			return false;

			}else {

		return true;

	}

}

function validatePass(pass){
	
	var re = /^\d{6,20}$/;
	return re.test(pass);
	
}

function setDeptos(depto, city){
	
	depto.innerHTML = "";
	var option = document.createElement("option");
	option.text = "";
	option.value = "";
	depto.appendChild(option);

	post_comm("masters", "getDeptos", {}, function(response){
		var data = response.message;		
		if(response.status){
			for(var i = 0; i<data.length;i++){
				var option = document.createElement("option");
				option.text = data[i].NAME;
				option.value = data[i].DEPTO;
				depto.appendChild(option);
			}
			
		}
		
	});
	
	depto.onchange = function(){
		setCity(depto.value, city);
	}
	
}

function setCity(depto, city){
	
	city.innerHTML = "";
	var option = document.createElement("option");
	option.text = "";
	option.value = "";
	city.appendChild(option);
	var info = {};
	info.DEPTO = depto;
	post_comm("masters", "getCities", info, function(response){
		//console.log(response);
		var data = response.message;		
		if(response.status){
			for(var i = 0; i<data.length;i++){
				var option = document.createElement("option");
				option.text = data[i].NAME;
				option.value = data[i].NAME;
				city.appendChild(option);
			}
		}
		
	});
}

function stringToDate(_date,_format,_delimiter){			
			// ("2016/01/01","yyyy/mm/dd","/")
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

function PrintElem(elem){

post_comm("api","removeFadeStyle", elem.innerHTML,function(response){
	
		var data = response;
		var head  = '<meta charset="utf-8">  <meta http-equiv="X-UA-Compatible" content="IE=edge">   <meta name="description" content="">    <meta name="author" content="">';
		
		var scripts = '<link rel= "stylesheet" href="frameWork/css/imprimir.css"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>';
		
		var mywindow = window.open('', 'Imprimir', 'height=600,width=800');

        mywindow.document.write('<!DOCTYPE html><html><head>'+head);

        mywindow.document.write(scripts+'</head><body>');
		
        mywindow.document.write(data);
        
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        setTimeout(function(){
		
		mywindow.print();
        mywindow.close();
			
		}, 1000);

        return true;
		
		});

}