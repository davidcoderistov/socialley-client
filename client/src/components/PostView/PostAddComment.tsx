import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import InputBase from '@mui/material/InputBase'


interface Props {
    comment: string
    postingComment: boolean
    onChangeComment: (comment: string) => void
    onPostComment: () => void
}

export default function PostAddComment (props: Props) {

    const handleChangeComment = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeComment(event.target.value)
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
                padding='20px'
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
                    border='1px solid #363636'
                    borderRadius='22px'
                    boxSizing='border-box'
                    display='flex'
                    flexDirection='row'
                    flexShrink='0'
                    margin='0'
                    padding='0'
                    minHeight='44px'
                    paddingLeft='11px'
                    paddingRight='8px'
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
                            value={props.comment}
                            onChange={handleChangeComment}
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
                            fullWidth
                        />
                    </Box>
                    { props.postingComment ? (
                        <CircularProgress size={16} sx={{ marginRight: '26px' }}/>
                    ) : (
                        <Button
                            variant='text'
                            sx={{ textTransform: 'none', '&.Mui-disabled': { color: '#A8A8A8' } }}
                            onClick={props.onPostComment}
                            disabled={props.comment.trim().length <= 0}
                        >
                            Post
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}