// Placeholder avatar: a geometric shape with initials. No photos are used.
const shapes = {
  circle: "rounded-full",
  square: "rounded-2xl",
  arch: "rounded-t-full rounded-b-lg",
};

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({ name, avatar, size = "h-14 w-14", text = "text-lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center font-display font-semibold ${size} ${text} ${shapes[avatar.shape] ?? shapes.circle}`}
      style={{ backgroundColor: avatar.bg, color: avatar.fg }}
    >
      {getInitials(name)}
    </span>
  );
}
