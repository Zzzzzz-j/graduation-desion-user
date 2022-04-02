import './App.css';
import Router from './router';
import { Provider } from 'react-redux';
import store from './redux/store';
import ScrollToTop from './router/ScrollToTop';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ScrollToTop>
          <Router />
        </ScrollToTop>
      </div>
    </Provider>

  );
}

export default App;
