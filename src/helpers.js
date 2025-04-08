export function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function wrapLongitude(lon) {
    lon = lon % 360;
    if (lon > 180) {
        lon -= 360;
    }
    if (lon < -180) {
        lon += 360;
    }
    return lon;
}

export function wrapLatitude(lat) {
    lat = ((lat + 90) % 180);
    if (lat < 0) lat += 180;
    lat -= 90;
    return lat;
}


export function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}
