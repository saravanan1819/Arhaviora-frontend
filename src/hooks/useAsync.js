import { useCallback, useEffect, useRef, useState } from 'react';
import { toApiError } from '../services/api/errors';

// Runs `fn` on mount and whenever `deps` change. Ignores stale responses.
export const useAsync = (fn, deps = []) => {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const runId = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(() => {
    const id = ++runId.current;
    setState((prev) => ({ ...prev, error: null, loading: true }));
    fnRef.current().then(
      (data) => {
        if (id === runId.current) setState({ data, error: null, loading: false });
      },
      (error) => {
        if (id === runId.current) setState({ data: null, error: toApiError(error), loading: false });
      }
    );
  }, []);

  useEffect(() => {
    run();
    return () => {
      runId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload: run };
};

export default useAsync;
