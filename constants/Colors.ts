export const Colors = (theme: string) => ({
  // Main Colors
  black: '#000',
  white: '#fff',
  cancel: '#F22A2A',

  // Color Palette
  card: theme === 'light' ? '#FCFCFC' : '#1E1E1E',
  body: theme === 'light' ? '#444' : '#E0E0E0',
  text: theme === 'light' ? '#0F1010' : '#FFFFFF',
  primary: theme === 'light' ? '#002d75' : '#4B9BFF',
  secondary: theme === 'light' ? '#E8F5FF' : '#1A365D',
  background: theme === 'light' ? '#F6F9FC' : '#121212',

  // Tabs Colors
  activeTab: theme === 'light' ? '#E8F5FF' : '#1A365D',
  inactiveTab: theme === 'light' ? '#B3B3B3' : '#4A5568',

  // StatusBar Colors
  statusBar: theme === 'light' ? '#fff' : '#1A365D', 

  // Message Colors : Sender | Receiver
  sender: theme === 'light' ? '#3FA9F5' : '#4B9BFF',
  receiver: theme === 'light' ? '#E3E3E3' : '#2D3748',
});
export const TaskColors = Object.freeze({
  review: '#2684FF',
  overdue: '#E54C4C',
  progress: '#FFC400',
  completed: '#57D9A3',
  pending: '#D9D9D9',
  cancelled: '#03243C',
})

