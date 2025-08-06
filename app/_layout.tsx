import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main Screens */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="games" 
          options={{ headerShown: false }} 
        />
        
        {/* Phonics Screens */}
        <Stack.Screen 
          name="phonics_page/levels"
          options={{ 
            title: 'Phonics Levels',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="phonics_page/sand-trace"
          options={{
            title: 'Trace in Sand',
            headerShown: true
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}