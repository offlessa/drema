import { Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { ProjectGoal } from './pages/ProjectGoal'
import { ProjectQuestionnaire } from './pages/ProjectQuestionnaire'
import { MatchResults } from './pages/MatchResults'
import { ProfessionalProfilePage } from './pages/ProfessionalProfilePage'
import { ProfessionalOnboarding } from './pages/ProfessionalOnboarding'
import { Conversations } from './pages/Conversations'
import { Conversation } from './pages/Conversation'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/comecar" element={<ProtectedRoute><ProjectGoal /></ProtectedRoute>} />
      <Route path="/questionario" element={<ProtectedRoute><ProjectQuestionnaire /></ProtectedRoute>} />
      <Route path="/resultados/:briefId" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
      <Route path="/profissionais/:id" element={<ProtectedRoute><ProfessionalProfilePage /></ProtectedRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/perfil-profissional" element={<ProtectedRoute><ProfessionalOnboarding /></ProtectedRoute>} />
      <Route path="/conversas" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
      <Route path="/conversas/:id" element={<ProtectedRoute><Conversation /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
