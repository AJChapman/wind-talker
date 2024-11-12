// See also static/fetch.php for the SQL query
export interface SampleRaw {
    id: string;
    Winddir: string;
    Windspeedmph: string;
    WindspeedmphMax: string;
    WindspeedmphMin: string;
    TimeMillis: string;
}

// These fields are included when 'allFields' URL param is given to fetch.php
export interface SampleRawFull extends SampleRaw {
    time: string;
    Station: string;
    Tempc: string;
    Humidity: string;
    QNH: string;
    PowerOnIndex: string;
    CSQ: string;
    Battery: string;
}

export const sampleIntervalSecs: number = 11.25;
