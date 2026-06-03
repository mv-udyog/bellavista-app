export default function OrderTimeline({ status }) {
  const steps = [
    "PLACED",
    "CONFIRMED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const active = steps.indexOf(status) >= i;

        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                active ? "bg-black" : "bg-gray-300"
              }`}
            />

            <p
              className={`text-xs ${
                active ? "text-black" : "text-gray-400"
              }`}
            >
              {step.replaceAll("_", " ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
