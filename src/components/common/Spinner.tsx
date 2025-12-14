"use client";

import { Loader } from "lucide-react";

type SpinnerProps = {
  size?: number;
  className?: string;
  color?: string;
  label?: string;
};

/**
 * App-wide loading spinner using lucide Loader for consistency.
 */
export function Spinner({ size = 24, className = "", color, label }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
      className="inline-flex items-center justify-center"
    >
      <Loader
        className={`animate-spin ${className}`}
        style={{ width: size, height: size, color }}
      />
    </span>
  );
}
