import React from 'react';
import { TextInputProps } from 'react-native';

import { Container, Icon, TextInput } from './styles';

type InputProps = TextInputProps & {
  setValue: (value: string) => void;
  icon: string;
};

const Input = ({ setValue, icon, ...rest }: InputProps) => {

  return (
    <Container>
      <Icon name={icon} size={24}  />

      <TextInput
        keyboardAppearance="light"
        onChangeText={setValue}
        autoFocus={true}
        {...rest}
      />
    </Container>
  );
};

export default Input;