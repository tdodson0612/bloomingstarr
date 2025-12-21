import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

// --- SERVER ACTION ---
async function createOverheadExpense(formData: FormData) {
  "use server";

  await prisma.overheadExpenses.create({
    data: {
      businessId: "demo-business", // TODO: replace with real business context
      expenseDate: formData.get("expenseDate")
        ? new Date(formData.get("expenseDate")!.toString())
        : null,
      category: formData.get("category")?.toString() || null,
      description: formData.get("description")?.toString() || null,
      vendor: formData.get("vendor")?.toString() || null,
      amount: formData.get("amount") ? Number(formData.get("amount")) : null,
      paymentMethod: formData.get("paymentMethod")?.toString() || null,
      invoiceNumber: formData.get("invoiceNumber")?.toString() || null,
      employee: formData.get("employee")?.toString() || null,
      notes: formData.get("notes")?.toString() || null,
    },
  });

  redirect("/overhead-expenses");
}

export default function NewOverheadExpensePage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Add Overhead Expense</h1>

      <form action={createOverheadExpense} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Expense Date</label>
          <input
            type="date"
            name="expenseDate"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Utilities, Rent, Insurance, Labor"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="description"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium">Vendor</label>
          <input
            type="text"
            name="vendor"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium">Amount ($)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            className="border p-2 rounded w-full"
            min="0"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <input
            type="text"
            name="paymentMethod"
            placeholder="e.g., Cash, Check, Credit Card, ACH"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Invoice Number */}
        <div>
          <label className="block text-sm font-medium">Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Employee */}
        <div>
          <label className="block text-sm font-medium">Employee</label>
          <input
            type="text"
            name="employee"
            placeholder="Who recorded this expense"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium">Notes</label>
          <textarea
            name="notes"
            className="border p-2 rounded w-full"
            rows={3}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
          <a
            href="/overhead-expenses"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}