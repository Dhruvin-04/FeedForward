import { memo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { Icon, LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";


type MapType = "roadmap";

type MapLocation = LatLngLiteral & { id: string };

type MapProps = {
  center: LatLngLiteral;
  locations: MapLocation[];
};

const SelectedLocation = ({ center }: { center: LatLngLiteral }) => {
  const map = useMap();
  map.panTo(center, { animate: true });
  return null;
};

export const Mapview: React.FC<MapProps> = memo(({ center, locations }) => {
  const [mapType, setMapType] = useState<MapType>("roadmap");
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | undefined
  >();

  const getUrl = () => {
    const mapTypeUrls: Record<MapType, string> = {
      roadmap: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
    };
    return mapTypeUrls[mapType];
  };

  const mapMarkIcon = new Icon({
    iconUrl: "/map-marker.png",
    iconSize: [20, 25],
  });
  const mapMarkActiveIcon = new Icon({
    iconUrl: "/active-map-marker.png",
    iconSize: [20, 25],
  });

  const renderMarks = () => {
    return locations.map((location) => (
      <div key={location.id}>
        <Marker
          icon={
            location.id === selectedLocation?.id
              ? mapMarkActiveIcon
              : mapMarkIcon
          }
          position={{ lat: location.lat, lng: location.lng }}
          eventHandlers={{
            click: () => {
              setSelectedLocation(location);
            },
          }}
        />
      </div>
    ));
  };

  return (
    <>
      <div className="w-80 h-80 rounded-lg overflow-hidden shadow-2xs">
        <MapContainer
          center={center}
          zoom={13}
          minZoom={5}
          zoomControl={false}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url={getUrl()} />
          {selectedLocation && <SelectedLocation center={selectedLocation} />}
          {renderMarks()}
          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    </>
  );
});