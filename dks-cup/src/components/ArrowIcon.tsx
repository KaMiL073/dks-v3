export function ArrowIcon({ direction = "right" }: { direction?: "right" | "up" | "down" }) {
  return <span aria-hidden className={`arrow arrow--${direction}`} />;
}
