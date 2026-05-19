export interface Project {
  id: number;

  name: string;
  description: string;

  image_url?: string;
  video_url?: string;

  instructions: string;

  difficulty: 'Einfach' | 'Mittel' | 'Schwer';

  materials: string;

  persons: number;

  tags?: string;

  rating?: number;

  rating_comment?: string;

  favorite?: boolean;

  created_at?: string;
}