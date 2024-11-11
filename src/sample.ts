import type { SampleRaw } from './freeflightwx-db'

export interface Sample {
    id: number;
    time: Date;
    windDirectionDeg: number;
    windSpeedMph: number;
    windMinMph: number;
    windMaxMph: number;
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

