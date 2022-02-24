import { useEffect, useRef, useState } from "react";

export default function useFieldScaleFactor() {
  const [scaleFactor, setScaleFactor] = useState(1);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeCallback = () => {
      const field = fieldRef.current;

      if (!field) return;

      const _scaleFactor = (field?.clientWidth - 25) / field?.clientWidth;

      setScaleFactor(_scaleFactor);
    };

    resizeCallback();

    window.addEventListener("resize", resizeCallback);

    return () => window.removeEventListener("resize", resizeCallback);
  }, []);

  return [fieldRef, scaleFactor] as const;
}
