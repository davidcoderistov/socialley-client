import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import PostImage from '../PostImage'
import _range from 'lodash/range'


interface MediaItem {
    _id: string
    url: string
}

interface Props {
    items: MediaItem[]
}

export default function MediaDisplay (props: Props) {

    const chunkedItems = useMemo(() => {
        const chunkedItems: MediaItem[][] = []
        for (let i = 0; i < props.items.length; i+=3) {
            chunkedItems.push(props.items.slice(i, i + 3))
        }
        return chunkedItems
    }, [props.items])

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
                                        key={index * chunkedItems.length + itemIndex}
                                        component='div'
                                        flex='1 0 0%'
                                        display='block'
                                        position='relative'
                                        width='100%'
                                        sx={{ '@media (min-width: 736px)': { marginRight: '28px' } }}
                                    >
                                        { itemIndex < itemsChunk.length && (
                                            <PostImage minHeight={100} />
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