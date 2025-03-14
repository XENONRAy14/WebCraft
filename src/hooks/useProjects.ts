import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Project } from '../types/project';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedProjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      })) as Project[];

      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des projets');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getStats = () => {
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      pendingProjects: projects.filter(p => p.status === 'pending').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalRevenue: projects.reduce((acc, curr) => {
        const budget = curr.budget ? parseFloat(curr.budget.replace(/[^0-9.-]+/g, '')) : 0;
        return acc + budget;
      }, 0)
    };
    return stats;
  };

  return {
    projects,
    loading,
    error,
    refreshProjects: fetchProjects,
    stats: getStats()
  };
};
