export default function ErrorText({ children }) {
  if (!children) return null;
  return <p className="text-red-500 text-sm">{children}</p>;
}
