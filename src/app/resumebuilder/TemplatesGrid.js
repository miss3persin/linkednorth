export default function TemplatesGrid({ templates, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
      {templates.map((tpl) => (
        <div
          key={tpl.id}
          onClick={() => onSelect(tpl)}
          className="border rounded-lg p-3 hover:shadow cursor-pointer"
        >
          <img src={tpl.thumbnail} className="w-full rounded" />
          <p className="mt-2 sm:mt-3 text-sm font-semibold text-gray-700">
            {tpl.name}
          </p>
          <p className="text-xs text-gray-500">
            {tpl.description}
          </p>
        </div>
      ))}
    </div>
  )
}
