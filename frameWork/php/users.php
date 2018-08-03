<?php

class users{
	
	private $db = null;
	
	function __construct(){
		$this->db = new sql_query();
		// session_start();
	}
	
	function getSucursal($info){
		
		
		$str="
			SELECT
				users.ID,
				users.CENTER,
				users.OFFICE,
				users.`USER`,
				users.PSSW,
				users.CREATED,
				users.`STATUS`,
				users.`NAMES`,
				users.SURNAMES
			FROM
				`users`
			WHERE
				users.ID = '".$_SESSION["user"]."'
		";
		// return $str;
		
		$query = $this->db->query($str);
		if (count($query)>0){
			$resp["message"] = $query[0];
			$resp["status"] = true;
			
		}else{
			$resp["message"] = "no hay información de usuario";
			$resp["status"] = false;
		}
		
		return $resp;
		
	}
	
	function getCenter($info){
		
		$str = "SELECT
				centers.NIT,
				centers.`NAME`,
				centers.PHONE,
				centers.ADDRESS,
				centers.SECTOR,
				centers.EMAIL,
				centers.DV
				FROM
				centers
				WHERE 
				centers.NIT = '".$info["NIT"]."'";
		
		$query = $this->db->query($str);
		
		if(count($query) > 0){

			$resp["message"]= $query;
			$resp["status"]= true;

		}else{

			$resp["message"]= $query;
			$resp["status"]= false;

		}
		
		return $resp;
	}
	
	function getUser($info){

		$str = "SELECT users.ID, 
					users.CENTER, 
					users.OFFICE, 
					users.`USER`, 
					users.`NAMES`, 
					users.SURNAMES, 
					users.TYPE, 
					users.IND1, 
					users.TEL1, 
					users.EMAIL
				FROM users
				WHERE 
				users.ID = '".$info["ID"]."'";

		$query = $this->db->query($str);

		if(count($query) > 0){

			$resp["message"]= $query;
			$resp["status"]= true;

		}else{

			$resp["message"]= $query;
			$resp["status"]= false;

		}
		
		return $resp;

	}

	function getCurrentTypeUser(){
		$str= "SELECT
				users.TYPE
				FROM
				users
				WHERE
				ID = '".$_SESSION["user"]."'
		";
		$query = $this->db->query($str);
		
		if($query[0]["TYPE"]=="7"){
			return true;
		}else{
			return false;
		}
	}
	
	function getCenterList(){
		if($_SESSION["userType"] == '7'){
			try{
			$str="SELECT*,
				'' as ACTIONS
				FROM
				centers
				ORDER by NAME";
				
			$query = $this->db->query($str);
			$resp["message"]= $query;
			$resp["status"]= true;
			
			}catch(Exception $e){
				$resp["status"] = false;
				$resp["message"] = $e;
			}
			return $resp;	
			
		}else{
			$resp["status"] = false;
			$resp["message"] = "No tiene permisos para ver esta información";
			return $resp;
		}
		
	}
	
	function getCenters($info){
		
		$filters = array();
		
		if($info["NAME"] != ""){
			
			$filters[] = "UPPER(`NAME`) LIKE UPPER('%".$info["NAME"]."%')";
			
		}	
				
		if($info["STATUS"] != ""){
				
			$filters[] = "STATUS = '".$info["STATUS"]."'";
			
		}
		
		if($info["NIT"] != ""){
			
			$filters[] = "centers.NIT LIKE '%".$info["NIT"]."%'";
			
		}
		
		if($info["TYPE"] != ""){
			
			$filters[] = "centers.SECTOR LIKE '%".$info["TYPE"]."%'";
			
		}
		
		$where = "";
		if(count($filters) > 0){
			
			$where = " WHERE ".implode(" AND ",$filters);
			
		}
		 
		
		
		$str="SELECT
				centers.NIT,
				centers.`NAME`,
				centers.PHONE,
				centers.ADDRESS,
				centers.SECTOR,
				master_sector.`NAME` AS SECTOR_ECO,
				centers.EMAIL,
				centers.`STATUS`,
				centers.DV,
				centers.KEY_WS,
				'' as ACTIONS
				FROM
				centers
				INNER JOIN master_sector ON centers.SECTOR = master_sector.`CODE`
				".$where."
				";
		$query = $this->db->query($str);
		$resp["message"]= $query;
		$resp["status"]= true;
		return $resp;
	}
	
