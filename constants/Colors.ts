export const Colors = (theme: string) => ({
  // Main Colors
  black: '#000',
  white: '#fff',
  cancel: '#F22A2A',

  // Color Palette
  bottomSheet: theme === 'light' ? "#fff" : "#202833",
  icons: theme === 'light' ? "#002D75" : "#fff",
  splash: theme === 'light' ? "#002D75" : "#202833",
  welcomeLogo: theme === 'light' ? "#fff" : "#010119",
  dots: theme === 'light' ? "#002D75" : "#0097FF",
  card: theme === 'light' ? '#FCFCFC' : '#202833',
  body: theme === 'light' ? '#B1B1B1' : '#B6B6B6',
  text: theme === 'light' ? '#161616' : '#FCFCFC',
  textVariant: theme === 'light' ? '#002D75' : '#FCFCFC',
  primary: theme === 'light' ? '#002D75' : '#0097FF',
  secondary: theme === 'light' ? '#E8F5FF' : '#001D33',
  background: theme === 'light' ? '#F6F9FC' : '#010119',

  //Auth Colors
  authTop: theme === 'light' ? '#002D75' : '#202833',
  authBottom: theme === 'light' ? '#fff' : '#010119',

  //OnBoarding Colors
  onboarding: theme === 'light' ? '#fff' : '#010119',
  onboardingTop: theme === 'light' ? '#fff' : '#010119',
  onboardingBottom: theme === 'light' ? '#002D75' : '#202833',

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
  statusBarIcons: theme === 'light' ? '#002D75' : '#202833',
  statusBarBG: theme === 'light' ? '#fff' : '#202833',

  // Message Colors : Sender | Receiver
  sender: theme === 'light' ? '#3FA9F5' : '#002D75',
  receiver: theme === 'light' ? '#E3E3E3' : '#515151',

  // Notification Colors
  notifyMessage: theme === 'light' ? '#002D75' : '#202833',
  notifyMention: theme === 'light' ? '#B1B1B1' : '#0097FF',
  notifyReaction: theme === 'light' ? '#FF9800' : '#FF9800',

  // shadow colors 
  shadow: theme === 'light' ? '#000' : '#fff',

  //Button Colors
  btnPrimary: theme === 'light' ? '#002D75' : '#0097FF',
});

export const TaskColors = Object.freeze({
  review: '#2684FF',
  overdue: '#E54C4C',
  progress: '#FFC400',
  completed: '#57D9A3',
  pending:'#D9D9D9',
  cancelled: '#03243C',
});

export const TaskColors2 = Object.freeze({
  'In Progress': '#FFC400',
  'Pending':'#D9D9D9', 
  'In Review': '#2684FF',
  'Completed': '#57D9A3',
  'Overdue': '#E54C4C',
  'To Do': '#D9D9D9',
  'Cancelled': '#03243C'
});
