import { memo } from "react";

function Skeleton({ as: Component = "div", className = "", rounded = "rounded-xl" }) {
  return <Component aria-hidden="true" className={["skeleton", rounded, className].filter(Boolean).join(" ")} />;
}

export default memo(Skeleton);
