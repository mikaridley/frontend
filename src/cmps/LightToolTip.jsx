import { Tooltip as MuiTooltip } from '@mui/material'

export function LightTooltip(props) {
    return (
        <MuiTooltip
            arrow
            {...props}
            componentsProps={{
                tooltip: {
                    sx: {
                        backgroundColor: '#fff',
                        color: '#000',
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    },
                },
                arrow: {
                    sx: {
                        color: '#fff',
                    },
                },
            }}
        />
    )
}