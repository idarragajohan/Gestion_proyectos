<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set("America/Bogota");
header('Content-Type: text/html; charset=utf-8');

class entryPoint{
	
	private $params;
	
	function __construct($info){
		

		if(isset($_POST["info"])){
			$this->params = json_decode(base64_decode($_POST["info"]), true);
			
		}else{
			
			$this->params = json_decode(base64_decode(file_get_contents("php://input")), true);
			
		}
		
	}
	
	function start(){
		session_start();
		
		if(isset($_SESSION["user"]) || $this->params["method"] == "logOut" || $this->params["method"] == "chkLogin"
			|| $this->params["method"] == "login" || $this->params["method"] == "recoverPass"){
			
			require_once "dataBase.php";
			
			require_once $this->params["class"].".php";
			
			$class = $this->params["class"];
			$instancia = new $class(); 
			$method = $this->params["method"];

			try{
				
				$exec = null;
				
				$exec = $instancia->$method($this->params["data"]);
				
				$resp = array(	"data"=>$exec,
								"exception"=>"");
				return $resp;

			}catch(Exception $e){
				$resp = array(	"data"=>$exec,
								"exception"=>$e->getMessage());
				return $resp;	
			}
			
			
		}else{
			
			
			$resp = array(	"data"=>"0000",
							"exception"=>"NO se encuentra logeado");
			return $resp;	
			
		}
		
 
	}
}

$entry = new entryPoint($_POST);

echo base64_encode(json_encode($entry->start()));


?>