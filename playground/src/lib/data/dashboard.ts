/**
 * The signed-in user. A placeholder until accounts land in Phase 7, when this
 * reads the Supabase session instead.
 */
export type DashboardData = { user: { name: string; initials: string } };

export async function getDashboardData(): Promise<DashboardData> {
  return { user: { name: "Alex", initials: "AR" } };
}
