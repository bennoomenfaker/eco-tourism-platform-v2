"use client";

import { useEffect, useRef, useState } from "react";

type GovernorateMetric = {
  governorate: string;
  offers: number;
  circuits: number;
  venues: number;
  reservations: number;
  score: number;
};

type TunisiaMapProps = {
  data: GovernorateMetric[];
  selected: string | null;
  onSelect: (gov: string | null) => void;
};

const GOVERNORATE_CENTERS: Record<string, [number, number]> = {
  Tunis: [36.8065, 10.1815],
  Ariana: [36.8601, 10.1934],
  "Ben Arous": [36.7530, 10.2189],
  "Manouba": [36.8078, 10.1014],
  Nabeul: [36.4561, 10.7376],
  Zaghouan: [36.4029, 10.1428],
  Bizerte: [37.2744, 9.8739],
  Beja: [36.7256, 9.1875],
  Jendouba: [36.5011, 8.7803],
  Kef: [36.1832, 8.7107],
  Siliana: [36.0850, 9.3708],
  Sousse: [35.8256, 10.6369],
  Monastir: [35.7681, 10.8118],
  Mahdia: [35.5047, 11.0622],
  Sfax: [34.7406, 10.7603],
  Kairouan: [35.6781, 10.0963],
  Kasserine: [35.1677, 8.8361],
  SidiBouzid: [35.0381, 9.4858],
  Gafsa: [34.4250, 8.7842],
  Tozeur: [33.9197, 8.1336],
  Kebili: [33.7048, 8.9725],
  Gabes: [33.8815, 10.0982],
  Medenine: [33.3547, 10.5053],
  Tataouine: [32.9297, 10.4518],
};

export function TunisiaMap({ data, selected, onSelect }: TunisiaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const layers = useRef<Map<string, any>>(new Map());
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('link[href*="leaflet.css"]')) { setCssLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!cssLoaded || !containerRef.current) return;
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const m = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    m.setView([34.5, 9.5], 7);
    setMap(m);
    return () => { m.remove(); setMap(null); };
  }, [cssLoaded]);

  useEffect(() => {
    if (!map || !data.length) return;
    const L = require("leaflet");
    const maxVal = Math.max(...data.map((d) => d.offers + d.circuits), 1);

    data.forEach((d) => {
      const coords = GOVERNORATE_CENTERS[d.governorate];
      if (!coords) return;
      const intensity = Math.min((d.offers + d.circuits) / maxVal, 1);
      const radius = Math.max(8, 30 * intensity);
      const color = intensity > 0.7 ? "#059669" : intensity > 0.4 ? "#10b981" : intensity > 0.1 ? "#34d399" : "#a7f3d0";

      const circle = L.circleMarker(coords, {
        radius,
        fillColor: color,
        color: "#fff",
        weight: 2,
        fillOpacity: 0.8,
      }).addTo(map);

      circle.bindTooltip(
        `<strong>${d.governorate}</strong><br/>Offres: ${d.offers} | Circuits: ${d.circuits}<br/>Score: ${d.score}`,
        { sticky: true, direction: "top" }
      );

      circle.on("click", () => onSelect(d.governorate));
      layers.current.set(d.governorate, circle);
    });

    return () => { layers.current.forEach((l) => l.remove()); layers.current.clear(); };
  }, [map, data, onSelect]);

  useEffect(() => {
    if (!map) return;
    layers.current.forEach((layer, gov) => {
      if (gov === selected) {
        layer.setStyle({ color: "#f59e0b", weight: 3, fillOpacity: 1 });
        layer.openTooltip();
      } else {
        layer.setStyle({ color: "#fff", weight: 2, fillOpacity: 0.8 });
      }
    });
  }, [map, selected]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%", minHeight: "400px" }} />;
}