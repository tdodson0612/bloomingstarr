import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Blooming Starr
      </h1>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        <Link href="/time-clock" className="home-btn">
          Time Clock
        </Link>

        <Link href="/plant-intake" className="home-btn">
          Product Data
        </Link>

        <Link href="/schedule" className="home-btn">
          Schedule
        </Link>

        <Link href="/help" className="home-btn">
          Help
        </Link>
      </div>
    </div>
  );
}
