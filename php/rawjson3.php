<?php
    include 'sitedetails.php';

    $mysqli = new mysqli($server, $username, $password, $database);

    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    }

    $mostMs = 86400000; // 24 hours in milliseconds. This is the most samples we will return in one query.

    // Return the most recent records if another time isn't requested
    $latestMs = isset($_GET["latestMS"]) ? intval($_GET["latestMs"]) : 0;
    if ($latestMs <= 0) {
        $latestMs = time() * 1000;
    }

    $earliestMs = min($latestMs, max($latestMs - $mostMs, intval($_GET["earliestMs"])));

    $sql = sprintf("SELECT * FROM `%s` WHERE TimeMillis <= %d AND TimeMillis >= %d ORDER BY id DESC", $data_table, $latestMs, $earliestMs);

    $result = $mysqli->query($sql);

    if (!$result) die('Couldn\'t fetch records');

    $data = array();
    while($row = mysqli_fetch_assoc($result)){
        $data[]=$row;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
?>
