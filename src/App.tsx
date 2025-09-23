import { useFormBuilderStore } from './stores/useFormBuilderStore';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Forms from './pages/Forms';
import Responses from './pages/Responses';
import Settings from './pages/Settings';
import FormBuilder from './pages/FormBuilder';
import FillForm from './pages/FillForm';
import Navigation from './components/Common/Navigation';

function App() {
  const { currentPage, isAuthenticated, setCurrentPage } = useFormBuilderStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Debug logging for page state
  console.log('Current page:', currentPage);

  // Function to render the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'forms':
        return <Forms />;
      case 'responses':
        return <Responses />;
      case 'settings':
        return <Settings />;
      case 'builder':
        return <FormBuilder />;
      case 'fill-form':
        return <FillForm />;
      default:
        // Fallback to home page for any unexpected page
        console.warn('Unknown page:', currentPage, 'redirecting to home');
        setCurrentPage('home');
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;