interface StarburstProps {
  className?: string;
}

export function Starburst({ className = "" }: StarburstProps) {
  const points = 16;
  const outer = 50;
  const inner = 22;
  const path = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <polygon points={path} fill="currentColor" />
    </svg>
  );
}

// Keep legacy function for backwards compatibility
export function createStarburst(className = "") {
  const points = 16;
  const outer = 50;
  const inner = 22;
  const path = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");

  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  if (className) svg.setAttribute("class", className);

  const polygon = document.createElementNS(xmlns, "polygon");
  polygon.setAttribute("points", path);
  polygon.setAttribute("fill", "currentColor");
  svg.appendChild(polygon);

  return svg;
}
