/* eslint-disable no-mixed-operators */
// Polygon getBounds extension - google-maps-extensions
// https://github.com/tparkin/Google-Maps-Point-in-Polygon
// http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
export const pointInPoly = (maps, latLngPair, customPolygon) => {
  console.log(latLngPair);
  const getBounds = () => {
    var bounds = new maps.LatLngBounds(),
      paths = customPolygon.getPaths(),
      path,
      p, i;

    for (p = 0; p < paths.getLength(); p++) {
      path = paths.getAt(p);
      for (i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
    }

    return bounds;
  };

  // Polygon containsLatLng - method to determine if a latLng is within a polygon
  const containsLatLng = (latLng) => {
    // Exclude points outside of bounds as there is no way they are in the poly

    let inPoly = false,
      bounds, lat, lng,
      numPaths, p, path, numPoints,
      i, j, vertex1, vertex2;

    // Arguments are a pair of lat, lng variables
    if (latLngPair.length === 2) {
      if (
        typeof latLngPair[0] == "number" &&
        typeof latLngPair[1] == "number"
      ) {
        lat = latLngPair[0];
        lng = latLngPair[1];
      }
    } else if (latLngPair.length === 1) {
      bounds = getBounds();
      console.log(bounds);

      if (!bounds && !bounds.contains(latLng)) {
        return false;
      }
      lat = latLng.lat();
      lng = latLng.lng();
    } else {
      console.log("Wrong number of inputs in google.maps.Polygon.prototype.contains.LatLng");
    }

    // Raycast point in polygon method

    numPaths = customPolygon.getPaths().getLength();
    for (p = 0; p < numPaths; p++) {
      path = customPolygon.getPaths().getAt(p);
      numPoints = path.getLength();
      j = numPoints - 1;

      for (i = 0; i < numPoints; i++) {
        vertex1 = path.getAt(i);
        vertex2 = path.getAt(j);

        if (
          vertex1.lng() < lng &&
          vertex2.lng() >= lng ||
          vertex2.lng() < lng &&
          vertex1.lng() >= lng
        ) {
          if (
            vertex1.lat() +
            (lng - vertex1.lng()) /
            (vertex2.lng() - vertex1.lng()) *
            (vertex2.lat() - vertex1.lat()) <
            lat
          ) {
            inPoly = !inPoly;
          }
        }

        j = i;
      }
    }

    return inPoly;
  };

  return containsLatLng(latLngPair);
}