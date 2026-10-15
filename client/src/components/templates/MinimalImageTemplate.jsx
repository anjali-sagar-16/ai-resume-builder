import { Mail, Phone, MapPin } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";

        const [year, month] = dateStr.split("-");

        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const resume = data || {};
    const personalInfo = resume.personal_info || {};

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                {/* Profile Image */}
                <div className="col-span-1 py-10">
                    {personalInfo.image && typeof personalInfo.image === "string" && (
                        <div className="mb-6">
                            <img
                                src={personalInfo.image}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                                style={{ background: `${accentColor}70` }}
                            />
                        </div>
                    )}

                    {personalInfo.image && typeof personalInfo.image === "object" && (
                        <div className="mb-6">
                            <img
                                src={URL.createObjectURL(personalInfo.image)}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                        </div>
                    )}
                </div>

                {/* Name + Profession */}
                <div className="col-span-2 flex flex-col justify-center py-10 px-8">
                    <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
                        {personalInfo.full_name || "Your Name"}
                    </h1>

                    <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
                        {personalInfo.profession || "Profession"}
                    </p>
                </div>

                {/* Left Sidebar */}
                <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">

                    {/* Contact */}
                    <section className="mb-8">
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                            CONTACT
                        </h2>

                        <div className="space-y-2 text-sm">

                            {personalInfo.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone
                                        size={14}
                                        style={{ color: accentColor }}
                                    />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}

                            {personalInfo.email && (
                                <div className="flex items-center gap-2">
                                    <Mail
                                        size={14}
                                        style={{ color: accentColor }}
                                    />
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}

                            {personalInfo.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={14}
                                        style={{ color: accentColor }}
                                    />
                                    <span>{personalInfo.location}</span>
                                </div>
                            )}

                        </div>
                    </section>

                    {/* Education */}
                    {resume.education?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                EDUCATION
                            </h2>

                            <div className="space-y-4 text-sm">
                                {resume.education.map((edu, index) => (
                                    <div key={edu._id || index}>

                                        <p className="font-semibold uppercase">
                                            {edu.degree}
                                        </p>

                                        {edu.field && (
                                            <p className="text-zinc-600">
                                                {edu.field}
                                            </p>
                                        )}

                                        <p className="text-zinc-600">
                                            {edu.institution}
                                        </p>

                                        <p className="text-xs text-zinc-500">
                                            {formatDate(edu.graduation_date)}
                                        </p>

                                        {edu.gpa && (
                                            <p className="text-xs text-zinc-500">
                                                GPA: {edu.gpa}
                                            </p>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {resume.skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                                SKILLS
                            </h2>

                            <ul className="space-y-1 text-sm">
                                {resume.skills.map((skill, index) => (
                                    <li key={index}>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                </aside>

                {/* Right Content */}
                <main className="col-span-2 p-8 pt-0">

                    {/* Summary */}
                    {resume.professional_summary && (
                        <section className="mb-8">

                            <h2
                                className="text-sm font-semibold tracking-widest mb-3"
                                style={{ color: accentColor }}
                            >
                                SUMMARY
                            </h2>

                            <p className="text-zinc-700 leading-relaxed">
                                {resume.professional_summary}
                            </p>

                        </section>
                    )}

                    {/* Experience */}
                    {resume.experience?.length > 0 && (
                        <section>

                            <h2
                                className="text-sm font-semibold tracking-widest mb-4"
                                style={{ color: accentColor }}
                            >
                                EXPERIENCE
                            </h2>

                            <div className="space-y-6 mb-8">

                                {resume.experience.map((exp, index) => (
                                    <div key={exp._id || index}>

                                        <div className="flex justify-between items-center">

                                            <h3 className="font-semibold text-zinc-900">
                                                {exp.position}
                                            </h3>

                                            <span className="text-xs text-zinc-500">
                                                {formatDate(exp.start_date)} -{" "}
                                                {exp.is_current
                                                    ? "Present"
                                                    : formatDate(exp.end_date)}
                                            </span>

                                        </div>

                                        <p
                                            className="text-sm mb-2"
                                            style={{ color: accentColor }}
                                        >
                                            {exp.company}
                                        </p>

                                        {exp.description && (
                                            <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </div>
                                        )}

                                    </div>
                                ))}

                            </div>

                        </section>
                    )}

                    {/* Projects */}
                    {resume.project?.length > 0 && (
                        <section>

                            <h2
                                className="text-sm uppercase tracking-widest font-semibold"
                                style={{ color: accentColor }}
                            >
                                PROJECTS
                            </h2>

                            <div className="space-y-4">

                                {resume.project.map((project, index) => (
                                    <div key={project._id || index}>

                                        <h3 className="text-md font-medium text-zinc-800 mt-3">
                                            {project.name}
                                        </h3>

                                        {project.type && (
                                            <p
                                                className="text-sm mb-1"
                                                style={{ color: accentColor }}
                                            >
                                                {project.type}
                                            </p>
                                        )}

                                        {project.description && (
                                            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                                                {project.description}
                                            </p>
                                        )}

                                    </div>
                                ))}

                            </div>

                        </section>
                    )}

                </main>

            </div>
        </div>
    );
};

export default MinimalImageTemplate;