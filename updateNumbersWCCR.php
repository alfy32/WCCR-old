<?php
	
	define(DB_SERVER, 'localhost');
	define(DB_USER, 'alan_alan');
	define(DB_PASSWORD, 'ze3^717?0F-e');
	define(DB_NAME, 'alan_wccr');
	
	$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
	if($mysqli->connect_error)
		die("<h3>Database Error: $mysqli->connect_error</h3>");
	
	$id = $_POST['id'];
	
	$gross = $_POST['gross'];
	$tare = $_POST['tare'];
	$calPerGram = $_POST['calPerGram'];
	$cal = $_POST['cal'];

	$date = $_POST['date'];
	
	$gross = htmlentities($gross);
	$tare = htmlentities($tare);
	$calPerGram = htmlentities($calPerGram);
	$cal = htmlentities($cal);
	
	$gross = $mysqli->real_escape_string($gross);
	$tare = $mysqli->real_escape_string($tare);
	$calPerGram = $mysqli->real_escape_string($calPerGram);
	$cal = $mysqli->real_escape_string($cal);
	
	$gross = is_numeric($gross) && $gross >= 0 ? $gross : 0;
	$tare = is_numeric($tare) && $tare >= 0 ? $tare : 0;
	$calPerGram = is_numeric($calPerGram) && $calPerGram >= 0 ? $calPerGram : 0;
	$cal = is_numeric($cal) && $cal >= 0 ? $cal : 0;
	
	if(is_numeric($id) && $id >= 0) {
		$result = $mysqli->query("
			UPDATE wccr 
			SET `gross`=$gross, `tare`=$tare, `calPerGram`=$calPerGram, `cal`=$cal
			WHERE `id`=$id
		");
		
		if($result) {
			$dayOfWeek = date("l", strtotime($date));
			$sqlDate = date("Y-m-d", strtotime($date));
			$dailyCal = 0;
			$weeklyCal = 0;
			
			$result = $mysqli->query("
				SELECT SUM(cal) AS cal FROM wccr
				WHERE `date`='$sqlDate'
				");
				
			if($result && $row = $result->fetch_assoc()) 
				$dailyCal += $row['cal'];
				
			if($dayOfWeek == "Sunday") {
				$weeklyCal = $dailyCal;
			}
			else {
				$sqlSunday = date("Y-m-d", strtotime("saturday -6 days"));
				
				$result = $mysqli->query("
					SELECT SUM(cal) AS cal FROM wccr
					WHERE `date`>='$sqlSunday'
					AND `date`<= '$sqlDate'
					");
					
				if($result && $row = $result->fetch_assoc()) {
					$weeklyCal += $row['cal'];
				}
			}
			$dayOfWeekNum = date("w", strtotime($date))+1;
			
			$weeklyBudgeted = 2300*$dayOfWeekNum;
			$weeklyBalance = $weeklyBudgeted - $weeklyCal;
			
			if($weeklyBalance < 0) {
				$weeklyBalance = -$weeklyBalance;
				$weeklyBalanceNeg = true;
			}
			
			$dailyBudgeted = 2300;
			$dailyBalance = $dailyBudgeted - $dailyCal;
			
			if($dailyBalance < 0) {
				$dailyBalance = -$dailyBalance;
				$dailyBalanceNeg = true;
			}
			
			$weeklyBudgeted = number_format($weeklyBudgeted);
			$weeklyCal = number_format($weeklyCal);
			$weeklyBalance = number_format($weeklyBalance);
			
			$dailyBudgeted = number_format($dailyBudgeted);
			$dailyCal = number_format($dailyCal);
			$dailyBalance = number_format($dailyBalance);
			
			if($dailyBalanceNeg) {
				$dailyBalance = "(" . $dailyBalance . ")";
			}
			
			if($weeklyBalanceNeg) {
				$weeklyBalance = "(" . $weeklyBalance . ")";
			}
			
			echo "{ 
				'weeklyBudgeted':'$weeklyBudgeted',
				'weeklyCal':'$weeklyCal',
				'weeklyBalance':'$weeklyBalance',
				'dailyBudgeted':'$dailyBudgeted',
				'dailyCal':'$dailyCal',
				'dailyBalance':'$dailyBalance'
			}";
		} 
		else {
			echo "Failed";
		}
	} 
	else {
		echo "Failed";
	}

?>	