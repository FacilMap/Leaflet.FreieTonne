Leaflet.FreieTonne
==================

A Leaflet layer that adds the nautical features overlay from [FreieTonne](https://www.freietonne.de/).

[Demo](https://unpkg.com/leaflet-freie-tonne/example.html)\
[Demo on FacilMap](https://facilmap.org/#10/53.7259/9.5072/MSfR-FrTo)


Usage
-----

If you are using a module bundler, you can install Leaflet.FreieTonne using `npm install -S leaflet-freie-tonne` and use it in your code like so:

```JavaScript
import FreieTonne from 'leaflet-freie-tonne';
new FreieTonne().addTo(map);
```

TypeScript is supported. Note that when using Leaflet.FreieTonne like this, `L.FreieTonne` is not available on the global `L` leaflet object.

If you want to use Leaflet.FreieTonne in a static HTML page, it is available as `L.FreieTonne`:

Adding L.FreieTonne:

```javascript
<script src="https://unpkg.com/leaflet"></script>
<script src="https://unpkg.com/leaflet-freie-tonne"></script>
<script>
    new L.FreieTonne().addTo(map);
</script>
```

`L.FreieTonne` is a Leaflet layer, so it can be added as an overlay to `L.Control.Layers` and used in any other way that a Layer can be used.