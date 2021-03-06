import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Animated, Alert, Dimensions, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import api from '../../services/api';
import { API_OFFSET } from '../../constants';
import { Pokemon } from '../../types';
import useSearch from '../../hooks/search';
import Text from '../../components/Text';
import Loading from '../../components/Loading';
import Header from '../../components/Header';
import PokemonCard from './PokemonCard';
import SearchModal from './SearchModal';
import { Container, PokemonsList, Button, OverlayBackground, PokeIcon  } from './styles';


import  FloatingButton  from './FloatingButton/index';
import { ItemButton } from './FloatingButton/Menu/styles';
import { useTheme } from 'styled-components';
import Block from '../../components/Block';
import Dots from '../../components/Dots';
import Pokeball from '../../components/Pokeball';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
export const MENU_ITEM_TRANSLATE_X = -width;
type MenuProps = {
  translateX: Animated.Value;
};

const items = [
  {
    name: 'Search',
    icon: 'search',
  },
];
const Home = () => {
  const navigation = useNavigation();
  const { handleToggleSearch } = useSearch();
  const translateX = useMemo(
    () => new Animated.Value(MENU_ITEM_TRANSLATE_X),
    [],
  );
  const onPress = useCallback(
    (name: string) => {
      if (name === 'Search') {
        handleToggleSearch();
      }
    },
    [handleToggleSearch],
  );

  const transform = {
    transform: [
    {
      translate: translateX.interpolate({
        inputRange: [MENU_ITEM_TRANSLATE_X, MENU_ITEM_TRANSLATE_X / 2, 0],
        outputRange: [MENU_ITEM_TRANSLATE_X, MENU_ITEM_TRANSLATE_X / 2.5, 0],
        extrapolate: 'clamp',
      }),
    },
  ],
  };
  
  const opacy = translateX.interpolate({
    inputRange: [MENU_ITEM_TRANSLATE_X / 3, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const { colors } = useTheme();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const opac = useMemo(() => new Animated.Value(0), []);
  

  const handleToggleMenu = useCallback(() => {
    Animated.parallel([
      Animated.timing(opac, {
        toValue: isMenuOpen ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: isMenuOpen ? MENU_ITEM_TRANSLATE_X : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen, opac, translateX]);

  const { isSearching } = useSearch();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [counter, setCounter] = useState(1);
  const [loadingInitalData, setLoadingInitialData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const opacity = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(50), []);

  const loadPokemons = useCallback(
    async (offsetValue = offset, shouldRefresh = false) => {
      try {
        setLoading(true);

        const response = await api.get<Pokemon[]>('pokemons', {
          params: {
            offset: offsetValue,
          },
        });

        const { data } = response;

        if (loadingInitalData) {
          setLoadingInitialData(false);
        }

        setPokemons(shouldRefresh ? data : [...pokemons, ...data]);
        setOffset(shouldRefresh ? API_OFFSET : API_OFFSET * counter);
        setCounter(shouldRefresh ? 2 : counter + 1);
        setLoading(false);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),

          Animated.timing(translateY, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (err) {
        Alert.alert(
          'Fail to get Pok??mons',
          'An error has ocurred when try to load the Pok??mons, please try again.',
        );
      }
    },
    [pokemons, loadingInitalData, offset, counter, opacity, translateY],
  );

  useEffect(() => {
    loadPokemons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ListFooterComponent = useMemo(
    () => (loading ? <Loading style={{ marginVertical: 8 }} /> : <></>),
    [loading],
  );

  const refreshList = useCallback(async () => {
    setRefreshing(true);

    await loadPokemons(0, true);

    setRefreshing(false);
  }, [loadPokemons]);

  const dotsStyle = {
    opacity: translateY.interpolate({
      inputRange: [-200, 0],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  };
  
  const fadeStyle = {
    opacity: translateY.interpolate({
      inputRange: [-300, -200],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };
   

  if (loadingInitalData) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </View>
    );
  }


  return (
    <Container>
      <Header>
        <Text variant="title" style={{ paddingTop: 43 }}>Pokedex</Text>
        <PokeIcon source={require('./asset/pokeball.png')} style={{ width: 90, height:90,}} tintColor='#e8e8e8'/>
      </Header>
      
      <PokemonsList
        data={pokemons}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
        onEndReached={() => loadPokemons()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={pokemon => String(pokemon.id)}
        numColumns={2}
        renderItem={({ item: pokemon, index }) => {
          return (
            <PokemonCard
              pokemon={pokemon}
              afterThirdCard={!!(index + 2)}
              rightCard={!!(index % 2)}
              opacity={opacity}
            />
          );
        }}
      />
        <FloatingButton/>
        
        {isSearching && <SearchModal />}
      
    </Container>
  );
};

export default Home;
