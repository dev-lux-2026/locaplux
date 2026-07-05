export default function InvoicesTable({ invoices }) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <h2 className="text-lg font-semibold mb-4">Factures</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
            <th className="py-2 text-left">ID</th>
            <th className="py-2 text-left">Type</th>
            <th className="py-2 text-left">Montant</th>
            <th className="py-2 text-left">TVA</th>
            <th className="py-2 text-left">Total</th>
            <th className="py-2 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => (
            <tr key={i.id} className="border-b border-neutral-100 dark:border-neutral-800">
              <td className="py-3">{i.id.slice(0, 8)}</td>
              <td>{i.type}</td>
              <td>{i.amount} €</td>
              <td>{i.vat} €</td>
              <td>{i.total} €</td>
              <td>{new Date(i.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
