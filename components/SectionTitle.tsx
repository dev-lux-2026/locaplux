export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold mb-6 tracking-tight">
      {children}
    </h2>
  );
}
