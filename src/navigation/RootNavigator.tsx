import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '@/store/store'
import AuthStackNavigator from './AuthStackNavigator'
// TODO: crea AppStackNavigator después con las pantallas principales
// import AppStackNavigator from './AppStackNavigator';

const RootNavigator = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  return user ? <AuthStackNavigator /> : <AuthStackNavigator />
}

export default RootNavigator
