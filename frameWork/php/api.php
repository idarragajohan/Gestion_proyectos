<?php

class api{

	private $db = null;
	
	function __construct(){
		$this->db = new sql_query();
		
	}

	/**
 * \ingroup A
 */
	
	function xml2array ( $xmlObject, $out = array () ){
	    foreach ( (array) $xmlObject as $index => $node )
	        $out[$index] = ( is_object ( $node ) ) ? $this->xml2array ( $node ) : $node;

	    return $out;
	}
	
	function getClientIp(){
		
		if (preg_match( "/^([d]{1,3}).([d]{1,3}).([d]{1,3}).([d]{1,3})$/", getenv('HTTP_X_FORWARDED_FOR')))
		{
			return getenv('HTTP_X_FORWARDED_FOR');
		}
		
		return getenv('REMOTE_ADDR');
		
	}
	
	function getInterface($info){
		
		if($info == "home"){

			//01 admin 02 gerencial 03 Comercial 04 Analista 05 Jefe fábrica 06 Servicio Web 07 ADMINGSYS
			switch ($_SESSION["userType"]) {
				
				case '02':
					//GERENCIAL
					$info = $info."_gerencia";
				break;
				
				case '03':
					//COMERCIAL
					$info = $info."_comercial";
				break;

				case '04':
					//ANALISTA
					$info = $info."_analista";
				break;

				case '05':
					//JEFE FÁBRICA
					$info = $info."_fabrica";
				break;
				
				case '07':
					//ADMIN SEC
					$info = $info."_admin";
				break;

				default:
					# code...
				break;
			}
		}

		$html = file_get_contents("../html/".$info.".html");
		
		$resp["message"] = array("target"=>$info,"html"=>$html);
		$resp["status"] = true;
		
		
		return $resp;
		
	}

	function rrmdir($dir) {
		if (is_dir($dir)) {
			$objects = scandir($dir);
			foreach ($objects as $object) {
				if ($object != "." && $object != "..") {
				if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
			}
		}
			reset($objects);
			rmdir($dir);
		}
	}
	
	function compress_image($src, $dest , $quality) {
	
		$info = getimagesize($src);
	  
		if ($info['mime'] == 'image/jpeg') 
		{
			$image = imagecreatefromjpeg($src);
		}
		elseif ($info['mime'] == 'image/gif') 
		{
			$image = imagecreatefromgif($src);
		}
		elseif ($info['mime'] == 'image/png') 
		{
			$image = imagecreatefrompng($src);
		}
		else
		{
			throw new Exception('Unknown image file format');
		}
	  
		//compress and save file to jpg
		imagejpeg($image, $dest, $quality);
	  
		//return destination file
		return $dest;
	}

	function removeFadeStyle($info){
		
		$temp = str_replace("fade","", $info);
		
		$temp2 =  str_replace("none","block", $temp);
		
		$temp3 =  str_replace("collapse","", $temp2);
		
		return $temp3;
		
	}
	
	function anularSolicitud($info){
		
		$sel ="
		SELECT *
		FROM
		credits
		WHERE
		credits.SOLICITUD_ID = '".$info."'
		";
		
		$chk = $this->db->query($sel);
		
		if(count($chk) == 0){
			
			$rep["message"] = "No existe la solicitud ".$info;
			$rep["status"] = false;
			return $rep;
			
		}
		
		$str="
		UPDATE credits
		set
		STATUS = 'ANULADO'
		WHERE
		credits.SOLICITUD_ID = '".$info."'
		";
		
		$log = "
		INSERT INTO logs_error
		(ID, DATE,CENTER,DESCRIPTION)
		VALUES
		('".uniqid()."','".date('Y-m-d H:i:s')."','".$_SESSION["center"]."','".$_SESSION["user"]." anuló la solicitud ".$info."')
		";
		
		
		try{
			
			$this->db->query($str);
			$this->db->query($log);
			
			$rep["message"] = "Solicitud anulada con exito";
			$rep["status"] = true;
			
			return $rep;
			
			
		}catch(Exception $e){
			
			$this->registerException($e->getMessage());
			throw new Exception($e->getMessage());
			
			
		}
		
	}
	
	function registerException($info){
		
		$str="
		INSERT INTO logs_error
		(DATE,CENTER,EXCEPTION)
		VALUES
		('".date('Y-m-d H:i:s')."','".$_SESSION["center"]."','".$info."')
		";
		
		try{
			$this->db->query($str);
		}catch(Exception $e){
			throw new Exception($e->getMessage());
		}
		
	}
	
}

?>