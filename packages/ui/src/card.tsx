export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border p-4 rounded-xl bg-white drop-shadow-lg ">
      <h1 className="text-xl border-b pb-2">{title}</h1>
      <div>{children}</div>
    </div>
  );
}
