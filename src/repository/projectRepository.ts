import { Project } from '../models/project';
import { supabase } from '../lib/supabaseClient';

export const getAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
};

export const getProjectById = async (
  id: number
): Promise<Project | undefined> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return undefined;
  }

  return data;
};

export const saveProject = async (project: Project) => {
  const { error } = await supabase
    .from('projects')
    .upsert(project);

  if (error) {
    console.error(error);
  }
};

export const deleteProject = async (id: number) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
  }
};