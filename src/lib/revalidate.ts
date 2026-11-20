import { revalidatePath } from "next/cache";

/** Refresh every public page that lists projects or ERPs after an admin change. */
export function revalidatePortfolio() {
  try {
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/projects/[slug]", "page");
    revalidatePath("/erp");
    revalidatePath("/erp/[slug]", "page");
    revalidatePath("/sitemap.xml");
  } catch (err) {
    console.error("revalidatePortfolio failed:", err);
  }
}
