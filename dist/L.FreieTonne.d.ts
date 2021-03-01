import { FeatureGroup, LayerOptions } from "leaflet";
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
