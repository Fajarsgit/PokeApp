import styled from 'styled-components/native';
import { Animated, FlatList, ImageBackground } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import { Pokemon } from '../../types';

export const Container = styled.View`
  flex: 1;
`;

export const PokemonsList = styled(FlatList as new () => FlatList<Pokemon>)`
  flex: 1;
  margin-top: 35px;
`;

export const Button = styled(RectButton)`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.lilac};
  box-shadow: 0px 3px 6px ${({ theme }) => `${theme.colors.black}40`};

  position: absolute;
  bottom: 0;
  right: 0;

  justify-content: center;
  align-items: center;
`;

export const OverlayBackground = styled(Animated.View)`
  background: ${({ theme }) => `${theme.colors.black}60`};
`;

export const Dot = styled.View`
  width: 6px;
  height: 6px;
  background: ${({ theme }) => theme.colors.white}20;
  margin-left: 8px;
  margin-top: 10px;
`;

export const PokeIcon = styled(ImageBackground)`
  flex: 1;
  position: absolute;
  margin-left: 258px;
  padding-top: 50px;
  margin-bottom: 5px;
`;