import React, { useState, useMemo } from 'react'
import { useSnackbar } from 'notistack'


type AllowedMimeType = 'image/jpeg' | 'image/png' | 'video/mp4'

interface Props {
    mimeTypes: AllowedMimeType[]
    onChangeFile: (file: File) => void
}

export default function UploadFile (props: Props) {

    const [uploadKey, setUploadKey] = useState(0)

    const { enqueueSnackbar } = useSnackbar()

    const allowedMimeTypes = useMemo(() => {
        if (props.mimeTypes.length > 0) {
            return props.mimeTypes
        }
        return ['image/jpeg', 'image/png']
    }, [props.mimeTypes])

    const allowedExtensions = useMemo(() => {
        const extensions: string[] = []
        allowedMimeTypes.forEach(type => {
            if (type === 'image/jpeg') {
                extensions.push('.jpg')
                extensions.push('.jpeg')
            } else if (type === 'image/png') {
                extensions.push('.png')
            } else if (type === 'video/mp4') {
                extensions.push('.mp4')
            }
        })
        return extensions
    }, [allowedMimeTypes])

    const accept = useMemo(() => allowedMimeTypes.join(','), [allowedMimeTypes])

    const acceptVideos = useMemo(() => allowedMimeTypes.some(t => t === 'video/mp4'), [allowedMimeTypes])

    const handleUploadFile = ({ target: { validity, files }}: React.ChangeEvent<HTMLInputElement>) => {
        if (validity.valid && files && files[0]) {
            const file = files[0]
            const isAllowedMimeType = allowedMimeTypes.some(t => t === file.type)
            const isAllowedExtension = allowedExtensions.some(e => e === file.name.substring(file.name.lastIndexOf('.')))
            if (isAllowedMimeType && isAllowedExtension) {
                props.onChangeFile(file)
                setUploadKey(uploadKey + 1)
            } else {
                enqueueSnackbar(acceptVideos ?
                    'You can upload photos and videos only' :
                    'You can upload photos only', { variant: 'error' })
            }
        }
    }

    return (
        <input
            key={uploadKey}
            type='file'
            hidden
            accept={accept}
            onChange={handleUploadFile} />
    )
}