import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({ data, template }) => {
  const accentColor = data?.accent_color || '#2563eb'

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return (
          <ModernTemplate
            accentColor={accentColor}
            data={data}
          />
        )

      case 'minimal':
        return (
          <MinimalTemplate
            accentColor={accentColor}
            data={data}
          />
        )

      case 'minimal-image':
        return (
          <MinimalImageTemplate
            accentColor={accentColor}
            data={data}
          />
        )

      case 'classic':
      default:
        return (
          <ClassicTemplate
            accentColor={accentColor}
            data={data}
          />
        )
    }
  }

  return (
    <div
      id="resume-preview"
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {renderTemplate()}
    </div>
  )
}

export default ResumePreview