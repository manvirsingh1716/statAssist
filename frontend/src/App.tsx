import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from './components/DashboardLayout'
import { MarketingLayout } from './components/MarketingLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'
import { DataProcessingPage } from './pages/app/DataProcessingPage'
import { DataUploadPage } from './pages/app/DataUploadPage'
import { HomePage } from './pages/app/HomePage'
import { ModelTrainingPage } from './pages/app/ModelTrainingPage'
import { ProjectHistoryPage } from './pages/app/ProjectHistoryPage'
import { ResultsPage } from './pages/app/ResultsPage'
import { SettingsPage } from './pages/app/SettingsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { CommunityPage } from './pages/marketing/CommunityPage'
import { FeaturesPage } from './pages/marketing/FeaturesPage'
import { LandingPage } from './pages/marketing/LandingPage'
import { PricingPage } from './pages/marketing/PricingPage'
import { SecurityPage } from './pages/marketing/SecurityPage'

function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route element={<LandingPage />} path="/" />
        <Route element={<FeaturesPage />} path="/features" />
        <Route element={<PricingPage />} path="/pricing" />
        <Route element={<CommunityPage />} path="/community" />
        <Route element={<SecurityPage />} path="/security" />
      </Route>

      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
        path="/app"
      >
        <Route element={<HomePage />} index />
        <Route element={<DataUploadPage />} path="data-upload" />
        <Route element={<DataProcessingPage />} path="data-processing" />
        <Route element={<ModelTrainingPage />} path="model-training" />
        <Route element={<ResultsPage />} path="results" />
        <Route element={<ProjectHistoryPage />} path="projects" />
        <Route element={<SettingsPage />} path="settings" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default App
