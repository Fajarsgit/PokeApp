import React from 'react';
import { Route } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useTheme } from 'styled-components';

import Home from '../pages/Home';
import Pokemon, { RouteParams } from '../pages/Pokemon';

const Stack = createSharedElementStackNavigator();

const Routes = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        headerTransparent: true,
        cardStyle: {
          backgroundColor: "transparent",
        },
        headerStyle: {
          elevation: 0,
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Pokemon"
        component={Pokemon}
        options={{
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
        sharedElementsConfig={(route: Route<string, object | undefined>) => {
          const { pokemon, from } = route.params as RouteParams;

          if (from === 'card') {
            const sharedArray = [
              {
                id: `pokemon.${pokemon.id}.image`,
              },
              {
                id: `pokemon.${pokemon.id}.name`,
              },
            ];

            pokemon.types.forEach(type => {
              return sharedArray.push({
                id: `pokemon.${pokemon.id}.type.${type.url}`,
              });
            });

            return sharedArray;
          }

          return undefined;
        }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
