import Link from "next/link";

const links = [
  { name: "Plant Intake", href: "/plant-intake" },
  { name: "Product Intake", href: "/product-intake" },
  { name: "Transplant Log", href: "/transplant-log" },
  { name: "Treatment Tracking", href: "/treatment-tracking" },
  { name: "Fertilizer Log", href: "/fertilizer-log" },
  { name: "Overhead Expenses", href: "/overhead-expenses" },
  { name: "Sales", href: "/sales" },
  { name: "Pricing", href: "/pricing" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Blooming Starr</h2>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block text-gray-700 hover:text-black hover:font-medium"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
