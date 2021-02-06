import { LatLngBounds, LatLngTuple, PointTuple } from "leaflet";
export declare function getFreieTonneUrl(bounds: LatLngBounds, zoom: number): string;
export interface FreieTonneFeature {
    latLng: LatLngTuple;
    iconUrl: string;
    iconSize: PointTuple;
    iconAnchor: PointTuple;
    popupAnchor: PointTuple;
    content: string;
}
export declare function decodeFreieTonneFeatures(content: string): Array<FreieTonneFeature>;
export declare function defaultFetchWrapper(url: string): Promise<string>;
export declare function fetchFreieTonneFeatures(bounds: LatLngBounds, zoom: number, fetchWrapper?: typeof defaultFetchWrapper): Promise<Array<FreieTonneFeature>>;
export declare function cleanUpContent(header: string, content: string): string;
