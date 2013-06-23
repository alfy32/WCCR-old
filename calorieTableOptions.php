<?php

	$mysqli = new mysqli("localhost", "alan_alan", "ze3^717?0F-e", "alan_wccr");
	
	if($mysqli->connect_error)
		die("<h3>Database Error: $mysqli->connect_error</h3>");

	$result = $mysqli->query("SELECT * FROM calorieTable LIMIT 25");
	
	echo '<datalist id="calorieTable">';
	
	while($row = $result->fetch_assoc()){
		echo "<option value='$row[item]'>";
	}
	
	echo '</datalist>';
?>