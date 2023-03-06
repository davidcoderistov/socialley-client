import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material'
import NavItem, { NavType } from './NavItem'
import { NavLink as Link } from 'react-router-dom'


const StyledLink = styled(Link)({
    color: 'black',
    textDecoration: 'none',
})

interface LinkProps {
    to: string
    type: NavType
    isNotLink?: never
    bordered?: boolean
    onClick?: never
}

interface NotLinkProps {
    to?: never
    type: NavType
    isNotLink: true
    bordered?: boolean
    onClick: () => void
}

export type NavLinkProps = LinkProps | NotLinkProps

export default function NavLink ({ to, isNotLink, onClick, type, bordered = false }: NavLinkProps) {

    const [isHovered, setIsHovered] = useState(false)

    const handleOnMouseEnter = () => {
        setIsHovered(true)
    }

    const handleOnMouseLeave = () => {
        setIsHovered(false)
    }

    return !isNotLink ? (
        <StyledLink
            to={to}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            {({ isActive }) => (
                <NavItem
                    active={isActive}
                    hovered={isHovered}
                    type={type} />
            )}
        </StyledLink>
    ) : (
        <Box
            component='div'
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            sx={{ cursor: 'pointer' }}
            onClick={onClick}
        >
            <NavItem
                active={false}
                hovered={isHovered}
                bordered={bordered}
                type={type} />
        </Box>
    )
}