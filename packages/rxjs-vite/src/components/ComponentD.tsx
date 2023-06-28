import { useEffect, memo } from "react";

export function ComponentD({ tag = "default" }: { tag?: "default" | "memo" }) {
  console.log("ComponentD~", tag);

  useEffect(() => {
    console.log("ComponentD::useEffect", tag);
  }, [tag]);

  return (
    <div>
      <span>ComponentD ({tag})</span>
    </div>
  );
}

export const ComponentDMemo = memo(ComponentD);
