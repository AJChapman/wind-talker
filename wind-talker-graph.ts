import * as d3 from 'd3';

interface Site {
    name: string;
    timezone: string;
    speedLowMph: number;
    speedOnMph: number;
    speedMarginalMph: number;
    speedMaxMph: number;
    dirOnDeg: number;
    dirWidthDeg: number;
    altitudeFt: number;
    dirAdjust: number;
}

interface SampleRaw {
    id: string;
    time: string;
    Station: string;
    Winddir: string;
    Windspeedmph: string;
    WindspeedmphMax: string;
    WindspeedmphMin: string;
    TimeMillis: string;
    Tempc: string;
    Humidity: string;
    QNH: string;
    PowerOnIndex: string;
    CSQ: string;
    Battery: string;
}

interface Sample {
    id: number;
    time: Date;
    windDirectionDeg: number;
    windSpeedMph: number;
    windMinMph: number;
    windMaxMph: number;
}

// Theme colours
const colorDanger:      string = '#ff0000';
const colorDangerMid:   string = '#ff6969';
const colorDangerBg:    string = '#ffd1d1';
const colorMarginal:    string = '#ffa700';
const colorMarginalMid: string = '#ffcb69';
const colorMarginalBg:  string = '#ffefd1';
const colorOn:          string = '#008100';
const colorOnMid:       string = '#69b569';
const colorOnBg:        string = '#d1e8d1';
const colorLow:         string = '#88cfec';
const colorLowMid:      string = '#b9e2f4';
const colorLowBg:       string = '#e9f5fb';
const colorAvg:         string = '#a56106';
const colorLull:        string = '#5381f2';
const colorPeak:        string = '#ff7de3';
const colorDirOn:       string = '#008100';
const colorDirOff:      string = '#8c4521';
const colorDir:         string = '#ffff00';

// Other drawing constants
const mphHeadroom: number = 4; // How many mph to graph above the maximum shown, so the peak doesn't touch the top of the graph

// Sites
const springHill: Site = {
  name:             'Spring Hill',
  timezone:         'Australia/Sydney',
  speedLowMph:      13,
  speedOnMph:       18,
  speedMarginalMph: 22,
  speedMaxMph:      150, // max recordable wind speed to cancel out electrical interference
  dirOnDeg:         280,
  dirWidthDeg:      90,
  altitudeFt:       2870,
  dirAdjust:        0
};

// The time between samples, in seconds
const sampleIntervalSecs: number = 11.25;
const refreshIntervalSecs: number = sampleIntervalSecs;

// Utility functions
function mphToKt(mph: number): number { return mph * 0.8689758; }
function mphToKmh(mph: number): number { return mph * 1.609344; }
function clamp(x: number, l: number, h: number): number { return Math.max(l, Math.min(h, x)); }
function secondsToSamples(sec: number): number { return Math.floor(sec / sampleIntervalSecs); }
function samplesToMs(samples: number): number { return samples * secondsToMs(sampleIntervalSecs); }
function msToSamples(ms: number): number { return Math.floor(ms / secondsToMs(sampleIntervalSecs)); }
function samplesToSeconds(n: number): number { return n * sampleIntervalSecs; }
function secondsToMs(sec: number): number { return sec * 1000; }
function minutesToMs(min: number): number { return min * 60000; }

// The largest period to update in one go
const maxUpdateSeconds: number = 24 * 60 * 60; // 24 hours
const maxUpdateSamples: number = secondsToSamples(maxUpdateSeconds);

function exponentialMovingAverage(xs: readonly number[], alpha: number): number[] {
    // alpha should be between 0.0 and 1.0, and is the weight of the latest sample
    const beta: number = 1.0 - alpha;

    let ema: number[] = [];
    xs.forEach((x: number, i: number) => {
        const prev = ema[i - 1];
        ema.push(prev === undefined ? x : alpha * x + beta * prev);
    });
    return ema;
}

