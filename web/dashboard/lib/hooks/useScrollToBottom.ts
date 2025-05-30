import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const scrollToBottom = useCallback((smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const threshold = 100;
    // When the user is near the bottom, we keep auto-scroll on;
    // otherwise, we show a "scroll to bottom" button.
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    setShowScrollButton(!isNearBottom);
    setIsAutoScrollEnabled(isNearBottom);
  }, []);

  // Scroll whenever auto-scroll is enabled.
  useEffect(() => {
    if (isAutoScrollEnabled) {
      scrollToBottom(true);
    }
  }, [isAutoScrollEnabled, scrollToBottom]);

  // You could also export a function that forces a scroll on demand
  // when new data arrives (e.g., messages added).
  const scrollOnUpdate = useCallback(() => {
    if (isAutoScrollEnabled) {
      scrollToBottom(true);
    }
  }, [isAutoScrollEnabled, scrollToBottom]);

  return {
    containerRef,
    showScrollButton,
    isAutoScrollEnabled,
    setIsAutoScrollEnabled,
    scrollToBottom,
    handleScroll,
    scrollOnUpdate,
  };
}
