import {windTalkerGraph, springHill} from './wind-talker-graph';

document.addEventListener("DOMContentLoaded", function() {
    const graph = document.getElementById('graph');
    const minutesSlider = document.getElementById('minutesToShow');
    if (graph !== null && minutesSlider !== null) {
        windTalkerGraph(springHill, graph, minutesSlider, "http://localhost:8010/proxy/acthpa/springhill/rawjson2.php");
    }
});
