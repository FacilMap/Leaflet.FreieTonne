import * as L from "leaflet";
import { fetchFreieTonneFeatures } from "./utils";
import "./L.FreieTonne.css";

export interface FreieTonneOptions extends L.LayerOptions {
}

export default class FreieTonne extends L.FeatureGroup {

    options!: FreieTonneOptions;

    constructor(options: FreieTonneOptions = {}) {
        super([], {
            attribution: '© <a href="https://www.freietonne.de/" target="_blank">FreieTonne</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM Contributors</a>',
            ...options
        });
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

        const features = await fetchFreieTonneFeatures(this._map.getBounds(), zoom);

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