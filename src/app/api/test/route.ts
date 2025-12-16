import { prisma } from "@/lib/db";

export async function GET() {
  const businesses = await prisma.business.findMany();
  return Response.json(businesses);
}
