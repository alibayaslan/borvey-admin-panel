import React from "react";
import ReactDOM from "react-dom"; 
import App from "./App";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { SnackbarProvider } from "notistack";

// const root = ReactDOM.createRoot(document.getElementById("root")); 

export const store = configureStore();

export const state = store.getState();

// root.render yerine ReactDOM.render kullanıldı
ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById("root") 
);
