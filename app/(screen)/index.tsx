import React, { useState, useEffect } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar as RNStatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import OnboardingScreen from './OnboardingScreen';
import AlertsList from './AlertsList';
import AlertDetail from './AlertDetail';
import { mockAlerts } from '../../data/mockData';
import AlertType from '../type';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'alerts' | 'detail'>('onboarding');
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts as AlertType[]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setCurrentScreen('alerts');
        }
      } catch (e) {
        console.error('Failed to check login', e);
      }
    };
    checkLoggedIn();
  }, []);

  const navigateToAlerts = () => setCurrentScreen('alerts');

  const navigateToDetail = (alert: AlertType) => {
    setSelectedAlert(alert);
    setCurrentScreen('detail');
  };

  const navigateBack = () => {
    if (currentScreen === 'detail') {
      setCurrentScreen('alerts');
      setSelectedAlert(null);
    } else if (currentScreen === 'alerts') {
      setCurrentScreen('onboarding');
    }
  };

  const updateAlert = (alertId: number, updates: Partial<AlertType>) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, ...updates } : alert
      )
    );

    if (selectedAlert?.id === alertId) {
      setSelectedAlert(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <LinearGradient colors={['#667eea', '#764ba2']} style={StyleSheet.absoluteFill}>
            <SafeAreaView style={styles.safeAreaTransparent}>
              <OnboardingScreen onLogin={navigateToAlerts} />
              <StatusBar style="light" translucent backgroundColor="transparent" />
            </SafeAreaView>
          </LinearGradient>
        );
      case 'alerts':
        return (
          <View style={styles.root}>
            <View style={styles.topInset} />
            <SafeAreaView style={styles.safeContent}>
              <StatusBar translucent backgroundColor="transparent" style="dark" />
              <AlertsList
                alerts={alerts}
                onAlertClick={navigateToDetail}
                onBack={navigateBack}
              />
            </SafeAreaView>
            <View style={styles.bottomInset} />
          </View>
        );
      case 'detail':
        return (
          <View style={styles.root}>
            <View style={styles.topInset} />
            <SafeAreaView style={styles.safeContent}>
              <StatusBar translucent backgroundColor="transparent" style="dark" />
              <AlertDetail
                alert={selectedAlert!}
                onBack={navigateBack}
                onUpdateAlert={updateAlert}
              />
            </SafeAreaView>
            <View style={styles.bottomInset} />
          </View>
        );
      default:
        return null;
    }
  };

  return renderScreen();
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topInset: {
    height: Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 44,
    backgroundColor: '#ffffff',
  },
  bottomInset: {
    height: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: '#f8fafc',
  },
  safeContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaTransparent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default App;