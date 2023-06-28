import { useEffect } from "react";
import { ComponentC } from "./ComponentC";

export function ComponentB() {
  console.log("ComponentB~");

  useEffect(() => {
    console.log("ComponentB::useEffect");
  }, []);

  return (
    <div>
      <span>ComponentB</span>
      <ComponentC />
    </div>
  );
}
