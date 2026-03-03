import { redirect } from "next/navigation";
import { verifyUser } from "@/lib/verifyUser";

export const metadata = {
    robots: "noindex, nofollow",
};

export default async function DashboardRoot() {
    const user: any = await verifyUser();

    if (user.role === "admin") {
        redirect("/dashboard/admin");
    } else {
        redirect("/dashboard/student");
    }
}