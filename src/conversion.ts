import { sampleIntervalSecs } from './freeflightwx-db'

export function mphToKt(mph: number): number { return mph * 0.8689758; }
export function mphToKmh(mph: number): number { return mph * 1.609344; }
export function ftToM(ft: number): number { return ft * 0.3048; }
//function clamp(x: number, l: number, h: number): number { return Math.max(l, Math.min(h, x)); }
export function secondsToSamples(sec: number): number { return Math.floor(sec / sampleIntervalSecs); }
// function samplesToMs(samples: number): number { return samples * secondsToMs(sampleIntervalSecs); }
export function msToSamples(ms: number): number { return Math.floor(ms / secondsToMs(sampleIntervalSecs)); }
//function samplesToSeconds(n: number): number { return n * sampleIntervalSecs; }
export function secondsToMs(sec: number): number { return sec * 1000; }
export function minutesToMs(min: number): number { return min * 60000; }

export function calculateDewpoint(temp: number, humidity: number): number {
    //http://www.faqs.org/faqs/meteorology/temp-dewpoint/
    const a = temp >= 0 ? 7.5 : 7.6
    const b = temp >= 0 ? 237.3 : 240.7
    
    // Saturation steam pressure for temperature
    const SSP = 6.1078 * Math.pow(10, (a * temp) / (b + temp))

    // Steam pressure
    const SP = humidity / 100.0 * SSP;
    const v  = Math.log10(SP / 6.1078);
    return b * v / (a - v)
}

export function calculateCloudbaseAGLft(temp: number, dewpoint: number): number {
    return 410.0 * (temp - dewpoint)
}

export function roundToDecimal(n: number, places: number): number {
    const power = 10 ** places
    return Math.round(n * power) / power
}