	function getTypeUser(){
		
		if($_SESSION["userType"] == '7'){
				
			$str="SELECT *					
					FROM
					master_user_type
					WHERE 
					master_user_type.CENTER ='".$_SESSION["center"]."'
			";
		}else{
			$str="SELECT *
					FROM
					master_user_type
					WHERE
					CODE != '07' AND (master_user_type.CENTER ='9999999' OR master_user_type.CENTER ='".$_SESSION["center"]."')
			";
			
		}
		
		$query = $this->db->query($str);
			$resp["message"] = $query;
			$resp["status"] = true;
			
		return $resp;	
	
	}
	
	function logOut(){
		
				
		session_destroy();
		$resp["message"] = "";
		$resp["status"] = true;
	}
	
	function chkLogin($data){
		
		if(isset($_SESSION["user"])){
			
			if(isset($_SESSION["changedCenter"])){
				
				$resp["message"] = "SI";
				$resp["status"] = true;
			}else{
				$resp["message"] = "NO";
				$resp["status"] = true;
			
			}
			
		}else{
			
			$resp["message"] = "";
			$resp["status"] = false;
			
		}
		
		return $resp;
	}
	
	function login($data){

		$str = "SELECT
				users.ID,
				users.PSSW,
				users.CREATED,
				users.CENTER,
				users.OFFICE,
				users.TYPE,
				users.`STATUS`,
				users.`NAMES`,
				users.SURNAMES
				FROM
				users
				WHERE
				users.ID = '".$data["USER"]."' AND
				users.PSSW = '".md5($data["PSSW"])."' AND
				users.STATUS = '1'";
		
		$query = $this->db->query($str);	
		
		if(count($query) > 0){
			
			// $chkCenter = $this->chkCenter($query[0]);
			
			// if($chkCenter){
				$resp["message"] = "";
				$resp["status"] = true;
				$_SESSION["user"] = $query[0]["ID"];
				$_SESSION["names"] = $query[0]["NAMES"]." ".$query[0]["SURNAMES"];
				$_SESSION["office"] = $query[0]["OFFICE"];
				$_SESSION["center"] = $query[0]["CENTER"];
				$_SESSION["fabrica"]= "";
				$_SESSION["clientID"]= "";
				$_SESSION["clientType"]= "";
				$_SESSION["clientAct"]= "";
				$_SESSION["clientSolicitud"]= "";
				$_SESSION["userType"]= $query[0]["TYPE"];
			// }else{
				// if($query[0]["TYPE"] == "2"){
					// $_SESSION["user"] = $query[0]["ID"];
					// $_SESSION["center"] = $query[0]["CENTER"];
					// $resp["message"] = "";
					// $resp["status"] = true;
				// }else{
					// $resp["message"] = "Servicio Suspendido";
					// $resp["status"] = false;
				// }
				
			// }
						
		}else{
			
			$resp["message"] = "Usuario y/o contraseña incorrectos";
			$resp["status"] = false; 
		}
		
		
		return $resp;
	}
	
	function chkCenter($info){
		
		if(!isset($info["CENTER"])){
			
			$info["CENTER"] = $_SESSION["center"];
			
		}
		
		$str="
		SELECT
			centers.NIT,
			centers.`NAME`
		FROM
			centers
		WHERE
			centers.NIT = '".$info["CENTER"]."'
		AND `STATUS` = '1'
		";
		
		$query = $this->db->query($str);
		
		if(count($query) > 0){
			$resp["message"] = "Centro al día";
			$resp["status"] = true;
			
		}else{
			$resp["message"] = "Servicio suspendido";
			$resp["status"] = false;
		}
		
		return $resp;
		
	}
	
	function getUserActive($info){
		
		// $users =scandir(session_save_path());
				
		$data = array();
		
		// foreach($users as $val){
			// $temp = explode("_",$val);
			
			// if(isset($temp[1])){
				// $str="
					// SELECT
						// users.ID,
						// users.CENTER,
						// users.`USER`,
						// users.`NAMES`,
						// users.SURNAMES,
						// users.`STATUS`
					// FROM
						// `users`
					// WHERE
						// users.CENTER = '".$_SESSION["center"]."'
					// AND users.`STATUS` = '1'
					// AND users.USER = '".$temp[1]."'
					// AND users.TYPE = '5'
					// ";
					
					// $query = $this->db->query($str);
					
					// if(count($query)>0){
						
						// $data[] = $query[0];
						
					// }
					
			// }
			
			
			
		// }
		
		// try{
			// $query = $this->db->query($str);
			
			// $resp["message"] = array("data"=>$data, "qty"=>count($data));
			$resp["status"] = false;
			
			return $resp;
			
		// }catch(Exception $e){
			// throw new Exception ($e->getMessage());
		// }
		
		
		
		
	}
	
