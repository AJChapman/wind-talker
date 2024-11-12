<?php
    include 'secrets.php';

    ini_set('zlib.output_compression', 1);

    // Fix for CORS when testing on localhost
    header('Access-Control-Allow-Origin: *');

    $data_tables = array(
       'buckland' => 'buckland',
       'corryong' => 'corryong',
       'crackneck' => 'crackneck',
       'emu' => 'emu',
       'gundowring' => 'gundowring',
       'killarney' => 'killarney',
       'lanyon' => 'lanyon',
       'mama' => 'mama',
       'mtinkerman' => 'mtinkerman',
       'porepunkah' => 'porepunkah',
       'singlehill' => 'singlehill',
       'softys' => 'softys',
       'springhill' => 'spring_hill',
       'stanwell' => 'stanwell',
       'stringybark' => 'stringybark',
       'tunk4' => 'tunk4',
       'wilsons' => 'wilsons',
       'lakegeorge' => 'lakegeorge',
       'mystic' => 'mystic',
       'flowerdale' => 'flowerdale',
       'mtbroughton' => 'mtbroughton',
       'pops' => 'pops',
       'tunk' => 'tunk',
       'kuratake' => 'kuratake',
       'eclipselx' => 'eclipselx',
       'eclipselx2' => 'eclipselx2',
       'eclipselx3' => 'eclipselx3',
       'hooleydooley' => 'hooleydooley',
       'lakestclaire' => 'lakestclaire',
       'stringybark' => 'stringybark',
       'temp' => 'temp',
       'test' => 'test',
       'winton' => 'winton',
       'woodstock' => 'woodstock'
    );

    if (!array_key_exists($_GET['site'], $data_tables)) {
        die("Unknown site: " . $_GET['site']);
    }
    $data_table = $data_tables[$_GET['site']];

    $mysqli = new mysqli($server, $username, $password, $database);

    if ($mysqli->connect_errno) {
        die("Failed to connect to MySQL: " . $mysqli->connect_error);
    }

    // 24 hours in milliseconds, plus some fudge room.
    // This is the most samples we will return in one query.
    $mostMs = 86400000 + 60000;

    $sql = '';
    $fields = 'id, TimeMillis, Winddir, Windspeedmph, WindspeedmphMin, WindspeedmphMax';

    if (isset($_GET["allFields"])) $fields = '*';

    if (isset($_GET["toMs"])) {
        // Return samples between fromMs and toMs
        $toMs = intval($_GET["toMs"]);
        $fromMs = min($toMs, max($toMs - $mostMs, intval($_GET["fromMs"])));
        // Return the most recent records if another time isn't requested
        $sql = sprintf("SELECT %s FROM `%s` WHERE TimeMillis < %d AND TimeMillis >= %d ORDER BY id DESC", $fields, $data_table, $toMs, $fromMs);
    } else {
        // No toMs requested, so return the latest data
        $nowMs = time() * 1000;
        $fromMs = max($nowMs - $mostMs, intval($_GET["fromMs"]));
        $sql = sprintf("SELECT %s FROM `%s` WHERE TimeMillis > %d ORDER BY id DESC", $fields, $data_table, $fromMs);
    }

    $result = $mysqli->query($sql);

    if (!$result) die('Couldn\'t fetch records');

    $data = array();
    while($row = mysqli_fetch_assoc($result)){
        $data[]=$row;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
?>
