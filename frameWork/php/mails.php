<?php


require_once('../PHPMailer/class.phpmailer.php');

require_once("../PHPMailer/class.smtp.php"); // optional, gets called from within class.phpmailer.php if not already loaded


class mails{

	

	private $db = null;

	function __construct(){

		$this->db = new sql_query();

		if (session_status() == PHP_SESSION_NONE) {
			
			session_start();
		}
     
	}
	
	function restorePssw($info){
				
		$cfg = parse_ini_file("../cfg/cfg.ini",true);
		$mailInfo = $cfg["mail"];
				
		$mail             = new PHPMailer();

		$body             = "Su nueva contraseña es: ".$info["NEW_PSSW"]; //file_get_contents('contents.html');
		// $body             = eregi_replace("[\]",'',$body);
		$mail->IsSMTP(); // telling the class to use SMTP
		$mail->Host       = $mailInfo["Host"]; // SMTP server
		$mail->SMTPDebug  = 0;                     // enables SMTP debug information (for testing)
												   // 1 = errors and messages
												   // 2 = messages only
		$mail->SMTPAuth   = $mailInfo["SMTPAuth"];               // enable SMTP authentication
		$mail->SMTPSecure = $mailInfo["SMTPSecure"];;                 // sets the prefix to the servier
		$mail->Host       = $mailInfo["Host"];    // sets GMAIL as the SMTP server
		$mail->Port       = $mailInfo["Port"];                  // set the SMTP port for the GMAIL server
		$mail->Username   = $mailInfo["Username"];  // GMAIL username
		$mail->Password   = $mailInfo["Password"];           // GMAIL password

		$mail->SetFrom(utf8_decode($mailInfo["SetFrom"]), utf8_decode($mailInfo["SetFromText"]));

		// $mail->AddReplyTo("AddReplyTo@yourdomain.com","First Last");

		$mail->Subject    = utf8_decode("Reinicio de contraseña");

		$mail->AltBody    = "Para ver el mensaje, porfavor utilice un visor de correo con compatibilidad HTML"; // optional, comment out and test

		$mail->MsgHTML(utf8_decode($body));

		$address = $info["EMAIL"];
		
		$mail->AddAddress($address, $info["NAMES"]." ".$info["SURNAMES"]);
		
		if(!$mail->Send()) {
			
			$resp["message"] = $mail->ErrorInfo;
			$resp["status"] = false;
			return $resp;
			
		} else {
			
			$resp["message"] = "Se ha enviado un correo con la nueva contraseña";
			$resp["status"] = true;
			return $resp;
		  
		}
		
		
	}
	
	function mailTest($info){
		
		$cfg = parse_ini_file("../cfg/cfg.ini",true);
		$mailInfo = $cfg["mail"];
		$mail             = new PHPMailer();

		$body             = "hola"; //file_get_contents('contents.html');
		// $body             = eregi_replace("[\]",'',$body);

		$mail->IsSMTP(); // telling the class to use SMTP
		$mail->Host       = $mailInfo["Host"]; // SMTP server
		$mail->SMTPDebug  = 0;                     // enables SMTP debug information (for testing)
												   // 1 = errors and messages
												   // 2 = messages only
		$mail->SMTPAuth   = $mailInfo["SMTPAuth"];               // enable SMTP authentication
		$mail->SMTPSecure = $mailInfo["SMTPSecure"];;                 // sets the prefix to the servier
		$mail->Host       = $mailInfo["Host"];    // sets GMAIL as the SMTP server
		$mail->Port       = $mailInfo["Port"];                  // set the SMTP port for the GMAIL server
		$mail->Username   = $mailInfo["Username"];  // GMAIL username
		$mail->Password   = $mailInfo["Password"];           // GMAIL password

		$mail->SetFrom($mailInfo["SetFrom"], $mailInfo["SetFromText"]);

		// $mail->AddReplyTo("AddReplyTo@yourdomain.com","First Last");

		$mail->Subject    = utf8_decode("Prueba de redención de puntos");

		$mail->AltBody    = "Para ver el mensaje, porfavor utilice un visor de correo con compatibilidad HTML"; // optional, comment out and test

		$mail->MsgHTML($body);

		$address = "idarragajohan@gmail.com";
		$mail->AddAddress($address, "Johan idarraga");

		// $mail->AddAttachment("images/phpmailer.gif");      // attachment
		// $mail->AddAttachment("images/phpmailer_mini.gif"); // attachment


		if(!$mail->Send()) {
		  return "Mailer Error: " . $mail->ErrorInfo;
		} else {
		  return "Message sent!";
		}
			
		
		
	}
	
	
}