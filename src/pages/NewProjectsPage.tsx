import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';

import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useProjects } from '../hooks/useProjects';

const NewProjectsPage = () => {
  const { projects, loading, reload } = useProjects();

  const history = useHistory();

  useIonViewWillEnter(() => {
    reload();
  });

  const newestProjects = useMemo(() => {
    return [...projects].sort((a, b) => b.id - a.id);
  }, [projects]);

  const renderStars = (rating?: number) => {
    if (!rating || rating <= 0) {
      return 'Keine Bewertung';
    }

    return '⭐'.repeat(rating);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Neue Projekte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonSpinner />}

        <IonList>
          {newestProjects.map(project => (
            <IonItem
              key={project.id}
              button
              onClick={() => history.push(`/projects/edit/${project.id}`)}
            >
              <IonLabel>
                <h2>
                  {project.favorite ? '❤️ ' : ''}
                  {project.name}
                </h2>

                <p>{project.description}</p>

                <p>{project.difficulty}</p>

                {project.tags && (
                  <p>Tags: {project.tags}</p>
                )}

                {project.materials && (
                  <p>Materialien: {project.materials}</p>
                )}

                <p>
                  Bewertung: {renderStars(project.rating)}
                </p>

                {project.rating_comment && (
                  <p>
                    Kommentar: {project.rating_comment}
                  </p>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default NewProjectsPage;