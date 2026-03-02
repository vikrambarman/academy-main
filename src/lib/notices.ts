export type NoticeType = {
    _id: string;
    title: string;
    desc: string;
    date: string;   // ISO format
    label: string;
};

const dummyNotices: NoticeType[] = [
    {
        _id: "1",
        title: "Academy Picnic – December 27",
        desc: "Annual student picnic successfully organized with participation from various computer courses.",
        date: "2025-12-27",
        label: "27 Dec 2025",
    },
    {
        _id: "2",
        title: "New Admissions Open",
        desc: "Admissions now open for DCA, ADCA, Tally, Web Development and Software Development programs.",
        date: "2025-01-01",
        label: "Ongoing",
    },
    {
        _id: "3",
        title: "GSDM Certificate Update",
        desc: "GSDM certificates for selected students have started generating and are available for verification.",
        date: "2025-02-01",
        label: "Latest",
    },
];

// ✅ Get All Notices (sorted latest first)
export async function getNotices(): Promise<NoticeType[]> {
    const sorted = [...dummyNotices].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted;
}

// ✅ Get Single Notice by ID
export async function getNoticeById(
    id: string
): Promise<NoticeType | undefined> {
    const notices = await getNotices();
    return notices.find((notice) => notice._id === id);
}