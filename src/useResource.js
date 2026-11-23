import { useEffect, useState } from "react";
import { fetchResource } from "./api";
export default function useResource(path) {
  const [state, setState] = useState({ path, data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ path, data: null, error: null });
    fetchResource(path, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ path, data, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ path, data: null, error });
      });
    return () => controller.abort();
  }, [path, attempt]);
  return {
    ...(state.path === path ? state : { data: null, error: null }),
    retry: () => setAttempt((n) => n + 1),
  };
}
