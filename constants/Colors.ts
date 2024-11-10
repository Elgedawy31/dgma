export const Colors = (theme: string) => ({
  // Main Colors
  black: '#000',
  white: '#fff',
  cancel: '#F22A2A',

  // Color Palette
  card: theme === 'light' ? '#FCFCFC' : '#202833',
  body: theme === 'light' ? '#B1B1B1' : '#515151',
  text: theme === 'light' ? '#161616' : '#FCFCFC',
  primary: theme === 'light' ? '#002D75' : '#0097FF', 
  secondary: theme === 'light' ? '#E8F5FF' : '#001D33',
  background: theme === 'light' ? '#F6F9FC' : '#010119',
  background2: theme === 'light' ? '#F6F9FC' : '#161616',  

  // Text Colors
  titleText: theme === 'light' ? '#161616' : '#FCFCFC',
  bodyText: theme === 'light' ? '#B1B1B1' : '#515151',
  
  // Secondary Colors
  secColor: theme === 'light' ? '#E8F5FF' : '#001D33',

  // Tabs Colors
  activeTab: theme === 'light' ? '#E8F5FF' : '#0097FF',
  inactiveTab: theme === 'light' ? '#B3B3B3' : '#B3B3B3',
  primaryTab: theme === 'light' ? '#002D75' : '#202833', 

  // StatusBar Colors
  statusBar: theme === 'light' ? '#fff' : '#202833', 

  // Message Colors : Sender | Receiver
  sender: theme === 'light' ? '#3FA9F5' : '#002D75',
  receiver: theme === 'light' ? '#E3E3E3' : '#515151',
});

// Task status colors remain constant regardless of theme
export const TaskColors = Object.freeze({
  review: '#2684FF',
  overdue: '#E54C4C',
  progress: '#FFC400',
  completed: '#57D9A3',
  pending: '#D9D9D9',     
  cancelled: '#03243C',
});