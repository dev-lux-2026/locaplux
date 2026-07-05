export default function OrderStatusTimeline({ status }: { status: string }) {
  const steps = ["paid", "shipped", "delivered"];

  return (
    <div className="flex items-center gap-4 mt-6">
      {steps.map((step, i) => {
        const active = steps.indexOf(status) >= i;

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${
                active ? "bg-green-600" : "bg-gray-300"
              }`}
            />
            <span
              className={`text-sm ${
                active ? "text-green-700 font-semibold" : "text-gray-500"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className="w-8 h-[2px] bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
