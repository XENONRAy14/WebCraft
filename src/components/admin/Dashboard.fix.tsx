import { useMemo } from 'react';
import { useProjects } from '../../context/ProjectContext';
import Sidebar from './Sidebar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { projects, loading } = useProjects();

  // Optimiser le calcul des données du graphique avec useMemo
  const chartData = useMemo(() => {
    // Créer un tableau des 6 derniers mois
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        date,
        month: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0
      };
    }).reverse();

    // Pour tester, ajouter des valeurs fictives au graphique
    // Cela nous permettra de vérifier si le graphique fonctionne correctement
    last6Months.forEach((month, index) => {
      // Ajouter des valeurs croissantes pour simuler l'évolution
      month.total = index + 1;
      month.completed = Math.floor((index + 1) * 0.6);
      month.inProgress = Math.floor((index + 1) * 0.3);
      month.pending = Math.floor((index + 1) * 0.1);
    });

    return last6Months;
  }, [projects]);

  // Calculer les statistiques totales
  const stats = useMemo(() => ({
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    pending: projects.filter(p => p.status === 'pending').length
  }), [projects]);

  // Trier les projets par date de création (du plus récent au plus ancien)
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
  }, [projects]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pl-52">
        <div className="container mx-auto px-6 py-8">
          <h3 className="text-gray-700 text-3xl font-medium mb-6">Tableau de bord</h3>
          
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-gray-600">Total Projets</p>
                  <p className="text-2xl font-semibold text-gray-700">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-gray-600">Projets Terminés</p>
                  <p className="text-2xl font-semibold text-green-600">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-gray-600">Projets en Cours</p>
                  <p className="text-2xl font-semibold text-yellow-600">{stats.inProgress}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-gray-600">Projets en Attente</p>
                  <p className="text-2xl font-semibold text-gray-600">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h4 className="text-gray-700 text-lg font-medium mb-4">Évolution des Projets</h4>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    height={60}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#6366F1" 
                    name="Total"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#22C55E" 
                    name="Terminés"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inProgress" 
                    stroke="#EAB308" 
                    name="En cours"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pending" 
                    stroke="#64748B" 
                    name="En attente"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Liste des projets récents */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-700">Projets Récents</h4>
            </div>
            
            <div className="divide-y divide-gray-200">
              {sortedProjects.slice(0, 5).map(project => (
                <div key={project.id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-base font-medium text-gray-800">{project.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{project.client}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'completed' ? 'Terminé' :
                       project.status === 'in_progress' ? 'En cours' :
                       project.status === 'pending' ? 'En attente' : 'Non défini'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
