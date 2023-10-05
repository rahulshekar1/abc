mapboxgl.accessToken = 'pk.eyJ1IjoicmFodWxzaGVrYXIzNiIsImEiOiJjbGkwN2V2bzQwMWFqM2VxdHN0d2JqYmNjIn0.80D19gZMovIsTUul0dxRfg';



    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true
      },
      defaultMode: 'simple_select',
      styles: [
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#438EE4',
            'line-dasharray': [0.2, 2],
            'line-width': 2,
            'line-opacity': 0.7
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: {
            'circle-radius': 12,
            'circle-color': '#FFF'
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: {
            'circle-radius': 8,
            'circle-color': '#438EE4'
          }
        }
      ]
    });

    map.addControl(draw);

    map.on('draw.create', updateRoute);
    
    map.on('draw.update', updateRoute);
    map.on('draw.delete', removeRoute);

    document.getElementById('params').addEventListener('change', updateRoute);

    async function getDirections(coordinates, profile) {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const response = await query.json();

      if (response.code !== 'Ok') {
        alert(
          `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/directions/#directions-api-errors`
        );
        return;
      }

      const coords = response.routes[0].geometry;
      addRoute(coords);
      getInstructions(response.routes[0].legs[0]);
  showInfoBox();
    }

    function updateRoute() {
      removeRoute();

      const selectedProfile = document.querySelector('input[name="profile"]:checked').value;
      const data = draw.getAll();
      const lastFeature = data.features.length - 1;
      const coords = data.features[lastFeature].geometry.coordinates;
      const newCoords = coords.map(coord => `${coord[0]},${coord[1]}`).join(';');
      getDirections(newCoords, selectedProfile);
    }   
    function getInstructions(data) {
      const directions = document.getElementById('directions');
      let tripDirections = '';
    
      for (const step of data.steps) {
        tripDirections += `<li>${step.maneuver.instruction}</li>`;
      }
    
      directions.innerHTML = `<br><p><strong>Trip duration: ${Math.floor(
        data.duration / 60
      )} min.</strong></p><p><strong>Trip distance: ${(
        data.distance / 1000
      ).toFixed(2)} km</strong></p><br><ol>${tripDirections}</ol>`;
    }
    
    // Add a function to show the info-box
    function showInfoBox() {
      const infoBox = document.querySelector('.info-box');
      infoBox.style.display = 'block';
    }

    function addRoute(coords) {
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: coords
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#03AA46',
            'line-width': 8,
            'line-opacity': 0.8
          }
        });
      }
    }

    function removeRoute() {
      if (!map.getSource('route')) return;
      map.removeLayer('route');
      map.removeSource('route');
      
      // Hide the info-box
      const infoBox = document.querySelector('.info-box');
      infoBox.style.display = 'none';
    }
    map.addControl(
      new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
      })
      );