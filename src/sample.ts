import type { SampleRaw, SampleRawFull } from './freeflightwx-db'
import { calculateDewpoint, calculateCloudbaseAGLft } from './conversion'

export interface Sample {
    id: number;
    time: Date;
    windDirectionDeg: number;
    windSpeedMph: number;
    windMinMph: number;
    windMaxMph: number;
}

export interface SampleFull extends Sample {
    index: number;
    pressure: number;
    qnh: number;
    temperature: number;
    humidity: number;
    dewPoint: number;
    cloudbaseAGLft: number;
    battery: number;
    csq: number;
}

export function parseSample(obj: SampleRaw): Sample {
    return {
        id: parseInt(obj.id),
        time: new Date(parseInt(obj.TimeMillis)),
        windDirectionDeg: parseInt(obj.Winddir),
        windSpeedMph: parseFloat(obj.Windspeedmph),
        windMinMph: parseInt(obj.WindspeedmphMin),
        windMaxMph: parseInt(obj.WindspeedmphMax)
    };
}

export function parseSampleFull(obj: SampleRawFull): SampleFull {
    const sample = parseSample(obj)
    const qnh = parseInt(obj.QNH)
    const temp = parseFloat(obj.Tempc)
    const humidity = parseFloat(obj.Humidity)
    const dewpoint = calculateDewpoint(temp, humidity)
    const extraFields = {
        index: parseInt(obj.PowerOnIndex),
        pressure: qnh,
        qnh: parseInt(Math.round(qnh)),
        temperature: temp,
        humidity: humidity,
        dewPoint: dewpoint,
        cloudbaseAGLft: calculateCloudbaseAGLft(temp, dewpoint),
        battery: parseFloat(obj.Battery),
        csq: parseInt(obj.CSQ)
    }
    return { ...sample, ...extraFields }
}
