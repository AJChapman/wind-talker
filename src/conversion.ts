import { sampleIntervalSecs } from './freeflightwx-db'

export function mphToKt(mph: number): number { return mph * 0.8689758; }
export function mphToKmh(mph: number): number { return mph * 1.609344; }
//function clamp(x: number, l: number, h: number): number { return Math.max(l, Math.min(h, x)); }
export function secondsToSamples(sec: number): number { return Math.floor(sec / sampleIntervalSecs); }
// function samplesToMs(samples: number): number { return samples * secondsToMs(sampleIntervalSecs); }
export function msToSamples(ms: number): number { return Math.floor(ms / secondsToMs(sampleIntervalSecs)); }
//function samplesToSeconds(n: number): number { return n * sampleIntervalSecs; }
export function secondsToMs(sec: number): number { return sec * 1000; }
export function minutesToMs(min: number): number { return min * 60000; }
