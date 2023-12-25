Leaflet.FreieTonne
==================

A Leaflet layer that adds the nautical features overlay from [FreieTonne](https://www.freietonne.de/).

[Demo](https://esm.sh/leaflet-freie-tonne/example.html)\
[Demo on FacilMap](https://facilmap.org/#10/53.7259/9.5072/MSfR-FrTo)


Usage
-----

Since release 2.0.0, Leaflet.FreieTonne is published as an ES module only. Install it using `npm install -S leaflet-freie-tonne` and use it in your code like so:

```javascript
import FreieTonne from 'leaflet-freie-tonne';
new FreieTonne().addTo(map);
```

TypeScript is supported. `FreieTonne` is a Leaflet layer, so it can be added as an overlay to `L.Control.Layers` and used in any other way that a Layer can be used.

If you want to use Leaflet.FreieTonne directly inside a website without using a module bundler (not recommended for production), you need to make sure to import it and Leaflet as a module, for example from esm.sh:

```html
<script type="importmap">
	{
		"imports": {
			"leaflet": "https://esm.sh/leaflet",
			"leaflet-freie-tonne": "https://esm.sh/leaflet-freie-tonne"
		}
	}
</script>
<script type="module">
	import L from "leaflet";
	import FreieTonne from "leaflet-freie-tonne";

	const map = L.map('map', { center: [53.7259, 9.5072], zoom: 10 });
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: '© <a href="http://www.openstreetmap.org/copyright" target="_blank">OSM Contributors</a>',
		noWrap: true
	}).addTo(map);
	new FreieTonne().addTo(map);
</script>
```