function recentPeak(xs: readonly number[], n: number): number[] { return recent(Math.max, xs, n); }
function recentLull(xs: readonly number[], n: number): number[] { return recent(Math.min, xs, n); }

function recent(fn: (x: number, y: number) => number, xs: readonly number[], n: number): number[] {
  // This is O(n * length(xs)), so not terribly efficient
  let results: number[] = [];
  xs.forEach((x, i, a) => {
      let result = x;
      for (let j = Math.max(0, i - n); j < i; j++) {
          const val = a[j];
          if (typeof val !== 'undefined') result = fn(result, val);
      }
      results.push(result);
  });
  return results;
}

interface WindGraphArgs {
  curve?: d3.CurveFactory; // method of interpolation between points
  marginTop?: number; // top margin, in pixels
  marginRight?: number; // right margin, in pixels
  marginBottom?: number; // bottom margin, in pixels
  marginLeft?: number; // left margin, in pixels
  marginsX?: number;
  marginMiddle?: number; // between the graphs
  marginsY?: number;
  width?: number; // outer width, in pixels
  heightGraph?: number;
  yGraphBottom?: number;
  yGraphTop?: number;
  widthKt?: number;
  xKt?: number;
  widthKmh?: number;
  xKmh?: number;
  widthScales?: number;
  widthMarginsScales?: number;
  widthGraph?: number;
  xGraph?: number;
  hDir?: number; // height of the wind direction graph
  xDir?: number;
  yDir?: number;
  dirRange?: number[];
  heightTotal?: number;
  xRange?: number[];// [left, right]
  yRange?: number[], // [bottom, top]
  strokeLinecap?: string; // stroke line cap of the line
  strokeLinejoin?: string; // stroke line join of the line
  strokeWidth?: number; // stroke width of line, in pixels
  strokeOpacity?: number; // stroke opacity of line
  movingAverageSmoothingSecs?: number; // Smooth over an 11.25 second period (10 samples)
  movingAverageSmoothingN?: number; // how many values to smooth the average line over
  movingAverageAlpha?: number; // Lower is smoother, 1.0 is no smoothing
  recentSecs?: number; // recent is 10 minutes
  recentN?: number;
}

