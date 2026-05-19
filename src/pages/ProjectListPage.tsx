import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';

import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../models/project';

const ProjectListPage = () => {
  const { projects, loading, reload, remove } = useProjects();
  const history = useHistory();

  const [searchText, setSearchText] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useIonViewWillEnter(() => {
    reload();
  });

  const filteredProjects = useMemo(() => {
    const query = searchText.toLowerCase().trim();

    return projects.filter(project => {
      const matchesSearch =
        !query ||
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tags?.toLowerCase().includes(query) ||
        project.materials?.toLowerCase().includes(query) ||
        project.rating_comment?.toLowerCase().includes(query);

      const matchesFavorite =
        !showFavoritesOnly || project.favorite === true;

      return matchesSearch && matchesFavorite;
    });
  }, [projects, searchText, showFavoritesOnly]);

  const renderStars = (rating?: number) => {
    if (!rating || rating <= 0) {
      return 'Keine Bewertung';
    }

    return '⭐'.repeat(rating);
  };

  const buildShareText = (project: Project) => {
    return `
DIY Projekt: ${project.name}

Beschreibung:
${project.description}

Schwierigkeit:
${project.difficulty}

Materialien:
${project.materials || 'Keine Materialien angegeben'}

Tags:
${project.tags || 'Keine Tags angegeben'}

Bewertung:
${renderStars(project.rating)}

Kommentar:
${project.rating_comment || 'Kein Kommentar'}

Bild:
${project.image_url || 'Kein Bild'}

Video:
${project.video_url || 'Kein Video'}
    `.trim();
  };

  const handleShare = async (project: Project) => {
    const shareText = buildShareText(project);

    if (navigator.share) {
      await navigator.share({
        title: project.name,
        text: shareText
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Projekttext wurde kopiert.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>DIY Projekte</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/profile')}>
              Profil
            </IonButton>

            <IonButton onClick={() => history.push('/projects/newest')}>
              Neueste
            </IonButton>

            <IonButton onClick={() => history.push('/projects/popular')}>
              Beliebte
            </IonButton>

            <IonButton onClick={() => history.push('/projects/new')}>
              Hinzufügen
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchText}
          placeholder="Suche nach Name, Beschreibung, Tags, Materialien oder Kommentar"
          onIonChange={(e) => setSearchText(e.detail.value ?? '')}
        />

        <IonButton
          expand="block"
          fill={showFavoritesOnly ? 'solid' : 'outline'}
          color="danger"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          {showFavoritesOnly ? 'Alle Projekte anzeigen' : 'Nur Favoriten anzeigen'}
        </IonButton>

        {loading && <IonSpinner />}

        <IonList>
          {filteredProjects.map(project => (
            <IonItem
              key={project.id}
              button
              onClick={() => history.push(`/projects/edit/${project.id}`)}
            >
              <IonLabel>
                {project.image_url && (
                  <IonImg
                    src={project.image_url}
                    style={{
                      maxWidth: '160px',
                      maxHeight: '120px',
                      marginBottom: '10px'
                    }}
                  />
                )}

                {project.video_url && (
                  <video
                    src={project.video_url}
                    controls
                    style={{
                      width: '220px',
                      maxHeight: '140px',
                      display: 'block',
                      marginBottom: '10px'
                    }}
                  />
                )}

                <h2>
                  {project.favorite ? '❤️ ' : ''}
                  {project.name}
                </h2>

                <p>{project.description}</p>
                <p>{project.difficulty}</p>

                {project.tags && <p>Tags: {project.tags}</p>}
                {project.materials && <p>Materialien: {project.materials}</p>}

                <p>Bewertung: {renderStars(project.rating)}</p>

                {project.rating_comment && (
                  <p>Kommentar: {project.rating_comment}</p>
                )}

                {project.favorite && (
                  <p>❤️ Favorit</p>
                )}
              </IonLabel>

              <IonButtons slot="end">
                <IonButton
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleShare(project);
                  }}
                >
                  Teilen
                </IonButton>

                <IonButton
                  color="danger"
                  onClick={(event) => {
                    event.stopPropagation();
                    remove(project.id);
                  }}
                >
                  Löschen
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ProjectListPage;