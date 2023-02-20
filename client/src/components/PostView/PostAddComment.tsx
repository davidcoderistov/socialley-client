import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import InputBase from '@mui/material/InputBase'
import { CreateOutlined } from '@mui/icons-material'


interface Props {
    postingComment: boolean
    onPostComment: (comment: string) => void
}

export default function PostAddComment (props: Props) {

    const inputRef = useRef<HTMLInputElement>(null)

    const handlePostComment = () => {
        const comment = inputRef?.current?.value
        if (comment && comment.trim().length > 0) {
            props.onPostComment(comment)
            inputRef.current.value = ''
        }
    }

    return (
        <Box
            component='div'
            flex='0 0 auto'
            justifyContent='flex-start'
            flexDirection='column'
            alignItems='stretch'
            alignContent='stretch'
            display='flex'
            boxSizing='border-box'
            position='relative'
        >
            <Box
                component='div'
                paddingLeft='16px'
                flex='0 0 auto'
                justifyContent='flex-start'
                flexDirection='column'
                alignItems='stretch'
                alignContent='stretch'
                display='flex'
                boxSizing='border-box'
                position='relative'
            >
                <Box
                    component='div'
                    alignItems='center'
                    boxSizing='border-box'
                    display='flex'
                    flexDirection='row'
                    flexShrink='0'
                    margin='0'
                    padding='0'
                    minHeight='44px'
                    position='relative'
                >
                    <Box
                        component='div'
                        marginRight='4px'
                        flex='1 1 auto'
                        minHeight='0'
                        minWidth='0'
                        justifyContent='flex-start'
                        flexDirection='column'
                        alignItems='stretch'
                        alignContent='stretch'
                        display='flex'
                        boxSizing='border-box'
                        position='relative'
                    >
                        <InputBase
                            inputRef={inputRef}
                            sx={{
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                    display: 'none',
                                },
                                '& input': {
                                    MozAppearance: 'textfield',
                                    '&::placeholder': {
                                        fontSize: '14px',
                                        color: '#EEEEFF'
                                    },
                                },
                                color: '#FFFFFF',
                            }}
                            placeholder='Add a comment...'
                            startAdornment={<CreateOutlined sx={{ marginRight: '4px' }} />}
                            fullWidth
                        />
                    </Box>
                    { props.postingComment ? (
                        <CircularProgress size={16} sx={{ marginRight: '14px' }}/>
                    ) : (
                        <Button
                            variant='text'
                            sx={{
                                textTransform: 'none',
                                paddingX: 0,
                                minWidth: 0,
                                '&.Mui-disabled': { color: '#A8A8A8' }
                            }}
                            onClick={handlePostComment}
                        >
                            Post
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}