export default function Menu({
  children,
  className = "",
  positionClassName = "",
  ...props
}) {
  const baseSurface =
    "bg-bg-secondary rounded-xl border-3 border-border-muted p-3 animate-fade-in";

  const basePosition =
    "fixed left-1/2 top-8 -translate-x-1/2 mt-14 " +
    "sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:translate-x-0 sm:mt-8";

  const classes = `${baseSurface} ${basePosition} ${positionClassName} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}