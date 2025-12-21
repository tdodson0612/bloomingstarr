import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function handleLogout() {
  "use server";
  await destroySession();
  redirect("/login");
}

export default async function Topbar() {
  const session = await getSession();

  return (
    <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
      <div className="text-lg font-semibold">Blooming Starr</div>
      
      <div className="flex items-center gap-4">
        {session && (
          <>
            <div className="text-sm">
              <span className="font-medium">{session.name || "User"}</span>
              <span className="text-gray-500 ml-2">({session.role})</span>
            </div>
            
            <form action={handleLogout}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </form>
          </>
        )}
      </div>
    </header>
  );
}