	function getUsersList($info){
	 	
 		$filters = array();
		
		if($info["ID"] != ""){
			
			$filters[] = "users.ID LIKE '%".$info["ID"]."%'";
		}
		
		if($_SESSION["userType"] != "7"){
			$filters[] = "users.CENTER = '".$_SESSION["center"]."'";
		}
		
		if($info["NAMES"] != ""){
			
			$filters[] = "UPPER(`NAMES`) LIKE UPPER('%".$info["NAMES"]."%')";
			
		}	
		
		if($info["SURNAME"] != ""){
			
			$filters[] = "UPPER(`SURNAMES`) LIKE UPPER('%".$info["SURNAME"]."%')";
			
		}
		
		
		if($info["STATUS"] != ""){
			
			$filters[] = "users.STATUS = '".$info["STATUS"]."'";
			
		}
		
		if($info["TYPE"] != ""){
			
			$filters[] = "users.TYPE = '".$info["TYPE"]."'";
			
		}
		
		$where = "";
		if(count($filters) > 0){
			
			$where = " WHERE ".implode(" AND ",$filters);
			
		}
		 
		
		 $str = "SELECT
				count(*) as QTY
				FROM
				users
				".$where."
				ORDER BY users.NAMES";

		$qty = $this->db->query($str);
		
		$str = "SELECT
				users.ID,
				users.CREATED,
				users.OFFICE,
				users.`NAMES`,
				users.SURNAMES,
				users.`STATUS`,
				users.IND1,
				users.TEL1,
				users.EMAIL,
				users.TYPE,
				users.PSSW,
				master_user_type.`NAME`,
				'' AS ACTIONS,
				centers.`NAME` AS CENTER
				FROM
				users
				INNER JOIN master_user_type ON users.TYPE = master_user_type.`CODE`
				INNER JOIN centers ON users.CENTER = centers.NIT
				".$where."
				ORDER BY users.NAMES
				LIMIT ".$info['limits']['lower'].",".$info['limits']['upper']."";
		// return $str;
		$query = $this->db->query($str);
 	
		
		$resp["message"] = array("info"=>$query,"qty"=>$qty[0]["QTY"]);
		$resp["status"] = true;
		
		return $resp;
		
	}
			
	function deleteUserList($info){
		
		
		$str="	UPDATE users
					SET STATUS = 0
				WHERE
					users.ID = '".$info["ID"]."'";
		try{
			$query = $this->db->query($str);
			$resp["message"] = "Usuario Modificado exitosamente";
			$resp["status"] = true;	
		}catch(Exception $e){
			$resp["message"] = $e;
			$resp["status"] = false;
		}
		return $resp;
	}
		
	function addUsers($info){

		$str = "SELECT users.ID,
					users.EMAIL
				FROM users
				WHERE users.ID = '".$info["ID"]."' OR  users.EMAIL = '".$info["EMAIL"]."'";

		$query = $this->db->query($str);
		
		if(count($query) > 0){
			
			if($query[0]["ID"] == $info["ID"]){
				$resp["message"] = "Ya existe un usuario con el ID ".$info["ID"];
				$resp["status"] = false;
			}else{
				$resp["message"] = "Ya existe un usuario con el Email ".$info["EMAIL"];
				$resp["status"] = false;
			}

		}else{		
			
			if(isset($info["CENTER"])){
				$center = $info["CENTER"];
			}else{
				$center = $_SESSION["center"];
				
			}
			
			$date= date('Y-m-d H:i:s');
			
			$str = "INSERT INTO users
					(ID, CENTER, OFFICE, PSSW, CREATED, STATUS, NAMES, SURNAMES, TYPE, IND1, TEL1, EMAIL)
					VALUES 
					('".$info["ID"]."','".$center."', '".$info["OFFICE"]."', '".md5($info["PASS"])."', '".$date."','1',UPPER('".$info["NAMES"]."'),UPPER('".$info["SURNAMES"]."'),
					'".$info["TYPE"]."','".$info["IND"]."','".$info["PHONE"]."',UPPER('".$info["EMAIL"]."'))";
			
			
			$query = $this->db->query($str);
			
			$sec="INSERT INTO sec_user_perfil
					(USER, PERFIL)
					VALUES
					('".$info["ID"]."','".$info["TYPE"]."')
			";
			$fin=$this->db->query($sec);
			
			$resp["message"] = "Usuario ".$info["ID"]." creado exitosamente" ;
			$resp["status"] = true;
		}

		return $resp;
		
	}
	
	function changeType($info){
		/*
		$str = "UPDATE users 
				SET 
				TYPE = '".$info["TYPE"]."'
				WHERE 
				ID = '".$info["ID"]."'";
		
		$this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;
 
		return $resp;
		*/
	}
	
