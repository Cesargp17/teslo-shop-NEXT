import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export const SizeSelector = ({ selectedSize, sizes, onSelectSize }) => {

  return (
    <Box>
        {
            sizes.map( size => (
                <Button
                    onClick={ () => onSelectSize(size) }
                    key={ size }
                    size='small'
                    color={ selectedSize === size ? 'primary' : 'info' }
                >
                    { size }
                </Button>
            ))
        }
    </Box>
  )
}
