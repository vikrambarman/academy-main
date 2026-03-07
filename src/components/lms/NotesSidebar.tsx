"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Module {
    module: string;
    topics: string[];
}

interface Props {
    syllabus: Module[];
    courseSlug: string;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
}

export default function NotesSidebar({
    syllabus,
    courseSlug,
}: Props) {

    const pathname = usePathname();

    return (

        <div className="p-4 space-y-6">

            {syllabus.map((mod, i) => {

                const moduleSlug = slugify(mod.module);

                return (

                    <div key={i}>

                        <h3 className="font-semibold text-gray-800 mb-2">
                            {mod.module}
                        </h3>

                        <ul className="space-y-1">

                            {mod.topics.map((topic, j) => {

                                const topicSlug = slugify(topic);

                                const url =
                                    `/dashboard/student/notes/${courseSlug}/${moduleSlug}/${topicSlug}`;

                                const active = pathname === url;

                                return (

                                    <li key={j}>

                                        <Link
                                            href={url}
                                            className={`block px-3 py-2 rounded text-sm transition
                        ${active
                                                    ? "bg-indigo-100 text-indigo-700 font-medium"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {topic}
                                        </Link>

                                    </li>

                                );
                            })}

                        </ul>

                    </div>

                );
            })}

        </div>

    );
}