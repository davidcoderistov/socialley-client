import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import ImageDisplay from '../ImageDisplay'
import _range from 'lodash/range'


interface MediaItem {
    _id: string
    url: string
    selected?: boolean
}

interface Props {
    items: MediaItem[]
    backgroundColor?: string
    minHeight?: number
    tile?: boolean
    onClick: (_id: string) => void
}

export default function MediaDisplay ({ items, backgroundColor = '#262626', minHeight = 450, tile = true, onClick }: Props) {

    const chunkedItems = useMemo(() => {
        const chunkedItems: MediaItem[][] = []
        for (let i = 0; i < items.length; i+=3) {
            chunkedItems.push(items.slice(i, i + 3))
        }
        return chunkedItems
    }, [items])

    return (
        <Box
            component='div'
            minHeight='0'
            minWidth='0'
            display='flex'
            flexDirection='column'
            justifyContent='flex-start'
            alignItems='stretch'
            alignContent='stretch'
            boxSizing='border-box'
            position='relative'
        >
            <Box
                component='div'
                display='block'
                flexGrow='1'
            >
                <Box
                    component='div'
                    display='block'
                >
                    <Box
                        component='div'
                        display='flex'
                        flexDirection='column'
                        paddingBottom='0'
                        paddingTop='0'
                        position='relative'
                    >
                        {chunkedItems.map((itemsChunk, index) => (
                            <Box
                                key={index}
                                component='div'
                                display='flex'
                                flexDirection='row'
                                alignItems='stretch'
                                flexShrink='0'
                                boxSizing='border-box'
                                position='relative'
                                sx={{ '&:last-child': { marginBottom: 0 }, '@media (min-width: 736px)': { marginBottom: '28px' }}}
                            >
                                {_range(3).map(itemIndex => (
                                    <Box
                                        key={itemIndex < itemsChunk.length ? itemsChunk[itemIndex]._id : index * chunkedItems.length + itemIndex}
                                        component='div'
                                        flex='1 0 0%'
                                        display='block'
                                        position='relative'
                                        width='100%'
                                        sx={{ '@media (min-width: 736px)': { marginRight: '28px' } }}
                                    >
                                        { itemIndex < itemsChunk.length && (
                                            <ImageDisplay
                                                url={itemsChunk[itemIndex].url}
                                                minHeight={minHeight}
                                                backgroundColor={backgroundColor}
                                                bordered={itemsChunk[itemIndex].selected}
                                                tile={tile}
                                                clickable
                                                onClick={() => onClick(itemsChunk[itemIndex]._id)} />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}