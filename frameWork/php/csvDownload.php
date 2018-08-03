<?php

ini_set("auto_detect_line_endings", true);

$info = json_decode($_POST["info"],true);
// $info = $_POST["info"];

 
// file_put_contents("text.txt",$_POST["info"]);

  date_default_timezone_set("America/Bogota");
  header("Content-type: text/csv; charset=utf-8");
  header("Content-disposition: attachment; filename = ".$_POST["name"].".csv");

 echo $info;

 
?>