<?php

	$mysqli = new mysqli("localhost", "alan_alan", "ze3^717?0F-e", "alan_wccr");
	
	if($mysqli->connect_error)
		die("<h3>Database Error: $mysqli->connect_error</h3>");

	$result = $mysqli->query("SELECT * FROM calorieTable");
	
	$rows = array();
	
	while($row = $result->fetch_assoc()){
		$row['label'] = $row['item'];
		$rows[] = $row;
	}
?>
<script>
	var json = eval(<?php print json_encode($rows); ?>);
</script>