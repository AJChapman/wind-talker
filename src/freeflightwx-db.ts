// Commented-out fields are available in the db but we don't fetch them to save on space.
// See also php/fetch.php for the SQL query
export interface SampleRaw {
    id: string;
    // time: string;
    // Station: string;
    Winddir: string;
    Windspeedmph: string;
    WindspeedmphMax: string;
    WindspeedmphMin: string;
    TimeMillis: string;
    // Tempc: string;
    // Humidity: string;
    // QNH: string;
    // PowerOnIndex: string;
    // CSQ: string;
    // Battery: string;
}

export const sampleIntervalSecs: number = 11.25;
