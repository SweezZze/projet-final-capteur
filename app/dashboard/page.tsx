"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWebSocketLogger } from "@/hooks/use-websocket-logger";
import { Activity, AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type SensorData = {
  mouvement: string;
  timestamp: string;
};

export default function InteractionPage() {
  const [detections, setDetections] = useState<SensorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useWebSocketLogger();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.mouvement &&
          data.mouvement.toUpperCase().includes("MOUVEMENT") &&
          !data.mouvement.toUpperCase().includes("PAS DE MOUVEMENT")
        ) {
          setDetections((prev) =>
            [
              { mouvement: data.mouvement, timestamp: data.timestamp },
              ...prev,
            ].slice(0, 6)
          );
        }
      } catch (err) {
        setError("Erreur lors du parsing des données");
      }
    };

    ws.onerror = () => {
      setError("Erreur de connexion au WebSocket");
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">
            Historique des détections
          </h2>
          <p className="text-muted-foreground text-base">
            Visualisez les 6 dernières détections de mouvement du capteur PIR en
            temps réel.
          </p>
        </div>
        <Card className="w-fit min-w-[220px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Statut connexion
            </CardTitle>
            <CardDescription>WebSocket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-sm">
                {isConnected ? "Connecté" : "Déconnecté"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {detections.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Clock className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">
                Aucune détection récente
              </span>
            </CardContent>
          </Card>
        ) : (
          detections.map((detection, idx) => (
            <Card key={idx} className="shadow-md border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-primary" />
                  Mouvement détecté
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  #{detections.length - idx}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-base">
                    {new Date(detection.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(detection.timestamp).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
