<?php
    
include 'classes/MySQL.php';

$mysql = new MySQL();
    
echo "'" . $mysql->updateNumbersWCCR(1, 70, 1, 3.7, 255.3) . "'";

echo "ok";


/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>
