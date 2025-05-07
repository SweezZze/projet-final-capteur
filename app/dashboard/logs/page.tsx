"use client";

import { app } from "@/app/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Activity, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export type Log = {
  id: string;
  mouvement: string;
  timestamp: string;
  type: string;
  source?: string;
};

const typeLabels: Record<string, string> = {
  detection: "Détection",
  idle: "Repos",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore(app);
        let q = query(collection(db, "LOG"), orderBy("timestamp", "desc"));
        if (filter) {
          q = query(
            collection(db, "LOG"),
            where("type", "==", filter),
            orderBy("timestamp", "desc")
          );
        }
        const snap = await getDocs(q);
        const docs = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Log)
        );
        setLogs(docs);
      } catch (err) {
        setError("Erreur lors de la récupération des logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Logs</h1>
          <p className="text-muted-foreground">
            Historique des données de vos capteurs.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm font-medium border ${
              !filter
                ? "bg-primary text-white"
                : "bg-background text-foreground"
            }`}
            onClick={() => setFilter(null)}
          >
            Tous
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Activity className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
              <span className="text-muted-foreground">
                Chargement des logs…
              </span>
            </CardContent>
          </Card>
        ) : logs.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Activity className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">Aucun log trouvé</span>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="shadow-md border-primary/20">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Badge
                      variant={
                        log.type === "detection" ? "default" : "secondary"
                      }
                    >
                      {typeLabels[log.type] || log.type}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {log.source || "capteur"}
                  </CardDescription>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleDateString()}
                  <br />
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </CardHeader>
              <CardContent>
                <span className="font-mono text-base">{log.mouvement}</span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
