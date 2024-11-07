const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = (theme: string) => ({
  // Main Colors
  black: '#000',
  white: '#fff',
  cancel: '#F22A2A',

  // Color Palette
  card: theme === 'light' ? '#FCFCFC' : '#FCFCFC',
  body: theme === 'light' ? '#444' : '#444',
  text: theme === 'light' ? '#0F1010' : '#0F1010',
  primary: theme === 'light' ? '#002d75' : '#002d75',
  secondary: theme === 'light' ? '#E8F5FF' : '#E8F5FF',
  background: theme === 'light' ? '#F6F9FC' : '#F6F9FC',

  // Tabs Colors
  activeTab: theme === 'light' ? '#E8F5FF' : '#E8F5FF',
  inactiveTab: theme === 'light' ? '#B3B3B3' : '#B3B3B3',

  // StatusBar Colors
  statusBar: theme === 'light' ? '#fff' : '#002d75',

  //Message Colors : Sender | Receiver
  sender: theme === 'light' ? '#3FA9F5' : '#002d75',
  receiver: theme === 'light' ? '#E3E3E3' : '#002d75',

});


export const TaskColors = Object.freeze({
  review: '#2684FF',
  overdue: '#E54C4C',
  progress: '#FFC400',
  completed: '#57D9A3',
  pending: '#D9D9D9',
  cancelled: '#03243C',
})

