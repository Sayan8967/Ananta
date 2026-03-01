import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../lib/stores/auth-store';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { colors, fontSize } from '../lib/theme';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';

// Patient Screens
import { DashboardScreen } from '../screens/patient/DashboardScreen';
import { RecordsScreen } from '../screens/patient/RecordsScreen';
import { TimelineScreen } from '../screens/patient/TimelineScreen';
import { PrescriptionsScreen } from '../screens/patient/PrescriptionsScreen';
import { EmergencyCardScreen } from '../screens/patient/EmergencyCardScreen';
import { ProfileScreen } from '../screens/patient/ProfileScreen';

// Emergency Screens
import { EmergencyAccessScreen } from '../screens/emergency/EmergencyAccessScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EmergencyAccess: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Records: { tab?: string };
  Timeline: undefined;
  Prescriptions: undefined;
  Profile: undefined;
};

export type PatientStackParamList = {
  MainTabs: undefined;
  EmergencyCard: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const PatientStack = createNativeStackNavigator<PatientStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.neutral[0],
          borderTopColor: colors.neutral[100],
          paddingTop: 4,
          height: 85,
          paddingBottom: 24,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Records"
        component={RecordsScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} />,
        }}
      />
      <Tab.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          tabBarLabel: 'Timeline',
          tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Prescriptions"
        component={PrescriptionsScreen}
        options={{
          tabBarLabel: 'Rx Scan',
          tabBarIcon: ({ color }) => <TabIcon emoji="📸" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function PatientNavigator() {
  return (
    <PatientStack.Navigator screenOptions={{ headerShown: false }}>
      <PatientStack.Screen name="MainTabs" component={MainTabs} />
      <PatientStack.Screen
        name="EmergencyCard"
        component={EmergencyCardScreen}
        options={{
          headerShown: true,
          headerTitle: 'Emergency Card',
          headerTintColor: colors.emergency[600],
        }}
      />
    </PatientStack.Navigator>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const isActive = color === colors.primary[600];
  return (
    <Text style={{ fontSize: 20, opacity: isActive ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <LoadingScreen message="Initializing Ananta..." />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={PatientNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={LoginScreen} />
        )}
        <RootStack.Screen
          name="EmergencyAccess"
          component={EmergencyAccessScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
