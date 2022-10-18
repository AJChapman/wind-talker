export interface SampleRaw {
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

export const sampleIntervalSecs: number = 11.25;
