import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const token = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = token;

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-82.5, 35.5],
        zoom: 12,
        pitch: 60,
        bearing: -45,
        antialias: true
      });

      map.current.on('load', () => {
        if (!map.current) return;

        map.current.addSource('terrain', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({
          source: 'terrain',
          exaggeration: 1.5
        });

        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        map.current.addControl(
          new mapboxgl.NavigationControl()
        );

        console.log('Map and terrain loaded successfully!');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox Error:', e);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
    }

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!map.current) return;

    const resizeObserver = new ResizeObserver(() => {
      map.current?.resize();
    });

    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px'
      }}
    />
  );
}