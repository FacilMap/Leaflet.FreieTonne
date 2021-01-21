import L, { FeatureGroup, LayerOptions, Map } from "leaflet";
import { fetchFreieTonneFeatures } from "./utils";
import "./L.FreieTonne.css";

export interface FreieTonneOptions extends LayerOptions {
    fetchWrapper?: (url: string) => Promise<string>;
}

export default class FreieTonne extends FeatureGroup {

    options: FreieTonneOptions = {
        attribution: '© <a href="https://www.freietonne.de/" target="_blank">FreieTonne</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM Contributors</a>'
    };

    constructor(options: FreieTonneOptions = {}) {
        super([], options);
    }

    getEvents() {
        return {
            moveend: this.redraw
        };
    }

    onAdd() {
        this.redraw();
        return this;
    }

    async redraw() {
        const zoom = this._map.getZoom();

        if(zoom <= 8) {
            this.clearLayers();
            return;
        }
        
        const features = await fetchFreieTonneFeatures(this._map.getBounds(), zoom, this.options.fetchWrapper);

        this.clearLayers();

        for (const feature of features) {
            const marker = L.marker(feature.latLng, {
                icon: L.icon({
                    iconUrl: feature.iconUrl,
                    iconSize: feature.iconSize,
                    iconAnchor: feature.iconAnchor,
                    popupAnchor: feature.popupAnchor
                })
            });

            if(feature.content)
                marker.bindPopup(feature.content, { className: 'leaflet-freietonne' });

            this.addLayer(marker);
        }
    }
}

declare module 'leaflet' {
    function freieTonne(options?: FreieTonneOptions): FreieTonne;

    class FreieTonne extends L.LayerGroup {
        constructor(options?: FreieTonneOptions);
    }
}

L.FreieTonne = FreieTonne;

L.freieTonne = function freieTonne(options?: FreieTonneOptions) {
    return new L.FreieTonne(options);
};
