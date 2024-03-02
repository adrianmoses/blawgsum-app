interface MediaProps {
  id: string
  url: string
  filename: string
}

interface MediaItemProps {
  media: MediaProps
}

const MediaItem = ({ media }: MediaItemProps) => {
  return (
    <div className="flex mb-8">
      <div className="mr-4 flex-shrink-0">
        <img
          alt={media.filename}
          className="h-16 w-16"
          src={media.url}
        />
      </div>
      <div>
        <h4 className="text-lg font-bold">{media.filename}</h4>
      </div>
    </div>
  )
}

export default MediaItem
