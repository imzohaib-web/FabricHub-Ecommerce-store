import { useEffect } from "react";

export function useScrollToTop(deps = []) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, deps);
}
