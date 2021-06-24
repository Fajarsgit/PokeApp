import React, { useCallback } from 'react';
import { Animated } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Pokemon } from '../../../types';
import Text from '../../../components/Text';
import Pokeball from '../../../components/Pokeball';

import { Container, GoBackButton, HeartIcon } from './styles';
import { ScrollView } from 'react-native-gesture-handler';

type HeaderProps = {
  translateY: Animated.Value;
  pokemon: Pokemon;
};

const Header = ({ pokemon, translateY }: HeaderProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const fadeStyle = {
    opacity: translateY.interpolate({
      inputRange: [-300, -200],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };

  return (
    <ScrollView>
    <Container>
    
      <GoBackButton onPress={handleGoBack}>
        <Icon name="arrow-left" color={colors.white} size={24} />
      </GoBackButton>
      
      <HeartIcon>
      <Icon name="heart" color={colors.white} size={24} />
      </HeartIcon>
      
      <Animated.View style={fadeStyle}>
        <Text variant="body1" color="white" bold>
          {pokemon.name}
        </Text>
      </Animated.View>
      
      <Animated.View style={fadeStyle}>
        <Text variant="body3" color="white" bold>
          #{pokemon.pokedex_number}
        </Text>
      </Animated.View>
      
      <Pokeball
        width={150}
        height={150}
        withRotate
        style={{
          position: 'absolute',
          right: -32,
          ...fadeStyle,
        }}
      />
      
    </Container>
   </ScrollView>
  );
};

export default Header;
