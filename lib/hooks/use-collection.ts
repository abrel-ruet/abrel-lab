"use client";

import { useEffect, useState } from "react";
import { orderBy, limit, subscribeCollection, type QueryConstraint } from "@/lib/firestore";

interface Options {
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  limitCount?: number;
}

export function useLiveCollection<T>(name: string, options: Options = {}) {
  const { orderByField, orderDirection = "asc", limitCount } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (orderByField) constraints.push(orderBy(orderByField, orderDirection));
    if (limitCount) constraints.push(limit(limitCount));

    const unsub = subscribeCollection<T>(
      name,
      (items) => {
        setData(items);
        setError(null);
        setLoading(false);
      },
      constraints,
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [name, orderByField, orderDirection, limitCount]);

  return { data, loading, error };
}
