import { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import Sidebar from './Sidebar';
import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';

const Projects = () => {
  const { projects, loading, refreshProjects, deleteProject } = useProjects();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddProject = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProjectId(null);
  };

  const handleProjectAdded = () => {
    refreshProjects();
    setIsAddModalOpen(false);
  };

  const handleEditProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsEditModalOpen(true);
  };

  const handleProjectUpdated = () => {
    refreshProjects();
    setIsEditModalOpen(false);
    setSelectedProjectId(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        setIsDeleting(projectId);
        await deleteProject(projectId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression du projet');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pl-52">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-700 text-3xl font-medium">Projets</h3>
              <button 
                onClick={handleAddProject}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouveau Projet
              </button>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        {project.name || 'Sans nom'}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {project.description || 'Aucune description'}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Client:</span> {project.client || 'Non spécifié'}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Date:</span>{' '}
                          {project.createdAt?.seconds
                            ? new Date(project.createdAt.seconds * 1000).toLocaleDateString()
                            : 'Non définie'}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                  <div className="mt-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEditProject(project.id)}
                      className="text-gray-600 hover:text-violet-600 transition-colors"
                      aria-label="Modifier le projet"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={isDeleting === project.id}
                      className={`text-gray-600 hover:text-red-600 transition-colors ${isDeleting === project.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label="Supprimer le projet"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500">Aucun projet trouvé</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isAddModalOpen && (
        <AddProjectModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleProjectAdded}
        />
      )}

      {isEditModalOpen && selectedProjectId && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleProjectUpdated}
          projectId={selectedProjectId}
        />
      )}
    </>
  );
};

export default Projects;
