export default function BoostsTable({ boosts }) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <h2 className="text-lg font-semibold mb-4">Boosts actifs</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
            <th className="py-2 text-left">Produit</th>
            <th className="py-2 text-left">Type</th>
            <th className="py-2 text-left">Début</th>
            <th className="py-2 text-left">Fin</th>
          </tr>
        </thead>

        <tbody>
          {boosts.map((b) => (
            <tr key={b.id} className="border-b border-neutral-100 dark:border-neutral-800">
              <td className="py-3">{b.product?.name}</td>
              <td>{b.type}</td>
              <td>{new Date(b.startDate).toLocaleDateString()}</td>
              <td>{new Date(b.endDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
