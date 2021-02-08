import { LatLngBounds, LatLngTuple, PointTuple } from "leaflet";

function encodeQueryString(obj: Record<string, string | number>) {
    return Object.keys(obj).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

export function getFreieTonneUrl(bounds: LatLngBounds, zoom: number) {
    return `https://www.freietonne.de/seekarte/getOpenLayerPois.php?${encodeQueryString({
        ldez1: bounds.getWest(),
        ldez2: bounds.getEast(),
        bdez1: bounds.getNorth(),
        bdez2: bounds.getSouth(),
        zoom
    })}`;
}

export interface FreieTonneFeature {
    latLng: LatLngTuple;
    iconUrl: string;
    iconSize: PointTuple;
    iconAnchor: PointTuple;
    popupAnchor: PointTuple;
    content: string;
}

export function decodeFreieTonneFeatures(content: string): Array<FreieTonneFeature> {
    return content.trim().split(/\r\n|\r|\n/).slice(1).map((line) => {
        const feature = line.split(/\t/);

        const latLng: LatLngTuple = [ Number(feature[0]), Number(feature[1]) ];
        const iconUrl = `https://www.freietonne.de/seekarte/${feature[6]}`;
        const iconSize = feature[4].split(",").map((n) => Number(n)) as PointTuple;
        const iconAnchor = feature[5].split(",").map((n, i) => iconSize[i] + Number(n)) as PointTuple;
        const popupAnchor: PointTuple = [ -iconAnchor[0] + Math.round(iconSize[0]/2), -iconAnchor[1] ];
        const content = cleanUpContent(feature[2], feature[3]);

        return { latLng, iconUrl, iconSize, iconAnchor, popupAnchor, content };
    });
}

export async function fetchFreieTonneFeatures(bounds: LatLngBounds, zoom: number): Promise<Array<FreieTonneFeature>> {
    const content = await fetch(getFreieTonneUrl(bounds, zoom)).then((res) => res.text());
    return decodeFreieTonneFeatures(content);
}

export function cleanUpContent(header: string, content: string): string {
    if (content === '')
        return '';

    const result = document.createElement('div');
    result.innerHTML = content;

    const headerEl = document.createElement('h2');
    headerEl.innerHTML = header;
    if (headerEl.innerText.trim() !== '')
        result.prepend(headerEl);

    for (const el of Array.from(result.querySelectorAll("a,span"))) {
        while (el.firstChild)
            el.parentNode!.insertBefore(el.firstChild, el);
        el.parentNode!.removeChild(el);
    }

    for (const el of Array.from(result.querySelectorAll("[style],[onclick]"))) {
        el.removeAttribute('style');
        el.removeAttribute('onclick');
    }

    return result.innerHTML;
}