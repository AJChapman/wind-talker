<?php

//load database parameters
include 'secrets.php';

//0. Establish database connection.
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $mysqli = new mysqli($server, $username, $password, $database);
} catch (Exception $e) {
    echo "Failed to connect to MySQL.\r\n";
    echo("Measurement not stored - try again.\r\n");
    exit;
}

$sql = "SELECT * FROM station_list AS st INNER JOIN site_list AS si ON st.site_uniqueName = si.site_uniqueName GROUP BY si.site_uniqueName";
$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    echo("// This file has been auto-generated.\n");
    echo("// Do not edit it directly.\n");
    echo("// Instead, regenerate it by running https://freeflightwx.com/new/export_sites.php and saving its contents here.\n");
    echo("import type { Site } from './site'\n\n");
    while ($row = $result->fetch_assoc()) {
        if (empty($row['site_uniqueName']) or empty($row['web_name']) or $row['site_uniqueName'] === 'test') continue;

        echo("export const {$row['site_uniqueName']}: Site =\n");
        echo("    { name: '" . addslashes($row['web_name']) . "'\n");
        echo("    , group: undefined\n");
        echo("    , path: '{$row['web_path']}'\n");
        echo("    , timezone: '{$row['web_timezone']}'\n");
        echo("    , speedLowMph: {$row['site_speedLowMph']}\n");
        echo("    , speedOnMph: {$row['site_speedOnMph']}\n");
        echo("    , speedMarginalMph: {$row['site_speedMarginalMph']}\n");
        echo("    , speedMaxMph: {$row['site_speedMaxMph']}\n");
        echo("    , directions: [ { centerDeg: {$row['site_centerDeg']}\n");
        echo("                    , halfWidthDeg: {$row['site_halfWidthDeg']}\n");
        if (!empty($row['site_centerDeg2'])) {
            echo("                    }\n");
            echo("                  , { centerDeg: {$row['site_centerDeg2']}\n");
            echo("                    , halfWidthDeg: {$row['site_halfWidthDeg2']}\n");
        }
        echo("                  } ]\n");
        echo("    , altitudeFt: {$row['site_altitudeFt']}\n");
        echo("    , dirAdjust: {$row['site_dirAdjust']}\n");
        echo("    , dirOnCentre: ");
        echo(empty($row['site_centerDeg2']) ? 'undefined' : $row['site_dirOnCentre']);
        echo("\n");
        echo("}\n\n");
    }
}

?>
