<?php
	
	define(DB_SERVER, 'localhost');
	define(DB_USER, 'alan_alan');
	define(DB_PASSWORD, 'ze3^717?0F-e');
	define(DB_NAME, 'alan_wccr');
	
	$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
	if($mysqli->connect_error)
		die("<h3>Database Error: $mysqli->connect_error</h3>");
	
	$item = $_POST['newItem'];
	$gross = $_POST['newGross'];
	$tare = $_POST['newTare'];
	$calPerGram = $_POST['newCalPerGram'];
	$cal = $_POST['newCal'];
	$date = $_POST['date'];
	
	$item = htmlentities($item);
	$gross = htmlentities($gross);
	$tare = htmlentities($tare);
	$calPerGram = htmlentities($calPerGram);
	$cal = htmlentities($cal);
	$date = htmlentities($date);
	
	$item = $mysqli->real_escape_string($item);
	$gross = $mysqli->real_escape_string($gross);
	$tare = $mysqli->real_escape_string($tare);
	$calPerGram = $mysqli->real_escape_string($calPerGram);
	$cal = $mysqli->real_escape_string($cal);
	$date = $mysqli->real_escape_string($date);
	
	$gross = is_numeric($gross) && $gross >= 0 ? $gross : 0;
	$tare = is_numeric($tare) && $tare >= 0 ? $tare : 0;
	$calPerGram = is_numeric($calPerGram) && $calPerGram >= 0 ? $calPerGram : 0;
	$cal = is_numeric($cal) && $cal >= 0 ? $cal : 0;
	
	$isValid = preg_match('/\d{4}\-\d{2}\-\d{2}/', $date);
	
	if($isValid)
	{
	
		$result = $mysqli->query("
			INSERT INTO wccr (`item`, `gross`, `tare`, `cal`, `date`)
			VALUES ('$item', $gross, $tare, $cal, '$date')
		");
		
		if($result) {
			echo "$_POST[date], $_POST[item], $_POST[gross], $_POST[tare], 
					$_POST[net], $_POST[calPerGram], $_POST[cal]  $result";
			echo "Was successfully entered.";
		} else {
			echo "Datebase entry fail.";
			echo "
				INSERT INTO wccr (`item`, `gross`, `tare`, `cal`, `date`)
				VALUES ('$item', $gross, $tare, $cal, '$date')
			";
		}
	} else {
		echo "
			INSERT INTO wccr (`item`, `gross`, `tare`, `cal`, `date`)
			VALUES ('$item', $gross, $tare, $cal, '$date')
		";
		echo "That data was invalid.";
	}
	
?>	