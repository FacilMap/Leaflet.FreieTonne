import * as L from "leaflet";

function encodeQueryString(obj: Record<string, string | number>) {
    return Object.keys(obj).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

/**
 * Returns the API URL to fetch the Freie Tonne features for the given map view.
 */
export function getFreieTonneUrl(bounds: L.LatLngBounds, zoom: number): string {
    return `https://www.freietonne.de/seekarte-2.0/getOpenLayerPois.php?${encodeQueryString({
        ldez1: bounds.getWest(),
        ldez2: bounds.getEast(),
        bdez1: bounds.getNorth(),
        bdez2: bounds.getSouth(),
        zoom
    })}`;
}

export type FreieTonneFetchAdapter = (bounds: L.LatLngBounds, zoom: number) => Promise<string>;
const defaultFetchAdapter: FreieTonneFetchAdapter = (bounds, zoom) => fetch(getFreieTonneUrl(bounds, zoom)).then((res) => res.text());
let fetchAdapter = defaultFetchAdapter;

/**
 * Overrides the function to fetch the Freie Tonne features for the given map view. The default implementation is
 * `(bounds, zoom) => fetch(getFreieTonneUrl(bounds, zoom)).then((res) => res.text())`.
 * Setting `undefined` resets the adapter to the default implementation.
 */
export function setFreieTonneFetchAdapter(adapter: FreieTonneFetchAdapter | undefined): void {
    fetchAdapter = adapter ?? defaultFetchAdapter;
}

export interface FreieTonneFeature {
    latLng: L.LatLngTuple;
    iconUrl: string;
    iconSize: L.PointTuple;
    iconAnchor: L.PointTuple;
    popupAnchor: L.PointTuple;
    content: string;
}

/**
 * Takes the text file with features returned by the Freie Tonne API and parses it into an array of feature objects.
 */
export function decodeFreieTonneFeatures(content: string): Array<FreieTonneFeature> {
    return content.trim().split(/\r\n|\r|\n/).slice(1).map((line) => {
        const feature = line.split(/\t/);

        const latLng: L.LatLngTuple = [ Number(feature[0]), Number(feature[1]) ];
        const iconUrl = `https://www.freietonne.de/seekarte/${feature[6]}`;
        const iconSize = feature[4].split(",").map((n) => Number(n)) as L.PointTuple;
        const iconAnchor = feature[5].split(",").map((n, i) => iconSize[i] + Number(n)) as L.PointTuple;
        const popupAnchor: L.PointTuple = [ -iconAnchor[0] + Math.round(iconSize[0]/2), -iconAnchor[1] ];
        const content = cleanUpContent(feature[2], feature[3]);

        return { latLng, iconUrl, iconSize, iconAnchor, popupAnchor, content };
    });
}

/**
 * Fetches the Freie Tonne features (using the fetch adapter configured through `freieTonneFetchAdapter()` if set) using the API.
 */
export async function fetchFreieTonneFeatures(bounds: L.LatLngBounds, zoom: number): Promise<Array<FreieTonneFeature>> {
    const content = await fetchAdapter(bounds, zoom);
    return decodeFreieTonneFeatures(content);
}

/**
 * Sanitizes the popover content HTML returned by the Freie Tonne API. Each feature contains a header in column 3 and content in
 * column 4 that are meant to be shown in the popover when clicking on the feature. Both of these contain HTML tags for formatting,
 * but they contain some attributes that are specific to the Freie Tonne website and need to be removed for general use. This
 * function returns the final HTML code that should be used for the popover, including the header and the content.
 */
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