import { useEffect, useState } from 'react';
import { loadCatalog } from './catalog';
export function useCatalog() {
  const [state, setState] = useState({ products: [], failed: 0, loading: true });
  const [revision, retry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let active = true;
    setState(s => ({ ...s, loading: true }));
    loadCatalog(controller.signal).then(result => { if (active) setState({ ...result, loading: false }); }).finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [revision]);
  return { ...state, retry: () => retry(n => n + 1) };
}
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}
