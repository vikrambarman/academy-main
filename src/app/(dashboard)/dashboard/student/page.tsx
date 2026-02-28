import LogoutButton from "@/components/LogoutButton";

export default function StudentDashboard() {
    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <LogoutButton />
            </div>
        </div>
    );
}