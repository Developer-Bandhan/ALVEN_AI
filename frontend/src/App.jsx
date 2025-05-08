import AppRouter from "./routes/AppRouter"
import toast, { Toaster } from 'react-hot-toast'
import { UserProvider } from "./context/userContext"

function App() {

  return (

    <UserProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </UserProvider>
  )
}

export default App
