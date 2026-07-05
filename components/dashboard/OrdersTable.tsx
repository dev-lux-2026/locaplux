export default function OrdersTable({ orders }) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <h2 className="text-lg font-semibold mb-4">Ventes récentes</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
            <th className="py-2 text-left">Commande</th>
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Total</th>
            <th className="py-2 text-left">Commission</th>
            <th className="py-2 text-left">Reversé</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-neutral-100 dark:border-neutral-800">
              <td className="py-3">{o.id.slice(0, 8)}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.total} €</td>
              <td>{o.commissionAmount} €</td>
              <td>{o.partnerAmount} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
