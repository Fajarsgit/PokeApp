import styled from 'styled-components/native';
import { Animated } from 'react-native';

import { PokeballProps } from './index';

export const Container = styled(Animated.View)`
  right: -10px;
  align-items: center;
  justify-content: center;
`;

export const PokeballImage = styled.Image<PokeballProps>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;
