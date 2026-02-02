import { useState, useEffect, useRef, useCallback } from 'react'

// Load Google Maps API script dynamically
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps)
      return
    }
    
    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps))
      return
    }
    
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Calculate timezone offset from longitude (approximate method)
// More accurate: use Google Timezone API or a library
const getTimezoneFromCoords = (latitude, longitude) => {
  // Approximate timezone based on longitude
  // Each 15 degrees = 1 hour offset
  const offsetHours = Math.round(longitude / 15)
  const offsetMinutes = offsetHours * 60
  
  // Format as timezone string
  const sign = offsetHours >= 0 ? '+' : '-'
  const absHours = Math.abs(offsetHours)
  const tzString = `UTC${sign}${absHours}`
  
  return {
    offset: offsetMinutes,
    offsetHours: offsetHours,
    name: tzString
  }
}

function LocationPicker({ onLocationSelect, apiKey, placeholder = 'Geburtsort eingeben...', initialValue = '' }) {
  const [searchText, setSearchText] = useState(initialValue)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const inputRef = useRef(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteServiceRef = useRef(null)
  const placesServiceRef = useRef(null)
  
  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey) {
      setError('Google Maps API Key fehlt')
      return
    }
    
    loadGoogleMapsScript(apiKey)
      .then((maps) => {
        setIsLoaded(true)
        autocompleteServiceRef.current = new maps.places.AutocompleteService()
      })
      .catch((err) => {
        setError('Fehler beim Laden von Google Maps')
        console.error(err)
      })
  }, [apiKey])
  
  // Initialize map when container is ready and maps is loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current) {
      const maps = window.google.maps
      
      // Default to Berlin
      const defaultCenter = { lat: 52.52, lng: 13.405 }
      
      mapInstanceRef.current = new maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 4,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      
      // Create places service (needs a map or div element)
      placesServiceRef.current = new maps.places.PlacesService(mapInstanceRef.current)
    }
  }, [isLoaded])
  
  // Handle search input changes
  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setSearchText(value)
    
    if (!value || value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          types: ['(cities)']
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setShowSuggestions(true)
          } else {
            setSuggestions([])
          }
        }
      )
    }
  }, [])
  
  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion) => {
    setSearchText(suggestion.description)
    setShowSuggestions(false)
    
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['geometry', 'formatted_address', 'name', 'utc_offset_minutes']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            
            // Get timezone - use place's UTC offset if available, otherwise calculate
            let timezone
            if (place.utc_offset_minutes !== undefined) {
              const offsetHours = place.utc_offset_minutes / 60
              const sign = offsetHours >= 0 ? '+' : '-'
              timezone = {
                offset: place.utc_offset_minutes,
                offsetHours: offsetHours,
                name: `UTC${sign}${Math.abs(offsetHours)}`
              }
            } else {
              timezone = getTimezoneFromCoords(lat, lng)
            }
            
            const locationData = {
              name: suggestion.description,
              latitude: lat,
              longitude: lng,
              timezone: timezone
            }
            
            setSelectedLocation(locationData)
            
            // Update map
            if (mapInstanceRef.current) {
              const maps = window.google.maps
              const position = { lat, lng }
              
              mapInstanceRef.current.setCenter(position)
              mapInstanceRef.current.setZoom(10)
              
              // Update or create marker
              if (markerRef.current) {
                markerRef.current.setPosition(position)
              } else {
                markerRef.current = new maps.Marker({
                  position,
                  map: mapInstanceRef.current,
                  animation: maps.Animation.DROP
                })
              }
            }
            
            // Notify parent
            if (onLocationSelect) {
              onLocationSelect(locationData)
            }
          }
        }
      )
    }
  }, [onLocationSelect])
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  if (error) {
    return (
      <div className="location-picker error">
        <p>{error}</p>
      </div>
    )
  }
  
  return (
    <div className="location-picker">
      <div className="location-search" ref={inputRef}>
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="location-input"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <ul className="location-suggestions">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="suggestion-item"
              >
                <span className="suggestion-icon">📍</span>
                <span className="suggestion-text">{suggestion.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className="location-map"
        style={{ 
          width: '100%', 
          height: '200px', 
          borderRadius: '12px',
          marginTop: '12px',
          display: isLoaded ? 'block' : 'none'
        }}
      />
      
      {!isLoaded && (
        <div className="location-map-placeholder">
          <span>Karte wird geladen...</span>
        </div>
      )}
      
      {selectedLocation && (
        <div className="location-info">
          <span className="location-coords">
            {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
          </span>
          <span className="location-timezone">
            {selectedLocation.timezone.name}
          </span>
        </div>
      )}
    </div>
  )
}

export default LocationPicker