function graphWindStrength(site: Site, samples: Sample[], {
  curve = d3.curveBumpX, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 20, // right margin, in pixels
  marginBottom = 20, // bottom margin, in pixels
  marginLeft = 20, // left margin, in pixels
  marginsX = marginLeft + marginRight,
  marginMiddle = 25, // between the graphs
  marginsY = marginTop + marginBottom + marginMiddle,
  width = 640, // outer width, in pixels
  heightGraph = 200,
  yGraphBottom = marginTop + heightGraph,
  yGraphTop = marginTop,
  widthKt = 20,
  xKt = width - marginsX - widthKt,
  widthKmh = 30,
  xKmh = xKt - widthKmh,
  widthScales = widthKt + widthKmh,
  widthMarginsScales = marginsX + widthScales,
  widthGraph = width - widthMarginsScales,
  xGraph = marginLeft,
  hDir = 100, // height of the wind direction graph
  xDir = xGraph,
  yDir = yGraphBottom + marginMiddle,
  dirRange = [yDir, yDir + hDir],
  heightTotal = marginsY + heightGraph + hDir,
  xRange = [xGraph, xGraph + widthGraph], // [left, right]
  yRange = [yGraphBottom, yGraphTop], // [bottom, top]
  strokeLinecap = "round", // stroke line cap of the line
  strokeLinejoin = "round", // stroke line join of the line
  strokeWidth = 1.5, // stroke width of line, in pixels
  strokeOpacity = 1, // stroke opacity of line
  movingAverageAlpha = 0.05, // Lower is smoother, 1.0 is no smoothing
  recentSecs = 600, // recent is 10 minutes
  recentN = secondsToSamples(recentSecs)
}: WindGraphArgs = {}) {
  // Compute values.
  const Time = d3.map(samples, s => s.time);
  const WindMph = d3.map(samples, s => s.windSpeedMph);
  const WindMinMph = d3.map(samples, s => s.windMinMph);
  const WindMaxMph = d3.map(samples, s => s.windMaxMph);
  const Dir = d3.map(samples, s => s.windDirectionDeg);
  const I = d3.range(Time.length);

  const AvgMph = exponentialMovingAverage(WindMph, movingAverageAlpha);
  const RecentPeakMph = recentPeak(WindMaxMph, recentN);
  const RecentLullMph = recentLull(WindMinMph, recentN);

  // Compute default domains.
  const xDomain = (function(e: [Date, Date] | [undefined, undefined]): [Date, Date] {
      let [a, b] = e;
      const a_ = typeof a === 'undefined' ? new Date() : a;
      const b_ = typeof b === 'undefined' ? new Date() : b;
      return [a_, b_];
    })(d3.extent(Time));

  // Scale up to at least the marginal wind strength, or the max wind strength shown, but no more than the site max.
  const sampleMaxMph = d3.max(WindMaxMph);
  const graphMaxMph = Math.min(site.speedMaxMph, Math.max((sampleMaxMph ? sampleMaxMph : 0) + mphHeadroom, site.speedMarginalMph));
  const mphDomain = [0, graphMaxMph];
  const ktDomain = [0, mphToKt(graphMaxMph)];
  const kmhDomain = [0, mphToKmh(graphMaxMph)];
  const dirDomain = [0, 359]; // degrees
  const dirStartDeg = site.dirOnDeg - site.dirWidthDeg / 2;
  const dirEndDeg = site.dirOnDeg + site.dirWidthDeg / 2;

  // Construct scales and axes.
  const xScale = d3.scaleTime(xDomain, xRange);
  const mphScale = d3.scaleLinear(mphDomain, yRange);
  const ktScale = d3.scaleLinear(ktDomain, yRange);
  const kmhScale = d3.scaleLinear(kmhDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(widthGraph / 70).tickSizeOuter(0);
  const ktAxis = d3.axisRight(ktScale).ticks(heightGraph / 20);
  const kmhAxis = d3.axisRight(kmhScale).ticks(heightGraph / 20);
  const dirScale = d3.scaleLinear(dirDomain, dirRange);
  const cardinalScale = d3.scalePoint(["N", "NE", "E", "SE", "S", "SW", "W", "NW", ""], dirRange);
  const cardinalAxis = d3.axisRight(cardinalScale);

  const svg = d3.create("svg")
      .attr("width", width)
      // .attr("height", height)
      .attr("viewBox", [0, 0, width, heightTotal])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(0,${yGraphBottom})`)
      .call(xAxis);

  // Show the kt y axis
  svg.append("g")
      .attr("transform", `translate(${xGraph + widthGraph + widthKmh},0)`)
      .call(ktAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          // .attr("x2", xKt)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", 5)
          .attr("y", marginTop / 2)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("kt"));

  // Show the kmh y axis
  svg.append("g")
      .attr("transform", `translate(${xGraph + widthGraph},0)`)
      .call(kmhAxis)
      //.call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          // .attr("x2", xKmh)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", 5)
          .attr("y", marginTop / 2)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("kmh"));

   // Define the low zone clip path
   svg.append("clipPath")
       .attr("id", "clip-low")
       .append("rect")
           .attr("x", xGraph)
           .attr("y", mphScale(site.speedLowMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(0) - mphScale(site.speedLowMph));

   // Define the on zone clip path
   svg.append("clipPath")
       .attr("id", "clip-on")
       .append("rect")
           .attr("x", xGraph)
           .attr("y", mphScale(site.speedOnMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(site.speedLowMph) - mphScale(site.speedOnMph));

   // Define the marginal zone clip path
   svg.append("clipPath")
       .attr("id", "clip-marginal")
       .append("rect")
           .attr("x", xGraph)
           .attr("y", mphScale(site.speedMarginalMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(site.speedOnMph) - mphScale(site.speedMarginalMph));

   // Define the danger zone clip path
   svg.append("clipPath")
       .attr("id", "clip-danger")
       .append("rect")
           .attr("x", xGraph)
           .attr("y", mphScale(graphMaxMph))
           .attr("width", widthGraph)
           .attr("height", mphScale(site.speedMarginalMph) - mphScale(graphMaxMph));

   // Draw the danger zone background
   svg.append("rect")
       .attr("fill", colorDangerBg)
       .attr("clip-path", "url(#clip-danger)")
       .attr("x", xGraph)
       .attr("y", 0)
       .attr("width", widthGraph)
       .attr("height", heightGraph);

   // Draw the marginal zone background
   svg.append("rect")
       .attr("fill", colorMarginalBg)
       .attr("clip-path", "url(#clip-marginal)")
       .attr("x", xGraph)
       .attr("y", 0)
       .attr("width", widthGraph)
       .attr("height", heightGraph);

   // Draw the on zone background
   svg.append("rect")
       .attr("fill", colorOnBg)
       .attr("clip-path", "url(#clip-on)")
       .attr("x", xGraph)
       .attr("y", 0)
       .attr("width", widthGraph)
       .attr("height", heightGraph);

   // Draw the low zone background
   svg.append("rect")
       .attr("fill", colorLowBg)
       .attr("clip-path", "url(#clip-low)")
       .attr("x", xGraph)
       .attr("y", 0)
       .attr("width", widthGraph)
       .attr("height", heightGraph);

   // Define the current wind band (between each sample's low and high)
   const windArea = d3.area<number>()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y0(i => mphScale(WindMinMph[i]))
       .y1(i => mphScale(WindMaxMph[i]));

   // Define the area below the current wind band
   const windAreaBelow = d3.area<number>()
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
   const avgLine = d3.line<number>()
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
   const recentPeakLine = d3.line<number>()
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
   const recentLullLine = d3.line<number>()
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

   // Draw the direction background
   svg.append("rect")
      .attr("fill", colorDirOff)
      .attr("x", xDir)
      .attr("y", yDir)
      .attr("width", widthGraph)
      .attr("height", hDir);

   // Draw the good direction band
   svg.append("rect")
       .attr("fill", colorDirOn)
       .attr("x", xDir)
       .attr("y", dirScale(dirStartDeg))
       .attr("width", widthGraph)
       .attr("height", dirScale(dirEndDeg) - dirScale(dirStartDeg));
   
  // Show the direction scale
  svg.append("g")
      .attr("transform", `translate(${xGraph + widthGraph},0)`)
      .call(cardinalAxis);

   const dirLine = d3.line<number>()
       .curve(curve)
       .x(i => xScale(Time[i]))
       .y(i => dirScale(Dir[i]));
   svg.append("path")
       .attr("fill", "none")
       .attr("stroke", colorDir)
       .attr("stroke-width", strokeWidth)
       .attr("stroke-linecap", strokeLinecap)
       .attr("stroke-linejoin", strokeLinejoin)
       .attr("stroke-opacity", strokeOpacity)
       .attr("stroke-miterlimit", 1)
       .attr("d", dirLine(I));

   return svg.node();
}

function parseSample(obj: SampleRaw): Sample {
    return {
        id: parseInt(obj.id),
        time: new Date(parseInt(obj.TimeMillis)),
        windDirectionDeg: parseInt(obj.Winddir),
        windSpeedMph: parseFloat(obj.Windspeedmph),
        windMinMph: parseInt(obj.WindspeedmphMin),
        windMaxMph: parseInt(obj.WindspeedmphMax)
    };
}

function filterLatestMinutes(samples: Sample[], minutesToShow: number): Sample[] {
    if (samples.length == 0) return samples;
    const last = samples[samples.length - 1];
    const latestMs = last.time.getTime();
    const earliestMs = latestMs - minutesToMs(minutesToShow);
    return d3.filter(samples, d => d.time.getTime() >= earliestMs);
}

function formatHours(minutes: number): string {
    const minutesNumber = minutes % 60;
    const minutesText = minutesNumber == 0 ? "" : (minutesNumber + (minutesNumber == 1 ? " minute" : " minutes"));
    if (minutes < 60) return minutesText;
    const hourNumber = Math.floor(minutes / 60);
    if (hourNumber == 1) return hourNumber + " hour" + (minutesText == "" ? "" : ", " + minutesText);
    return hourNumber + " hours" + (minutesText == "" ? "" : ", " + minutesText);
}

function isElement(elt: d3.BaseType): elt is Element {
    return (elt as Element).className !== undefined;
}

function windTalkerGraph(site: Site, graph: HTMLElement, minutesSlider: HTMLElement, rawjsonurl: string) {
    let samples: Sample[] = [];
    let msLastUpdate = 0;
    let minutesToShow = 60;
    let pollTimeout: number | null = null;
    const refreshIntervalMs = secondsToMs(refreshIntervalSecs);
    const uiUpdateIntervalMs = 300;

    function addData(newData: Sample[]) {
        // Concatenate and then sort and remove consecutive duplicates
        newData = samples.concat(newData);
        newData.sort(function(a, b) { return a.id - b.id; });
        samples = newData.filter((x, i, a) => {
            return (i == 0) || (x.id != a[i - 1].id);
        });
        console.log(samples);
    }

    function oldestDataTime() { return samples[0] ? samples[0].time : new Date(); }
    function newestDataTime() { return samples.length > 0 ? samples[samples.length - 1].time : new Date(); }

    function updateGraph() {
        const samplesToShow = filterLatestMinutes(samples, minutesToShow);

        const computedStyle = window.getComputedStyle(graph);
        const svg = graphWindStrength(site, samplesToShow, {
          width: parseInt(computedStyle.width),
        });

        // For now we just remove the old graph and draw a new one.
        // It seems to be fast enough.
        d3.select(graph).selectAll("svg").remove();
        graph.append(svg);
    }

    function pollSoon(delayMs: number): void {
        clearTimeout(pollTimeout);
        pollTimeout = setTimeout(poll, delayMs);
    }

    function poll() {
        pollTimeout = null;
        const msNewUpdate = Date.now();
        const msDataAvailable = newestDataTime().getTime() - oldestDataTime().getTime() + samplesToMs(2); // Add 2 samples to account for rounding
        const msToShow = minutesToMs(minutesToShow);
        const msDataToRetrieve = msToShow > msDataAvailable ? msToShow : 0;
        const msNewToRetrieve = msNewUpdate - msLastUpdate;
        const msToRetrieve = Math.min(msToShow, msDataToRetrieve + msNewToRetrieve) + 1;
        const samplesToRetrieve = msToSamples(msToRetrieve);

        if (samplesToRetrieve > 0) {
            console.log("Asking for " + samplesToRetrieve + " samples");
            d3.json(rawjsonurl + "?r=" + samplesToRetrieve).then(function(newData) {
                msLastUpdate = msNewUpdate;

                
                addData(d3.map(newData, parseSample));

                updateGraph();

            });
        }

        // Ask for updated samples soon
        pollSoon(refreshIntervalMs);
    }

    minutesSlider.oninput = function() {
        minutesToShow = this.value;
        d3.select('#minutesToShowLabel').text("Showing " + formatHours(minutesToShow));
        console.log("Minutes to show changed to: " + minutesToShow);
        updateGraph();
        pollSoon(uiUpdateIntervalMs);
    }

    window.onresize = function() {
        updateGraph();
    }

    // Changing the minutes slider triggers a poll, so we do this to start
    minutesSlider.oninput();
}
