import AppRouter from "./routes/AppRouter"
import toast, { Toaster } from 'react-hot-toast'
// import { UserProvider } from "./context/userContext"
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {

  return (

    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </Provider>
  )
}

export default App
