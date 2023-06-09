import { useRadio, Box } from "@chakra-ui/react"
import { useEffect } from "react"

export default function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={['4', '10']}
        py={['3', '6']}
        onClick={() => {props.setNext(true)}}
      >
        {props.children}
      </Box>
    </Box>
  )
}