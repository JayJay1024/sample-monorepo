import { useEffect } from "react";
import { useApp } from "../hooks/app";
import { ComponentD, ComponentDMemo } from "./ComponentD";

export function ComponentC() {
  const { count, setCount } = useApp();

  console.log("ComponentC~");

  useEffect(() => {
    console.log("ComponentC::useEffect");
  }, []);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>{`ComponentC (${count})`}</button>
      <ComponentD />
      <ComponentDMemo tag="memo" />
    </div>
  );
}
