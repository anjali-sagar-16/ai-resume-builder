
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe
} from 'lucide-react'

const PersonalInfoForm = ({
  data,
  setData,
  removeBg,
  setRemoveBg
}) => {
  const fields = [
    {
      key: 'full_name',
      label: 'Full Name',
      type: 'text',
      icon: User,
      required: true
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      icon: Mail,
      required: true
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'text',
      icon: Phone,
      required: false
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text',
      icon: MapPin,
      required: false
    },
    {
      key: 'profession',
      label: 'Profession',
      type: 'text',
      icon: Briefcase,
      required: false
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Profile',
      type: 'url',
      icon: Globe,
      required: false
    },
    {
      key: 'website',
      label: 'Personal Website',
      type: 'url',
      icon: Globe,
      required: false
    }
  ]

  const handleChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [key]: value
      }
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setData((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        image: file
      }
    }))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Personal Information
        </h2>

        <button
          type="button"
          className="text-xs text-gray-500 hover:text-gray-900 font-medium"
        >
          Next &gt;
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-0.5 mb-5">
        Get Started with the personal information
      </p>

      <div className="flex items-center gap-4 mb-6">

        <label className="size-16 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center cursor-pointer bg-gray-50 hover:opacity-90 transition">

          {data.personal_info?.image ? (
            <img
              src={data.personal_info.image instanceof File ? URL.createObjectURL(data.personal_info.image) : data.personal_info.image}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="size-7 text-gray-400" />
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 select-none">
            Remove Background
          </span>

          <input
            type="checkbox"
            checked={removeBg}
            onChange={(e) => setRemoveBg(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

      </div>

      <div>

        {fields.map((field) => {
          const Icon = field.icon

          return (
            <div
              key={field.key}
              className="space-y-1 mt-4"
            >

              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">

                <Icon className="size-3.5 text-gray-500" />

                <span>{field.label}</span>

                {field.required && (
                  <span className="text-red-500">*</span>
                )}

              </label>

              <input
                type={field.type}
                value={data.personal_info?.[field.key] || ''}
                onChange={(e) =>
                  handleChange(field.key, e.target.value)
                }
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required={field.required}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-xs text-gray-700"
              />

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default PersonalInfoForm
