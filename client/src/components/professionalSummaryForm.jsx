import { LoaderCircle, Sparkles } from 'lucide-react'

const ProfessionalSummaryForm = ({ value, onChange, onEnhance, loading }) => (
  <>
    <textarea
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      rows="6"
      placeholder="Write your professional summary..."
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
    <button type="button" onClick={onEnhance} disabled={loading} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60">
      {loading ? <LoaderCircle className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} AI Enhance
    </button>
  </>
)

export default ProfessionalSummaryForm