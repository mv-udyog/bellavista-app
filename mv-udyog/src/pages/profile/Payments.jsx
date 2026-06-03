import MainLayout from "@/layout/MainLayout";
export default function Payments() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-black">Payment Methods</h1>
        <p className="text-slate-500 mt-2">Manage your saved cards and UPI IDs.</p>
      </div>
    </MainLayout>
  );
}