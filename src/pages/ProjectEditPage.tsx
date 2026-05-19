import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Project } from '../models/project';
import { useProjects } from '../hooks/useProjects';
import { supabase } from '../lib/supabaseClient';

type RouteParams = {
  id: string;
};

const ProjectEditPage = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  const { getById, save } = useProjects();

  const [loading, setLoading] = useState(true);

  const [projectId, setProjectId] = useState<number>(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Einfach' | 'Mittel' | 'Schwer'>('Einfach');
  const [tags, setTags] = useState('');
  const [materials, setMaterials] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);
  };

  const uploadVideo = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('project-videos')
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage
      .from('project-videos')
      .getPublicUrl(fileName);

    setVideoUrl(data.publicUrl);
  };

  useEffect(() => {
    const loadProject = async () => {
      const foundProject = await getById(Number(id));

      if (foundProject) {
        setProjectId(foundProject.id);
        setName(foundProject.name);
        setDescription(foundProject.description);
        setDifficulty(foundProject.difficulty);
        setTags(foundProject.tags ?? '');
        setMaterials(foundProject.materials ?? '');
        setRating(foundProject.rating ?? 0);
        setRatingComment(foundProject.rating_comment ?? '');
        setFavorite(foundProject.favorite ?? false);
        setImageUrl(foundProject.image_url ?? '');
        setVideoUrl(foundProject.video_url ?? '');
      }

      setLoading(false);
    };

    loadProject();
  }, [id, getById]);

  const handleSave = async () => {
    const updatedProject: Project = {
      id: projectId,
      name,
      description,
      difficulty,
      tags,
      materials,
      rating,
      rating_comment: ratingComment,
      favorite,
      image_url: imageUrl,
      video_url: videoUrl,
      instructions: '',
      persons: 1
    };

    await save(updatedProject);

    history.replace('/projects');
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Projekt bearbeiten</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Projekt bearbeiten</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput value={name} onIonChange={(e) => setName(e.detail.value ?? '')} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Beschreibung</IonLabel>
          <IonTextarea value={description} onIonChange={(e) => setDescription(e.detail.value ?? '')} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Bild ändern</IonLabel>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadImage(file);
              }
            }}
          />
        </IonItem>

        {imageUrl && (
          <IonImg
            src={imageUrl}
            style={{
              maxHeight: '200px',
              marginTop: '10px',
              marginBottom: '10px'
            }}
          />
        )}

        <IonItem>
          <IonLabel position="stacked">Video ändern</IonLabel>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                uploadVideo(file);
              }
            }}
          />
        </IonItem>

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            style={{
              width: '100%',
              maxHeight: '260px',
              marginTop: '10px',
              marginBottom: '10px'
            }}
          />
        )}

        <IonItem>
          <IonLabel position="stacked">Schwierigkeit</IonLabel>
          <IonSelect value={difficulty} onIonChange={(e) => setDifficulty(e.detail.value)}>
            <IonSelectOption value="Einfach">Einfach</IonSelectOption>
            <IonSelectOption value="Mittel">Mittel</IonSelectOption>
            <IonSelectOption value="Schwer">Schwer</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Tags</IonLabel>
          <IonInput
            value={tags}
            placeholder="z.B. Holz, Möbel, Anfänger"
            onIonChange={(e) => setTags(e.detail.value ?? '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Materialien</IonLabel>
          <IonInput
            value={materials}
            placeholder="z.B. Holz, Schrauben, Metall"
            onIonChange={(e) => setMaterials(e.detail.value ?? '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Bewertung</IonLabel>
          <IonSelect value={rating} onIonChange={(e) => setRating(Number(e.detail.value))}>
            <IonSelectOption value={0}>Keine Bewertung</IonSelectOption>
            <IonSelectOption value={1}>⭐ 1 Stern</IonSelectOption>
            <IonSelectOption value={2}>⭐⭐ 2 Sterne</IonSelectOption>
            <IonSelectOption value={3}>⭐⭐⭐ 3 Sterne</IonSelectOption>
            <IonSelectOption value={4}>⭐⭐⭐⭐ 4 Sterne</IonSelectOption>
            <IonSelectOption value={5}>⭐⭐⭐⭐⭐ 5 Sterne</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Kommentar zur Bewertung</IonLabel>
          <IonTextarea
            value={ratingComment}
            placeholder="Optionaler Kommentar"
            onIonChange={(e) => setRatingComment(e.detail.value ?? '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel>Favorit</IonLabel>
          <IonCheckbox checked={favorite} onIonChange={(e) => setFavorite(e.detail.checked)} />
        </IonItem>

        <IonButton expand="block" onClick={handleSave}>
          Änderungen speichern
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProjectEditPage;