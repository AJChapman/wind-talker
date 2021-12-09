// Theme colours
const colorDanger      = '#ff0000';
const colorDangerMid   = '#ff6969';
const colorDangerBg    = '#ffd1d1';
const colorMarginal    = '#ffa700';
const colorMarginalMid = '#ffcb69';
const colorMarginalBg  = '#ffefd1';
const colorOn          = '#008100';
const colorOnMid       = '#69b569';
const colorOnBg        = '#d1e8d1';
const colorLow         = '#88cfec';
const colorLowMid      = '#b9e2f4';
const colorLowBg       = '#e9f5fb';
const colorAvg         = '#a56106';
const colorLull        = '#5381f2';
const colorPeak        = '#ff7de3';
const colorDirOn       = '#008100';
const colorDirOff      = '#8c4521';
const colorDir         = '#ffff00';

// Other drawing constants
const mphHeadroom = 4; // How many mph to graph above the maximum shown, so the peak doesn't touch the top of the graph

// Sites
const springHill = {
  name:             'Spring Hill',
  timezone:         'Australia/Sydney',
  speedLowMph:      13,
  speedOnMph:       18,
  speedMarginalMph: 22,
  speedMaxMph:      150, // max recordable wind speed to cancel out electrical interference
  dirOnDeg:         280,
  dirWidthDeg:      45,
  altitudeFt:       2870,
  dirAdjust:        0
};

// The time between samples, in seconds
const sampleIntervalSecs = 11.25;
const refreshIntervalSecs = 3;

// Utility functions
function mphToKt(mph) { return mph * 0.8689758; }
function mphToKmh(mph) { return mph * 1.609344; }
function clamp(x, l, h) { return Math.max(l, Math.min(h, x)); }
function secondsToSamples(sec) { return Math.floor(sec / sampleIntervalSecs); }
function msToSamples(ms) { return Math.floor(ms / secondsToMs(sampleIntervalSecs)); }
function samplesToSeconds(n) { return n * sampleIntervalSecs; }
function secondsToMs(sec) { return sec * 1000; }
function minutesToMs(min) { return min * 60000; }

// The largest period to update in one go
const maxUpdateSeconds = 24 * 60 * 60; // 24 hours
const maxUpdateSamples = secondsToSamples(maxUpdateSeconds);

function weightedMovingAverage(xs_, n_) {
  const n = n_;
  const xs = [...xs_];
  const denominator = n * (n + 1) / 2;

  // Construct an array of moving totals over the window
  var totals = [];
  xs.forEach((x, i, a) => {
      // To get a moving average for the first 'n' values we assume that the previous 'n' values were equal to the first value
      if (i == 0)
          totals.push(n * x);
      else {
          const prev = totals[i - 1];
          const dropoff = a[i - Math.min(i, n)];
          const total = prev + x - dropoff;
          totals.push(total);
      }
    });

  // Construct an array of moving numerators over the window
  var numerators = [];
  xs.forEach((x, i, a) => {
      if (i == 0) numerators.push(denominator * x);
      else {
          const prevNumerator = numerators[i - 1];
          const prevTotal = totals[i - 1];
          const numerator = prevNumerator + n * x - prevTotal;
          numerators.push(numerator);
      }
    });

  const wmas = numerators.map((numerator, i) => {
      return numerator / denominator;
    });

  return wmas;
}

function exponentialMovingAverage(xs_, alpha_) {
    const alpha = alpha_;
    const beta = 1.0 - alpha;
    xs = [...xs_];

    var ema = [];
    xs.forEach((x, i) => {
        ema.push(i == 0 ? x : alpha * x + beta * ema[i - 1]);
    });
    return ema;
}

function recentPeak(xs, n) { return recentSomething(Math.max, xs, n); }
function recentLull(xs, n) { return recentSomething(Math.min, xs, n); }

function recentSomething(fn, xs_, n_) {
  const n = n_;
  const xs = [...xs_];

  // This is O(n * length(xs)), so not terribly efficient
  var results = [];
  xs.forEach((x, i, a) => {
      var result = x;
      for (let j = Math.max(0, i - n); j < i; j++) {
          result = fn(result, a[j]);
      }
      results.push(result);
  });
  return results;
}

function graphWindStrength(site, data, {
  time,
  windMph,
  windMinMph,
  windMaxMph,
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 40, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 30, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  strokeLinecap = "round", // stroke line cap of the line
  strokeLinejoin = "round", // stroke line join of the line
  strokeWidth = 1.5, // stroke width of line, in pixels
  strokeOpacity = 1, // stroke opacity of line
  movingAverageSmoothingSecs = 112.5, // Smooth over an 11.25 second period (10 samples)
  movingAverageSmoothingN = secondsToSamples(movingAverageSmoothingSecs), // how many values to smooth the average line over
  movingAverageAlpha = 0.05, // Lower is smoother, 1.0 is no smoothing
  recentSecs = 600, // recent is 10 minutes
  recentN = secondsToSamples(recentSecs)
} = {}) {
  // Compute values.
  const Time = d3.map(data, time);
  const WindMph = d3.map(data, windMph);
  const WindMinMph = d3.map(data, windMinMph);
  const WindMaxMph = d3.map(data, windMaxMph);
  const I = d3.range(Time.length);

  const AvgMph = exponentialMovingAverage(WindMph, movingAverageAlpha);
  const RecentPeakMph = recentPeak(WindMaxMph, recentN);
  const RecentLullMph = recentLull(WindMinMph, recentN);

  const widthGraph = width - marginRight - marginLeft;
  const heightGraph = height - marginTop - marginBottom;

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(Time);

  // Scale up to at least the marginal wind strength, or the max wind strength shown, but no more than the site max.
  const graphMaxMph = Math.min(site.speedMaxMph, Math.max(d3.max(WindMaxMph) + mphHeadroom, site.speedMarginalMph));
  const mphDomain = [0, graphMaxMph];
  const ktDomain = [0, mphToKt(graphMaxMph)];
  const kmhDomain = [0, mphToKmh(graphMaxMph)];

  // Construct scales and axes.
  const xScale = d3.scaleTime(xDomain, xRange);
  const mphScale = d3.scaleLinear(mphDomain, yRange);
  const ktScale = d3.scaleLinear(ktDomain, yRange);
  const kmhScale = d3.scaleLinear(kmhDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 70).tickSizeOuter(0);
  const ktAxis = d3.axisRight(ktScale).ticks(height / 20, yFormat);
  const kmhAxis = d3.axisRight(kmhScale).ticks(height / 20, yFormat);

  const svg = d3.create("svg")
      .attr("width", width)
      // .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  // Show the kt y axis
  svg.append("g")
      .attr("transform", `translate(${width - marginRight / 2},0)`)
      .call(ktAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight / 2)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", marginRight / 4)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("kt"));

  // Show the kmh y axis
  svg.append("g")
      .attr("transform", `translate(${width - marginRight},0)`)
      .call(kmhAxis)
      //.call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", 0)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("kmh"));

   // Define the low zone clip path
   svg.append("clipPath")
       .attr("id", "clip-low")
       .append("rect")
           .attr("x", marginLeft)
           .attr("y", mphScale(site.speedLowMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(0) - mphScale(site.speedLowMph));

   // Define the on zone clip path
   svg.append("clipPath")
       .attr("id", "clip-on")
       .append("rect")
           .attr("x", marginLeft)
           .attr("y", mphScale(site.speedOnMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(site.speedLowMph) - mphScale(site.speedOnMph));

   // Define the marginal zone clip path
   svg.append("clipPath")
       .attr("id", "clip-marginal")
       .append("rect")
           .attr("x", marginLeft)
           .attr("y", mphScale(site.speedMarginalMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(site.speedOnMph) - mphScale(site.speedMarginalMph));

   // Define the danger zone clip path
   svg.append("clipPath")
       .attr("id", "clip-danger")
       .append("rect")
           .attr("x", marginLeft)
           .attr("y", mphScale(graphMaxMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(site.speedMarginalMph) - mphScale(graphMaxMph));

   // Draw the danger zone background
   svg.append("rect")
       .attr("fill", colorDangerBg)
       .attr("clip-path", "url(#clip-danger)")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", width)
       .attr("height", height);

   // Draw the marginal zone background
   svg.append("rect")
       .attr("fill", colorMarginalBg)
       .attr("clip-path", "url(#clip-marginal)")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", width)
       .attr("height", height);

   // Draw the on zone background
   svg.append("rect")
       .attr("fill", colorOnBg)
       .attr("clip-path", "url(#clip-on)")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", width)
       .attr("height", height);

   // Draw the low zone background
   svg.append("rect")
       .attr("fill", colorLowBg)
       .attr("clip-path", "url(#clip-low)")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", width)
       .attr("height", height);

   // Define the current wind band (between each sample's low and high)
   const windArea = d3.area()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y0(i => mphScale(WindMinMph[i]))
       .y1(i => mphScale(WindMaxMph[i]));

   // Define the area below the current wind band
   const windAreaBelow = d3.area()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y0(mphScale(0))
       .y1(i => mphScale(WindMinMph[i]));

   // Draw the low zone wind below the band
   svg.append("path")
       .attr("fill", colorLowMid)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-low)")
       .attr("d", windAreaBelow(I));

   // Draw the low zone wind band
   svg.append("path")
       .attr("fill", colorLow)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-low)")
       .attr("d", windArea(I));

   // Draw the on zone wind below the band
   svg.append("path")
       .attr("fill", colorOnMid)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-on)")
       .attr("d", windAreaBelow(I));

   // Draw the on zone wind band
   svg.append("path")
       .attr("fill", colorOn)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-on)")
       .attr("d", windArea(I));

   // Draw the marginal zone wind below the band
   svg.append("path")
       .attr("fill", colorMarginalMid)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-marginal)")
       .attr("d", windAreaBelow(I));

   // Draw the marginal zone wind band
   svg.append("path")
       .attr("fill", colorMarginal)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-marginal)")
       .attr("d", windArea(I));

   // Draw the danger zone wind below the band

   svg.append("path")
       .attr("fill", colorDangerMid)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-danger)")
       .attr("d", windAreaBelow(I));

   // Draw the danger zone wind band
   svg.append("path")
       .attr("fill", colorDanger)
       .attr("stroke", "none")
       .attr("clip-path", "url(#clip-danger)")
       .attr("d", windArea(I));

   // Draw the weighted moving average of averages
   const avgLine = d3.line()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y(i => mphScale(AvgMph[i]));
   svg.append("path")
       .attr("fill", "none")
       .attr("stroke", colorAvg)
       .attr("stroke-width", strokeWidth)
       .attr("stroke-linecap", strokeLinecap)
       .attr("stroke-linejoin", strokeLinejoin)
       .attr("stroke-opacity", strokeOpacity)
       .attr("stroke-miterlimit", 1)
       .attr("d", avgLine(I));

   // Draw the recent peak line
   const recentPeakLine = d3.line()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y(i => mphScale(RecentPeakMph[i]));
   svg.append("path")
       .attr("fill", "none")
       .attr("stroke", colorPeak)
       .attr("stroke-width", strokeWidth)
       .attr("stroke-linecap", strokeLinecap)
       .attr("stroke-linejoin", strokeLinejoin)
       .attr("stroke-opacity", strokeOpacity)
       .attr("stroke-miterlimit", 1)
       .attr("d", recentPeakLine(I));

   // Draw the recent lull line
   const recentLullLine = d3.line()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y(i => mphScale(RecentLullMph[i]));
   svg.append("path")
       .attr("fill", "none")
       .attr("stroke", colorLull)
       .attr("stroke-width", strokeWidth)
       .attr("stroke-linecap", strokeLinecap)
       .attr("stroke-linejoin", strokeLinejoin)
       .attr("stroke-opacity", strokeOpacity)
       .attr("stroke-miterlimit", 1)
       .attr("d", recentLullLine(I));

   return svg.node();
}

function parseData(obj) {
    obj.id = parseInt(obj.id);
    obj.time = d3.timeParse("%Y-%m-%d %H:%M:%S")(obj.time);
    obj.Windspeedmph = parseInt(obj.WindSpeedmph);
    obj.windspeedmphMin = parseInt(obj.WindspeedmphMin);
    obj.WindspeedmphMax = parseInt(obj.WindspeedmphMax);
    return obj;
}

function filterLatestMinutes(data, minutesToShow) {
    const last = data[data.length - 1];
    const latestMs = last.time.getTime();
    const earliestMs = latestMs - minutesToMs(minutesToShow);
    return d3.filter(data, d => d.time.getTime() >= earliestMs);
}

function formatHours(minutes) {
    const minutesNumber = minutes % 60;
    const minutesText = minutesNumber == 0 ? "" : (minutesNumber + (minutesNumber == 1 ? " minute" : " minutes"));
    if (minutes < 60) return minutesText;
    const hourNumber = Math.floor(minutes / 60);
    if (hourNumber == 1) return hourNumber + " hour" + (minutesText == "" ? "" : ", " + minutesText);
    return hourNumber + " hours" + (minutesText == "" ? "" : ", " + minutesText);
}

function windTalkerGraph(site, graphId, minutesId, rawjsonurl) {
    var data = [];
    var msLastUpdate = 0;
    var minutesToShow = 60;
    const graph = d3.select(graphId);

    function addData(newData) {
        // Concatenate and then sort and remove consecutive duplicates
        newData = data.concat(newData);
        newData.sort(function(a, b) { return a.id - b.id; });
        data = newData.filter((x, i, a) => {
            return (i == 0) || (x.id != a[i - 1].id);
        });
    }

    function oldestDataTime() { return data[0] ? data[0].time : new Date(); }
    function newestDataTime() { return data.length > 0 ? data[data.length - 1].time : new Date(); }

    function updateGraph() {
        dataToShow = filterLatestMinutes(data, minutesToShow);

        const svg = graphWindStrength(site, dataToShow, {
          time: d => d.time,
          windMph: d => d.Windspeedmph,
          windMinMph: d => d.WindspeedmphMin,
          windMaxMph: d => d.WindspeedmphMax,
          width: 1024,
          height: 400,
        });

        // For now we just remove the old graph and draw a new one.
        // It seems to be fast enough.
        graph.selectAll("svg").remove();
        graph.node().append(svg);
    }

    function poll() {
        const msNewUpdate = Date.now();
        const msDataAvailable = newestDataTime().getTime() - oldestDataTime().getTime();
        const msToShow = minutesToMs(minutesToShow);
        const msDataToRetrieve = msToShow > msDataAvailable ? msToShow : 0;
        const msNewToRetrieve = msNewUpdate - msLastUpdate;
        const msToRetrieve = Math.min(msToShow, msDataToRetrieve + msNewToRetrieve);
        const samplesToRetrieve = Math.max(1, msToSamples(msToRetrieve));

        console.log("Asking for " + samplesToRetrieve + " samples");
        d3.json(rawjsonurl + "?r=" + samplesToRetrieve).then(function(newData) {
            msLastUpdate = msNewUpdate;

            console.log(newData);
            addData(d3.map(newData, parseData));

            updateGraph();
        });

        // Ask for updated data soon
        setTimeout(poll, secondsToMs(refreshIntervalSecs));
    }

    const minutesSlider = d3.select(minutesId).node();
    console.log(minutesSlider);
    minutesSlider.oninput = function() {
        minutesToShow = this.value;
        d3.select('#minutesToShowLabel').text("Show " + formatHours(minutesToShow));
        console.log("Minutes to show changed to: " + minutesToShow);
        updateGraph();
    }

    poll();
}