	function restoreUser($info){
		
		$str = "UPDATE users
				SET
				STATUS = '1'
				WHERE 
				users.ID = '".$info["ID"]."'";

		$query = $this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;
		
		
	}
	
	function deleteUser($info){
		
		
		$str = "UPDATE users
				SET
				STATUS = '0'
				WHERE 
				users.ID = '".$info["ID"]."'";

		$query = $this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;

	}

	function updateUser($info){
		
		if(isset($info["CENTER"])){
				$center = $info["CENTER"];
			}else{
				$center = $_SESSION["center"];
				
			}
			
		$str = "UPDATE users 
				SET 
				NAMES = '".$info["NAMES"]."',
				SURNAMES = '".$info["SURNAMES"]."',
				CENTER = '".$center."',
				OFFICE = '".$info["OFFICE"]."',
				TYPE = '".$info["TYPE"]."',
				IND1 = '".$info["IND"]."',
				TEL1 = '".$info["PHONE"]."',
				EMAIL = '".$info["EMAIL"]."'
				WHERE
				ID = '".$info["ID"]."'";

		$query = $this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;


	}
		
	function getSecurity(){
		
		$str = "SELECT
				`security`.OBJECT,
				`security`.`VALUE`
				FROM
				`security`
				WHERE
				`security`.`USER` = '".$_SESSION["user"]."'";
		
		$query = $this->db->query($str);

		$resp["message"] = $query;
		$resp["status"] = true;

		return $resp;
	}
	  
	function saveSecurity($info){
		
		foreach($info["SECURITY"] as $value){
			
			$str = "REPLACE INTO `security`
					(USER, OBJECT, VALUE) 
					VALUES  
					('".$info["USER"]."','".$value["OBJECT"]."','".$value["VALUE"]."')";
					
			$query = $this->db->query($str);
			
		}

		$resp["message"] = $info;
		$resp["status"] = true;
		return $resp;
		 
		
	}
	
	function getUsers($info){
		
		$str = "SELECT
				users.ID,
				users.`NAMES`,
				users.LASTNAME
				FROM
				users";
		
		$query = $this->db->query($str);
		
		$resp["message"] = $query;
		$resp["status"] = true;
		return $resp;
	
	}
	
	function createCenter($info){
		
		$str="SELECT*
				FROM 
				centrales_info
				WHERE
				CENTER = '".$info["NIT"]."'
		";
		$query = $this->db->query($str);
		
		if(count($query)>0){
			
			$resp["message"]="El Centro ya esta creado con ese NIT";
			$resp["status"]=false;
			return $resp;
		}
		
		$str="INSERT INTO centers
			(NIT, NAME, PHONE, ADDRESS, SECTOR, EMAIL, STATUS, DV, CREATION_DATE)
			VALUES
			('".$info["NIT"]."-".$info["DV"]."', UPPER('".$info["CENTER"]."'), '".$info["PHONECENTER"]."', '".$info["ADDRECENTER"]."', '".$info["SECTORCENTER"]."', UPPER('".$info["EMAILCENTER"]."'),'1', 
			 '".$info["DV"]."', '".date('Y-m-d H:i:s')."')
		
		";
				
		
		try{
			
			if(!file_exists("../files/".$info["NIT"])){
			
				if(!mkdir("../files/".$info["NIT"],0777)){
					
					throw ("Error al crear carpeta de centro");
				}
			}
			if(!file_exists("../files/".$info["NIT"]."/habeas_data")){
			
				if(!mkdir("../files/".$info["NIT"]."/habeas_data",0777)){
					
					throw ("Error al crear carpeta de habeas");
				}
			}
			if(!file_exists("../files/".$info["NIT"]."/solicitudes")){
			
				if(!mkdir("../files/".$info["NIT"]."/solicitudes",0777)){
					
					throw ("Error al crear carpeta de solicitudes");
				}
			}
			
			$query = $this->db->query($str);
			
			$resp["message"]="Centro creado con exito";
			$resp["status"]=true;
			
		}catch(Exception $e){
			$resp["message"]="Error al crear el Centro";
			$resp["status"]=false;
			return $resp;
			
		}
		
		return $resp;
		
	}
	
	function deleteCenter($info){
		
		$str = "UPDATE centers
				SET
				STATUS = '0'
				WHERE 
				centers.NIT = '".$info["NIT"]."'";

		$query = $this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;
		
	}
	
	function restoreCenter($info){
		$str = "UPDATE centers
				SET
				STATUS = '1'
				WHERE 
				centers.NIT = '".$info["NIT"]."'";

		$query = $this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;
	}
	
