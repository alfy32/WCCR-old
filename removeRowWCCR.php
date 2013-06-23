<?php
	
	define(DB_SERVER, 'localhost');
	define(DB_USER, 'alan_alan');
	define(DB_PASSWORD, 'ze3^717?0F-e');
	define(DB_NAME, 'alan_wccr'); 
	
	$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
	if($mysqli->connect_error)
		die("<h3>Database Error: $mysqli->connect_error</h3>");
	
	$id = $_POST['id'];
	$date = $_POST['date'];
	

	
	if($id >= 0) {
		$result = $mysqli->query("
				DELETE FROM wccr
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
				$dailyCal = $row['cal'];
				
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