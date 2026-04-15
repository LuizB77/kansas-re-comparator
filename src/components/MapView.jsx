import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

const PURPLE = '#7F77DD'
const MAP_ID = 'kansas-re-map'

const mapsLoaderConfigured = { current: false }

export default function MapView({ locationA, locationB, loading }) {
  const mapRef = useRef(null)
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    if (loading) {
      return () => {}
    }
    if (!mapRef.current) {
      return () => {}
    }

    async function run() {
      try {
        setMapError(null)

        if (!mapsLoaderConfigured.current) {
          setOptions({
            key: import.meta.env.VITE_GOOGLE_MAPS_KEY,
            v: 'weekly',
            libraries: ['maps', 'marker', 'geocoding'],
          })
          mapsLoaderConfigured.current = true
        }

        const { Map: GoogleMap } = await importLibrary('maps')
        const { Geocoder } = await importLibrary('geocoding')
        const { AdvancedMarkerElement, PinElement } = await importLibrary('marker')

        async function geocodeZip(geocoder, zip) {
          return new Promise((resolve, reject) => {
            geocoder.geocode({ address: String(zip) + ', USA' }, (results, status) => {
              if (status === 'OK' && results[0]) {
                resolve(results[0].geometry.location)
              } else {
                reject(new Error(`Could not geocode ZIP ${zip}: ${status}`))
              }
            })
          })
        }

        const geocoder = new Geocoder()
        const [posA, posB] = await Promise.all([
          geocodeZip(geocoder, locationA.zip),
          geocodeZip(geocoder, locationB.zip),
        ])

        if (!mapRef.current) return

        const centerLat = (posA.lat() + posB.lat()) / 2
        const centerLng = (posA.lng() + posB.lng()) / 2

        const map = new GoogleMap(mapRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 9,
          mapId: MAP_ID,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        const bounds = new google.maps.LatLngBounds()
        bounds.extend(posA)
        bounds.extend(posB)
        map.fitBounds(bounds, 80)

        const pinA = new PinElement({
          background: PURPLE,
          borderColor: '#5B54B8',
          glyphColor: '#ffffff',
          glyph: `ZIP ${locationA.zip}`,
          scale: 1.2,
        })
        const markerA = new AdvancedMarkerElement({
          map,
          position: posA,
          content: pinA.element,
          title: `ZIP ${locationA.zip}`,
        })

        const pinB = new PinElement({
          background: PURPLE,
          borderColor: '#5B54B8',
          glyphColor: '#ffffff',
          glyph: `ZIP ${locationB.zip}`,
          scale: 1.2,
        })
        const markerB = new AdvancedMarkerElement({
          map,
          position: posB,
          content: pinB.element,
          title: `ZIP ${locationB.zip}`,
        })

        const infoA = new google.maps.InfoWindow({
          content: `
      <div style="font-family:sans-serif;font-size:13px;min-width:160px">
        <strong style="color:#7F77DD">ZIP ${locationA.zip}</strong><br/>
        🏠 Home Price: $${locationA.medianSalePrice?.toLocaleString() ?? 'N/A'}<br/>
        🏘️ Rent/mo: $${locationA.medianRent?.toLocaleString() ?? 'N/A'}<br/>
        👥 Population: ${locationA.population?.toLocaleString() ?? 'N/A'}
      </div>
    `,
        })
        markerA.addListener('click', () => {
          infoA.open({ map, anchor: markerA })
        })

        const infoB = new google.maps.InfoWindow({
          content: `
      <div style="font-family:sans-serif;font-size:13px;min-width:160px">
        <strong style="color:#7F77DD">ZIP ${locationB.zip}</strong><br/>
        🏠 Home Price: $${locationB.medianSalePrice?.toLocaleString() ?? 'N/A'}<br/>
        🏘️ Rent/mo: $${locationB.medianRent?.toLocaleString() ?? 'N/A'}<br/>
        👥 Population: ${locationB.population?.toLocaleString() ?? 'N/A'}
      </div>
    `,
        })
        markerB.addListener('click', () => {
          infoB.open({ map, anchor: markerB })
        })
      } catch (err) {
        setMapError(err instanceof Error ? err.message : String(err))
      }
    }

    void run()

    return () => {}
  }, [locationA.zip, locationB.zip, loading])

  if (loading) {
    return <div className="animate-pulse rounded-2xl bg-gray-100 h-80 w-full" />
  }

  return (
    <div className="space-y-2">
      {mapError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Map could not load: {mapError}
        </div>
      ) : null}
      <div
        ref={mapRef}
        className="w-full overflow-hidden rounded-2xl"
        style={{ height: '400px' }}
      />
    </div>
  )
}
