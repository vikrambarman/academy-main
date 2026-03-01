export default function StudentHome() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Student Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Course</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        View enrolled course details
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Fees Status</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Check payment status
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Certificate</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Track certificate progress
                    </p>
                </div>

            </div>
        </div>
    );
}