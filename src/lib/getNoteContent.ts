import fs from "fs"
import path from "path"

export function getNoteContent(
    course: string,
    module: string,
    topic: string
) {

    const filePath = path.join(
        process.cwd(),
        "src",
        "content",
        "notes",
        course,
        module,
        `${topic}.md`
    )

    if (!fs.existsSync(filePath)) {
        return null
    }

    return fs.readFileSync(filePath, "utf8")
}