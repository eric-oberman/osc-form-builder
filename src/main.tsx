import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import App from './App'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import './styles/globals.css'

// Enable MSW in development with error handling
async function enableMocking() {
  if (import.meta.env.DEV) {
    try {
      console.log('🔄 MSW: Starting Mock Service Worker...')
      const { worker } = await import('./mocks/browser')
      const result = await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      })
      console.log('✅ MSW: Mock Service Worker started successfully')
      return result
    } catch (error) {
      console.error('❌ MSW: Failed to start Mock Service Worker:', error)
      console.warn('⚠️ MSW: Continuing without mocking - API calls may fail')
      throw error
    }
  }
  console.log('ℹ️ MSW: Skipped in production mode')
}

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    }
  }
})

// Initialize application with comprehensive error handling
console.log('🚀 OSC Form Builder: Starting application...')
console.log('Environment:', import.meta.env.DEV ? 'Development' : 'Production')
console.log('URL:', window.location.href)

const renderApp = () => {
  console.log('🎨 Rendering React application...')
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    console.error('❌ Fatal: Root element not found in DOM')
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: system-ui; text-align: center;">
        <h1 style="color: #dc2626;">Application Error</h1>
        <p>The root element was not found. Please ensure the HTML contains: &lt;div id="root"&gt;&lt;/div&gt;</p>
      </div>
    `
    return
  }

  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'gov-toast',
                  style: {
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)'
                  }
                }}
              />
            </BrowserRouter>
          </QueryClientProvider>
        </ErrorBoundary>
      </React.StrictMode>
    )
    console.log('✅ React application rendered successfully')
  } catch (error) {
    console.error('❌ Failed to render React application:', error)
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui; text-align: center; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px;">
        <h1 style="color: #dc2626;">React Render Error</h1>
        <p>Failed to render the application. Check console for details.</p>
        <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; text-align: left; font-size: 12px;">${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `
  }
}

// Initialize MSW with timeout and fallback
const initializeApp = async () => {
  try {
    console.log('⏱️ Setting MSW timeout (5 seconds)...')

    // Create a promise that resolves/rejects with timeout
    const mockingPromise = new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MSW initialization timeout after 5 seconds'))
      }, 5000)

      try {
        await enableMocking()
        clearTimeout(timeout)
        resolve(undefined)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    await mockingPromise
    console.log('✅ MSW initialization completed')
  } catch (error) {
    console.warn('⚠️ MSW initialization failed, continuing without mocking:', error)
    console.warn('💡 This may cause API calls to fail, but the UI should still load')
  }

  // Always render the app regardless of MSW status
  renderApp()
}

// Start the application
initializeApp().catch((error) => {
  console.error('💥 Critical application initialization failure:', error)
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui; text-align: center; background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; margin: 20px;">
        <h1 style="color: #dc2626;">Application Initialization Failed</h1>
        <p>The application failed to start. Please check the console for detailed error information.</p>
        <div style="margin: 20px 0;">
          <h3>Debugging Steps:</h3>
          <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
            <li>Open browser developer tools (F12)</li>
            <li>Check the Console tab for error messages</li>
            <li>Clear browser cache and reload (Ctrl+Shift+R)</li>
            <li>Try in an incognito/private window</li>
          </ol>
        </div>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `
  }
})

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}