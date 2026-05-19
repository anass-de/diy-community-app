import { useEffect, useState } from 'react';
import { Project } from '../models/project';
import {
  deleteProject,
  getAllProjects,
  getProjectById,
  saveProject
} from '../repository/projectRepository';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);

    const data = await getAllProjects();

    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const save = async (project: Project) => {
    await saveProject(project);
    await loadProjects();
  };

  const remove = async (id: number) => {
    await deleteProject(id);
    await loadProjects();
  };

  return {
    projects,
    loading,
    save,
    remove,
    reload: loadProjects,
    getById: getProjectById
  };
};