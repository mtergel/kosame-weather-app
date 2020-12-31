import React from "react";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import Card from "./components/Card";
// theme
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const theme = extendTheme({ config });

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <ChakraProvider theme={theme}>
      <Card />
    </ChakraProvider>
  );
};
export default App;
