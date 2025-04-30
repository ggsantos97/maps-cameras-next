import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

type Camera = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  direction: string;
};

const containerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: -15.846298921999088,
  lng: -47.75955057864582,
};

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const res = await fetch("/api/get-coordinates");
        const data = await res.json();
        setCameras(data);
      } catch (err) {
        console.error("Erro ao buscar coordenadas:", err);
      }
    };
    fetchCoordinates();
  }, []);

  function getRotationFromSide(dir: string): number {
    switch (dir.trim().toLowerCase()) {
      case "direita":
        return -40;
      case "esquerda":
        return -200;
      default:
        return 0;
    }
  }

  const svgIcon = (rotation: number) => ({
    url: `data:image/svg+xml;utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 242.179 242.179" width="40" height="40">
        <g transform="rotate(${rotation}, 121.0895, 121.0895)">
          <path d="M190.387,134.138l-27.415,42.051l-42.642-27.73l-15.554,26.596L38,180.884v46.391H0v-120h38v43.494l48.664-4.244
            l8.575-14.453L36.887,94.088l51.544-79.183l153.748,100.082L190.387,134.138z M173.874,183.244l19.924,12.971l27-41.474
            l-19.924-12.971L173.874,183.244z" fill="#DF013A"/>
        </g>
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(32, 32)
  });

  return (
    <>
      <header style={{ padding: "1rem", background: "#f5f5f5" }}>
        <h1>Proposta de Monitoramento Condominio Solar da serra</h1>
      </header>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {cameras.map((camera) => (
            <MarkerF
              key={camera.id}
              position={{ lat: camera.lat, lng: camera.lng }}
              title={camera.title}
              icon={svgIcon(getRotationFromSide(camera.direction))}
            //   icon={{
            //     url: "/camera-icon.svg", // coloque esse arquivo na pasta /public
            //     scaledSize: new window.google.maps.Size(32, 32),
            //     anchor: new window.google.maps.Point(16, 16),
            //     rotation: ,
            //   }}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <footer style={{ padding: "1rem", background: "#f5f5f5", textAlign: "center" }}>
        &copy; 2025 - Projeto de Monitoramento
      </footer>
    </>
  );
}
