import Student from "@/models/Student";

export async function generateStudentId() {

    const year = new Date().getFullYear();

    const lastStudent = await Student.findOne({
        studentId: new RegExp(`^SCA-${year}-`)
    }).sort({ studentId: -1 });

    let serial = 1;

    if (lastStudent) {

        const lastSerial = parseInt(
            lastStudent.studentId.split("-")[2]
        );

        serial = lastSerial + 1;

    }

    return `SCA-${year}-${String(serial).padStart(4, "0")}`;

}