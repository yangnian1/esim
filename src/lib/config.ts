// Image URL helper - handles both absolute URLs and local paths
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return '/placeholder.png'
  if (imageUrl.startsWith('http')) return imageUrl
  // For relative paths, assume they're already correct relative to public folder
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
}
