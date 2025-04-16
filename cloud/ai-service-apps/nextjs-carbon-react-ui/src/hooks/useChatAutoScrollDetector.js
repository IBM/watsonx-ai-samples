// Globals -------------------------------------------------------------------->
/* global document IntersectionObserver */

import { useEffect, useRef } from "react";

const ROOT_MARGIN = "50px";

function useChatAutoScrollDetector(targetRef, shouldAutoScrollRef) {
  const observerRef = useRef(null);

  useEffect(() => {
    const handler = (entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        shouldAutoScrollRef.current = true;
      } else {
        shouldAutoScrollRef.current = false;
      }
    };

    const options = {
      root: document.getElementById("chat-messages"),
      rootMargin: ROOT_MARGIN,
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(handler, options);
  }, [shouldAutoScrollRef]);

  useEffect(() => {
    observerRef.current.observe(targetRef.current);

    return () => {
      observerRef.current.disconnect();
    };
  }, [targetRef]);
}

export { useChatAutoScrollDetector };
