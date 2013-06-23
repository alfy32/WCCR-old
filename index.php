<!DOCTYPE html>
<?php
//print_r($_POST);

define(DB_SERVER, 'localhost');
define(DB_USER, 'alan_alan');
define(DB_PASSWORD, 'ze3^717?0F-e');
define(DB_NAME, 'alan_wccr');

$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
if ($mysqli->connect_error)
    die("<h3>Database Error: $mysqli->connect_error</h3>");

$date = date("l, F j, Y");
if (isset($_POST['date'])) {
    $dayOfWeek = date("w", strtotime($_POST['date']));
    $saturday = date("w", strtotime("saturday"));
    $num = $saturday - $dayOfWeek;

    $date = date("l, F j, Y", strtotime("saturday -$num days"));
}

//// ADD NEW ITEM ////
if (isset($_POST['addRow'])) {
    $item = $_POST['newItem'];
    $gross = $_POST['newGross'];
    $tare = $_POST['newTare'];
    $calPerGram = $_POST['newCalPerGram'];
    $cal = $_POST['newCal'];
    $date = $_POST['date'];
    $sqlDate = date("Y-m-d", strtotime($date));

    $item = $mysqli->real_escape_string(htmlentities($item));
    $gross = $mysqli->real_escape_string(htmlentities($gross));
    $tare = $mysqli->real_escape_string(htmlentities($tare));
    $calPerGram = $mysqli->real_escape_string(htmlentities($calPerGram));
    $cal = $mysqli->real_escape_string(htmlentities($cal));

    $gross = is_numeric($gross) && $gross >= 0 ? $gross : 0;
    $tare = is_numeric($tare) && $tare >= 0 ? $tare : 0;
    $calPerGram = is_numeric($calPerGram) && $calPerGram >= 0 ? $calPerGram : 0;
    $cal = is_numeric($cal) && $cal >= 0 ? $cal : 0;

    $result = $mysqli->query("
			INSERT INTO wccr (`item`, `gross`, `tare`, `calPerGram`, `cal`, `date`)
			VALUES ('$item', $gross, $tare, $calPerGram, $cal, '$sqlDate')
		");

    if (!$result) {
        echo "<script>alert('Data entry failed. :(');</script>";
    }
}

$javascriptDate = date("Y-m-d", strtotime($date));
?>
<html lang='en'>
    <head>
        <title>WCCR</title>
        <meta charset="UTF-8" />
        <link rel="stylesheet" type="text/css" href="style.css">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="javascript.js"></script>

        <script type="text/javascript">
            var date = '<?php echo $javascriptDate; ?>';
        </script>
    </head>
    <body>
        <header>
            <p class="date"><?php echo $date; ?></p>
            <form action='#' method='POST'>
                <ul>
                    <?php
                    $dayOfWeek = date("l", strtotime($date));

                    if ($dayOfWeek == 'Sunday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Sunday'/></li>";
                    if ($dayOfWeek == 'Monday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Monday'/></li>";
                    if ($dayOfWeek == 'Tuesday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Tuesday'/></li>";
                    if ($dayOfWeek == 'Wednesday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Wednesday'/></li>";
                    if ($dayOfWeek == 'Thursday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Thursday'/></li>";
                    if ($dayOfWeek == 'Friday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Friday'/></li>";
                    if ($dayOfWeek == 'Saturday')
                        echo "<li><p>$dayOfWeek</p></li>";
                    else
                        echo "<li><input type='submit' name='date' value='Saturday'/></li>";
                    ?>
                </ul>
            </form>
        </header>
        <?php
        $dayOfWeek = date("l", strtotime($date));
        $sqlDate = date("Y-m-d", strtotime($date));
        $dailyCal = 0;
        $weeklyCal = 0;

        $result = $mysqli->query("
		SELECT SUM(cal) AS cal FROM wccr
		WHERE `date`='$sqlDate'
		");

        if ($result && $row = $result->fetch_assoc())
            $dailyCal += $row['cal'];

        if ($dayOfWeek == "Sunday") {
            $weeklyCal = $dailyCal;
        } else {
            $sqlSunday = date("Y-m-d", strtotime("saturday -6 days"));

            $result = $mysqli->query("
			SELECT SUM(cal) AS cal FROM wccr
			WHERE `date`>='$sqlSunday'
			AND `date`<= '$sqlDate'
			");

            if ($result && $row = $result->fetch_assoc()) {
                $weeklyCal += $row['cal'];
            }
        }
        $dayOfWeekNum = date("w", strtotime($date)) + 1;

        $weeklyBudgeted = 2300 * $dayOfWeekNum;
        $weeklyBalance = $weeklyBudgeted - $weeklyCal;

        if ($weeklyBalance < 0) {
            $weeklyBalance = -$weeklyBalance;
            $weeklyBalanceNeg = true;
        }

        $dailyBudgeted = 2300;
        $dailyBalance = $dailyBudgeted - $dailyCal;

        if ($dailyBalance < 0) {
            $dailyBalance = -$dailyBalance;
            $dailyBalanceNeg = true;
        }

        $weeklyBudgeted = number_format($weeklyBudgeted);
        $weeklyCal = number_format($weeklyCal);
        $weeklyBalance = number_format($weeklyBalance);

        $dailyBudgeted = number_format($dailyBudgeted);
        $dailyCal = number_format($dailyCal);
        $dailyBalance = number_format($dailyBalance);

        if ($dailyBalanceNeg) {
            $dailyBalance = "(" . $dailyBalance . ")";
        }

        if ($weeklyBalanceNeg) {
            $weeklyBalance = "(" . $weeklyBalance . ")";
        }
        ?>
        <form action="#" method="POST">
            <table class="wccr">
                <thead>
                    <tr>
                        <th title="Name of the food item">Item</th>
                        <th title="Weight including the container">Gross Wt</th>
                        <th title="Weight of the container">Tare</th>
                        <th title="Weight of the item without container">Net Wt</th>
                        <th title="Calories per gram of the item">Cal/g</th>
                        <th title="Total calories of the item">Cal</th>
                        <th></th>
                    </tr>
                    <tr class="newItem">
                <input name="date" type="hidden" value="<?php echo date("Y-m-d", strtotime($date)); ?>" />
                <td class="item"><input class="itemInput" type="text" name="newItem" /></td>
                <td class="gross"><input class="grossInput" type="text" name="newGross" /></td>
                <td class="tare"><input class="tareInput" type="text" name="newTare" /></td>
                <td class="net"><input class="netInput" type="text" name="newNet" /></td>
                <td class="calPerGram"><input class="calPerGramInput" type="text" name="newCalPerGram" /></td>
                <td class="cal"><input class="calInput" type="text" name="newCal" /></td>
                <td class="submit"><input type="submit" name="addRow" value="Add" /></td>
                </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="3"></td>
                        <th colspan="2">Budgeted</th>
                        <th>Total</th>
                        <th>Balance</th>
                    </tr>
                    <tr class="dailyTotal">
                        <th colspan="3">Daily Total Calories</th>
                        <td class="budgeted" colspan="2"><?php echo $dailyBudgeted; ?></td>
                        <td class="totals"><?php echo $dailyCal; ?></td>
                        <td class="balance"><?php echo $dailyBalance; ?></td>
                    </tr>
                    <tr class="weeklyTotal">
                        <th colspan="3">Weekly Cumulative Total Calories</th>
                        <td class="budgeted" colspan="2"><?php echo $weeklyBudgeted; ?></td>
                        <td class="totals"><?php echo $weeklyCal; ?></td>
                        <td class="balance"><?php echo $weeklyBalance; ?></td>
                    </tr>
                </tfoot>
                <tbody class="wccr">

                    <?php
                    $sqlDate = date("Y-m-d", strtotime($date));

                    $result = $mysqli->query("
		SELECT * FROM wccr 
		WHERE date='$sqlDate'
		");

                    while ($result && $row = $result->fetch_assoc()) {

                        $gross = $row['gross'];
                        $tare = $row['tare'];
                        $net = $gross - $tare;
                        $calPerGram = $row['calPerGram'];
                        $cal = $row['cal'];

                        $grossFormat = number_format($gross, 2);
                        $tareFormat = number_format($tare, 2);
                        $netFormat = number_format($net, 2);
                        $calPerGramFormat = number_format($calPerGram, 2);
                        $calFormat = number_format($cal, 2);

                        echo "
					<tr>
						<input class='id' type='hidden' value='$row[id]' />
						<td class='item'>
							<p>$row[item]</p>
							<input type='text' value='$row[item]' style='display:none' />
						</td>
						<td class='gross'>
							<p>$grossFormat</p>
							<input type='text' value='$gross' style='display:none' />
						</td>
						<td class='tare'>
							<p>$tareFormat</p>
							<input type='text' value='$tare' style='display:none' />
						</td>
						<td class='net'>
							<p>$netFormat</p>
							<input type='text' value='$net' style='display:none' />
						</td>
						<td class='calPerGram'>
							<p>$calPerGramFormat</p>
							<input type='text' value='$calPerGram' style='display:none' />
						</td>
						<td class='cal'>
							<p>$calFormat</p>
							<input type='text' value='$cal' style='display:none' />
						</td>
						<td class='submit'><input type='button' value='Remove' onclick='removeRow(this)'></td>
					</tr>	
			";
                    }
                    ?>
                </tbody>
            </table>
        </form>



    </body>
</html>