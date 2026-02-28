import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboard() {
    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <LogoutButton />
            </div>
        </div>
    );
}