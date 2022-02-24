import { useState } from "react";

export default function useToggle(initialValue: boolean = false) {
  const [on, setOn] = useState(initialValue);
  const toggleOn = () => setOn(true);
  const toggleOff = () => setOn(false);
  const toggle = () => setOn((prev) => !prev);

  return [on, toggleOn, toggleOff, toggle] as const;
}
