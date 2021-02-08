import L, { FeatureGroup, LayerOptions } from "leaflet";
import "./L.FreieTonne.css";
export interface FreieTonneOptions extends LayerOptions {
}
export default class FreieTonne extends FeatureGroup {
    options: FreieTonneOptions;
    constructor(options?: FreieTonneOptions);
    getEvents(): {
        moveend: () => Promise<void>;
    };
    onAdd(): this;
    redraw(): Promise<void>;
}
declare module 'leaflet' {
    function freieTonne(options?: FreieTonneOptions): FreieTonne;
    class FreieTonne extends L.LayerGroup {
        constructor(options?: FreieTonneOptions);
    }
}
