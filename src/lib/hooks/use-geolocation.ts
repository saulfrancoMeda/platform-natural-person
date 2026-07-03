"use client";
import * as React from "react";

export type GeoStatus = "checking" | "granted" | "denied" | "unavailable" | "prompt";

export interface GeoState {
  status: GeoStatus;
  coords: { lat: number; lng: number } | null;
  /** Dispara la solicitud de permiso / obtención de ubicación. */
  request: () => void;
}

/**
 * Geolocalización para el acceso (requisito regulatorio).
 * Se apoya en la Permissions API: si el permiso del sitio está CONCEDIDO se permite el acceso
 * aunque el sistema no logre fijar coordenadas (p. ej. Servicios de ubicación de macOS apagados).
 * Solo bloquea cuando el permiso está denegado o no hay soporte.
 */
export function useGeolocation(): GeoState {
  const [status, setStatus] = React.useState<GeoStatus>("checking");
  const [coords, setCoords] = React.useState<GeoState["coords"]>(null);

  const getPosition = React.useCallback((permissionGranted: boolean) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      (err) => {
        if (err.code === 1) setStatus("denied"); // PERMISSION_DENIED
        // POSITION_UNAVAILABLE / TIMEOUT: si el permiso ya está concedido, no bloqueamos.
        else setStatus(permissionGranted ? "granted" : "unavailable");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const request = React.useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("checking");
    let permission: PermissionState = "prompt";
    try {
      if (navigator.permissions?.query) {
        const res = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        permission = res.state;
      }
    } catch {
      /* Permissions API no disponible: seguimos con getCurrentPosition */
    }
    if (permission === "denied") {
      setStatus("denied");
      return;
    }
    // 'granted' o 'prompt': intentamos obtener la posición (dispara el prompt si aplica).
    getPosition(permission === "granted");
  }, [getPosition]);

  React.useEffect(() => {
    request();
  }, [request]);

  return { status, coords, request };
}
