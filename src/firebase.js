import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCrNTPiXoXlWiP28EQ5qw5-J330VmlIOh4",
    authDomain: "maps-46cef.firebaseapp.com",
    projectId: "maps-46cef",
    storageBucket: "maps-46cef.appspot.com",
    messagingSenderId: "447628453054",
    appId: "1:447628453054:web:39a03528cdea893d3b2aef",
    measurementId: "G-0X8KNJTMXP",
    databaseURL: "https://maps-46cef-default-rtdb.firebaseio.com",
  };

  export const app = initializeApp(firebaseConfig);