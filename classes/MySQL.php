<?php

define(DB_SERVER, 'localhost');
define(DB_USER, 'alan_alan');
define(DB_PASSWORD, 'ze3^717?0F-e');
define(DB_NAME, 'alan_wccr');

class MySQL {

    private $mysqli;

    function __construct() {
        $this->mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
        if ($this->conn->connect_error)
            die("<h3>Database Error: $this->conn->connect_error</h3>");
    }

    function insertRowWCCR($item, $gross, $tare, $calPerGram, $cal, $date) {
        $item = $this->mysqli->real_escape_string($item);

        $gross = is_numeric($gross) && $gross >= 0 ? $gross : 0;
        $tare = is_numeric($tare) && $tare >= 0 ? $tare : 0;
        $calPerGram = is_numeric($calPerGram) && $calPerGram >= 0 ? $calPerGram : 0;
        $cal = is_numeric($cal) && $cal >= 0 ? $cal : 0;

        $query = "
            INSERT INTO wccr (`item`, `gross`, `tare`, `calPerGram`, `cal`, `date`)
			VALUES (?, ?, ?, ?, ?, ?)
            ";

        $stmt = $this->mysqli->prepare($query);
        if ($stmt) {
            $stmt->bind_param('sdddds', $item, $gross, $tare, $calPerGram, $cal, $date);
            return $stmt->execute();
        }
    }

    function updateNumbersWCCR($id, $gross, $tare, $calPerGram, $cal) {
        if ($id < 0) {
            return false;
        }

        $gross = is_numeric($gross) && $gross >= 0 ? $gross : 0;
        $tare = is_numeric($tare) && $tare >= 0 ? $tare : 0;
        $calPerGram = is_numeric($calPerGram) && $calPerGram >= 0 ? $calPerGram : 0;
        $cal = is_numeric($cal) && $cal >= 0 ? $cal : 0;
        
        $query =  "
            UPDATE wccr
            SET gross=?, tare=?, calPerGram=?, cal=?
            WHERE id=?
            ";
        
        $stmt = $this->mysqli->prepare($query);
        if ($stmt) {
            $stmt->bind_param('sdddds', $gross, $tare, $calPerGram, $cal, $id);
            return $stmt->execute();
        }
    }

}

?>
