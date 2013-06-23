<?php
	
	define(DB_SERVER, 'localhost');
	define(DB_USER, 'alan_alan');
	define(DB_PASSWORD, 'ze3^717?0F-e');
	define(DB_NAME, 'alan_wccr');
	
	$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
	if($mysqli->connect_error)
		die("<h3>Database Error: $mysqli->connect_error</h3>");
	
	$id = $_POST['id'];
	
	$item = $_POST['item'];
	$item = htmlentities($item);
	$item = $mysqli->real_escape_string($item);
	
	if(is_numeric($id) && $id >= 0) {
		$result = $mysqli->query("
			UPDATE wccr 
			SET `item`='$item'
			WHERE `id`=$id
		");
		
		if($result) {
			echo "Success";
		} 
		else {
			echo "Failed";
		}
	} 
	else {
		echo "Failed";
	}
	
?>	