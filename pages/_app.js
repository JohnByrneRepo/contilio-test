// pages/_app.js
import { Provider } from 'next-auth/client'
import { wrapper } from '../redux/store'
import './style.css'

function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default wrapper.withRedux(App)
