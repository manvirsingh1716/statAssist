import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from './components/DashboardLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'
import { DataProcessingPage } from './pages/DataProcessingPage'
import { DataUploadPage } from './pages/DataUploadPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ModelTrainingPage } from './pages/ModelTrainingPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResultsPage } from './pages/ResultsPage'

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
        path="/"
      >
        <Route element={<HomePage />} index />
        <Route element={<DataUploadPage />} path="data-upload" />
        <Route element={<DataProcessingPage />} path="data-processing" />
        <Route element={<ModelTrainingPage />} path="model-training" />
        <Route element={<ResultsPage />} path="results" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default App
