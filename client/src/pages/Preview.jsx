import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, FileDown } from "lucide-react";

import ResumePreview from "../components/ResumePreview";
import api from '../config/api'
import Loader from '../components/Loader'

const Preview = () => {
    const { resumeId } = useParams();

    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: token } : undefined

        api.get(`/api/resumes/get/${resumeId}`, { headers })
            .then(({ data }) => setResumeData(data.resume))
            .catch(() => api.get(`/api/resumes/public/${resumeId}`)
                .then(({ data }) => setResumeData(data.resume))
                .catch(() => setResumeData(null)))
            .finally(() => setLoading(false));
    }, [resumeId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Loader />
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

                    <h1 className="text-xl font-semibold text-gray-800">
                        Resume Not Found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        The resume you are trying to preview could not be found.
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">

            <div className="mx-auto max-w-5xl">

                <div className="mb-4 flex justify-end gap-2 print:hidden">
                    <button type="button" onClick={() => window.history.back()} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700">
                        <ArrowLeft className="size-4" /> Back
                    </button>
                    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-xs font-medium text-white">
                        <FileDown className="size-4" /> Print / PDF
                    </button>
                </div>

                <ResumePreview
                    data={resumeData}
                    template={resumeData.template || "classic"}
                />

            </div>

        </div>
    );
};

export default Preview;