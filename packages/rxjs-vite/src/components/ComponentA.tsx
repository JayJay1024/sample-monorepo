import { useEffect } from "react";
import { ComponentB } from "./ComponentB";

export function ComponentA() {
  console.log("ComponentA~");

  useEffect(() => {
    console.log("ComponentA::useEffect");
  }, []);

  return (
    <div>
      <span>ComponentA</span>
      <ComponentB />
    </div>
  );
}
