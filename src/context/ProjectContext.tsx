import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp,
  DocumentData,
  limit,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';

interface Project extends DocumentData {
  id: string;
  name: string;
  description: string;
  client?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Timestamp;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => void;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fonction pour forcer le rafraîchissement des projets
  const refreshProjects = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Fonction pour supprimer un projet
  const deleteProject = useCallback(async (id: string) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await deleteDoc(projectRef);
      refreshProjects();
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      return Promise.reject(error);
    }
  }, [refreshProjects]);

  // Fonction pour mettre à jour un projet
  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, data);
      refreshProjects();
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      return Promise.reject(error);
    }
  }, [refreshProjects]);

  useEffect(() => {
    try {
      setLoading(true);
      
      // Créer une requête pour obtenir les projets triés par date de création
      // Limiter à 50 projets pour améliorer les performances
      const projectsQuery = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      // S'abonner aux mises à jour en temps réel
      const unsubscribe = onSnapshot(
        projectsQuery,
        (snapshot) => {
          const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Project[];
          
          setProjects(projectsData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Erreur lors du chargement des projets:', error);
          setError('Erreur lors du chargement des projets');
          setLoading(false);
        }
      );

      // Nettoyer l'abonnement lors du démontage
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du contexte:', error);
      setError('Erreur lors de l\'initialisation');
      setLoading(false);
    }
  }, [refreshTrigger]); // Ajouter refreshTrigger comme dépendance

  const value = {
    projects,
    loading,
    error,
    refreshProjects,
    deleteProject,
    updateProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
