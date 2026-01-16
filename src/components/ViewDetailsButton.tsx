'use client'

interface ViewDetailsButtonProps {
  text: string
}

export function ViewDetailsButton({ text }: ViewDetailsButtonProps) {
  return (
    <button
      onClick={(e) => e.preventDefault()}
      className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm font-medium"
      disabled
    >
      {text}
    </button>
  )
}

