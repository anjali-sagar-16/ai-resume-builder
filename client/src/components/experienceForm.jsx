import { LoaderCircle, Sparkles } from 'lucide-react'

const ExperienceForm = ({ onEnhance, loading }) => (
  <button type="button" onClick={onEnhance} disabled={loading} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60">
    {loading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} Enhance with AI
  </button>
)

export default ExperienceForm