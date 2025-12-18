import { cookies } from "next/headers";

export async function isManager() {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;
  return role === "OWNER" || role === "MANAGER";
}
