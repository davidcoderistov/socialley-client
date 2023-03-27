import React, { useRef } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { TextField } from '@mui/material'
import ImageDisplay from '../ImageDisplay'
import { createTheme, ThemeProvider } from '@mui/material/styles'


const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const PostPreview = React.forwardRef((props: { url: string | null, containerProps?: BoxProps }, ref) => {

    const inputRef = useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => ({
        getPostText: () => inputRef?.current?.value ?? ''
    }))

    return (
        <Box
            component='div'
            display='block'
            maxHeight='inherit'
            borderRadius='0'
        >
            <ThemeProvider theme={darkTheme}>
                <Box
                    component='div'
                    display='flex'
                    paddingTop='15px'
                    paddingBottom='15px'
                >
                    <TextField
                        inputRef={inputRef}
                        label='Post title'
                        variant='outlined'
                        fullWidth
                    />
                </Box>
                <Box
                    component='div'
                    maxHeight='inherit'
                    maxWidth='inherit'
                    justifyContent='center'
                    flexDirection='column'
                    alignItems='stretch'
                    alignContent='stretch'
                    display='flex'
                    boxSizing='border-box'
                    position='relative'
                >
                    <ImageDisplay
                        url={props.url ?? ''}
                        remote={false}
                        backgroundColor='#000000'
                        aspectRatioPercentage={100} />
                </Box>
            </ThemeProvider>
        </Box>
    )
})

export default PostPreview