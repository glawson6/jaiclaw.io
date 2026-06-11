import { RouterProvider } from 'react-router-dom'
import router from './routes.jsx'
import './App.css'
import './themes/styles.css'

function App() {
  return <RouterProvider router={router} />
}

export default App