	function restoreServiceCenter($info){
		
		$str = "UPDATE centers
				SET
				STATUS = '1'
				WHERE 
				centers.NIT = '".$info["NIT"]."'";

		$query = $this->db->query($str);

		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;
	}
	
	function editCenter($info){
		
		$str= "UPDATE centers
				SET
				NAME = '".$info["NAME"]."',
				PHONE = '".$info["PHONE"]."',
				ADDRESS = '".$info["ADDRESS"]."',
				SECTOR = '".$info["SECTOR"]."',
				EMAIL = '".$info["EMAIL"]."'
				WHERE
				centers.NIT = '".$info["NIT"]."-".$info["DV"]."'
				";
		$query= $this->db->query($str);
		
		$resp["message"] = $info;
		$resp["status"] = true;

		return $resp;
		
	}
	
	function recoverPass($info){
		
		$str="SELECT*,
				'' AS NEW_PSSW
				FROM
				users
				WHERE
				EMAIL = '".$info["EMAIL"]."'";
				
		$query = $this->db->query($str);
		
		if(count($query)>0){
			
			require_once("mails.php");
			
			$mail = new mails();
			$query[0]["NEW_PSSW"] = $this->randomPassword();
			

			$resp = $mail->restorePssw($query[0]);
			
			if($resp["status"]){
				
				$str = "UPDATE users 
						SET 
						PSSW = '".md5($query[0]["NEW_PSSW"])."'
						WHERE
						users.EMAIL = '".$info["EMAIL"]."'";
						
				$this->db->query($str);
				
			}
			
			
			
		}else{
			$resp["message"] = "Email no registrado";
			$resp["status"] = false;
			
		}
		
		return $resp;
	}
	
	function randomPassword() {
		$alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
		$pass = array(); //remember to declare $pass as an array
		$alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
		for ($i = 0; $i < 8; $i++){
			$n = rand(0, $alphaLength);
			$pass[] = $alphabet[$n];
		}
		return implode($pass); //turn the array into a string
	}
	
	function updatePass($info){
		
		$str="SELECT
				ID,
				PSSW
				FROM
				users
				WHERE 
				ID = '".$_SESSION["user"]."'
		";
		$query = $this->db->query($str);
		
		if($query[0]["PSSW"] != md5($info["OLD"])){
			
			$resp["message"] = "ingrese su contraseña correctamente";
			$resp["status"] = false;
		}else{
			
			$str="UPDATE users
					SET
					PSSW = '".md5($info["NEW"])."'
				WHERE 
				ID = '".$_SESSION["user"]."'
			";
			
			$up = $this->db->query($str);
			
			$resp["message"] = "Contraseña actualizada correctamente";
			$resp["status"] = true;
		}
		
		return $resp;
		
		
		
		
	}
	
	function generateKey($info){
				
		$key= md5(microtime().rand());
		$str="UPDATE centers
		SET
		KEY_WS = '".$key."'
		WHERE
		NIT = '".$info["CENTER"]."'
		";
		$this->db->query($str);
		
		$resp["message"] = $key;
		$resp["status"] = true;
		
		return $resp;
	}
	
	function getKey($info){
		
		$str="SELECT
				KEY_WS
				FROM
				centers
				WHERE
				NIT = '".$info["NIT"]."'";
				
		$query= $this->db->query($str);
		$resp["message"]=$query[0];
		$resp["status"]=true;
		
		return $resp;
		
	}
	
	function getCreditsToUser($info){
	
	$date = date('Y-m-d',strtotime("-1 days"));
	
	$str="SELECT
		COUNT(*) AS QTY
	FROM
		`credits`
	WHERE
		credits.CREATED_BY = '".$_SESSION["user"]."'
	AND `STATUS` != 'CERRADO'
	AND credits.CREATION_DATE > '".$date."'
	";
	
	$total = $this->db->query($str);
		
	
	$str="SELECT
			COUNT(*) AS QTY
		FROM
			(
				SELECT
					credits.SOLICITUD_ID,
					credits.`STATUS`
				FROM
					`credits`
				WHERE
					credits.CREATED_BY = '".$_SESSION["user"]."'
				AND `STATUS` != 'CERRADO' AND credits.CREATION_DATE > '".$date."'
			) AS T2
		WHERE
			T2.`STATUS` != 'CREADO'
		AND T2.`STATUS` != 'FABRICA'";
	
	$process = $this->db->query($str);
		
		$query= ["TOTAL"=> $total[0]["QTY"], "PROCESS"=> $process[0]["QTY"]];
		
		
		$resp["message"]=$query;
		$resp["status"] = true;
		return $resp;
	}
	

}







?>