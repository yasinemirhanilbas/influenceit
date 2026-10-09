// Avatar: the creator's profile photo when there is one, otherwise a geometric shape with initials.
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
  if (avatar.image) {
    return (
      // Photos are user uploads served by /api/images; next/image optimisation is not needed for these small avatars.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={`shrink-0 object-cover ${size} ${shapes[avatar.shape] ?? shapes.circle}`}
      />
    );
  }
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
