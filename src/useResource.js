import { useEffect, useState } from "react";
import { getResource } from "./marketplace";

export function useResource(resource) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({
    resource,
    loading: true,
    data: null,
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ resource, loading: true, data: null, error: null });
    getResource(resource, controller.signal)
      .then((data) => {
        if (active) setState({ resource, loading: false, data, error: null });
      })
      .catch((error) => {
        if (active)
          setState({
            resource,
            loading: false,
            data: null,
            error:
              error.response?.status === 404
                ? "This page could not be found."
                : "We couldn’t load this part of the shop. Please try again.",
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [resource, revision]);
  // Never flash the preceding route's records while a new request is starting.
  return {
    ...(state.resource === resource
      ? state
      : { loading: true, data: null, error: null }),
    retry: () => setRevision((n) => n + 1),
  };
}
