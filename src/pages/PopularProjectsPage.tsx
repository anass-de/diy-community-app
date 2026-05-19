import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';

import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useProjects } from '../hooks/useProjects';

const PopularProjectsPage = () => {
  const { projects, loading, reload } = useProjects();
  const history = useHistory();

  const [timeWindow, setTimeWindow] = useState<'week' | 'month' | 'year' | 'all'>('all');

  useIonViewWillEnter(() => {
    reload();
  });

  const getDateLimit = () => {
    const now = new Date();

    if (timeWindow === 'week') {
      now.setDate(now.getDate() - 7);
      return now;
    }

    if (timeWindow === 'month') {
      now.setMonth(now.getMonth() - 1);
      return now;
    }

    if (timeWindow === 'year') {
      now.setFullYear(now.getFullYear() - 1);
      return now;
    }

    return null;
  };

  const popularProjects = useMemo(() => {
    const limit = getDateLimit();

    return [...projects]
      .filter(project => {
        if (!limit) {
          return true;
        }

        const createdAt = project.created_at
          ? new Date(project.created_at)
          : new Date(project.id);

        return createdAt >= limit;
      })
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [projects, timeWindow]);

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
          <IonTitle>Beliebteste Projekte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Zeitfenster</IonLabel>

          <IonSelect
            value={timeWindow}
            onIonChange={(e) => setTimeWindow(e.detail.value)}
          >
            <IonSelectOption value="week">Letzte Woche</IonSelectOption>
            <IonSelectOption value="month">Letzter Monat</IonSelectOption>
            <IonSelectOption value="year">Letztes Jahr</IonSelectOption>
            <IonSelectOption value="all">Alle Zeit</IonSelectOption>
          </IonSelect>
        </IonItem>

        {loading && <IonSpinner />}

        <IonList>
          {popularProjects.map(project => (
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

                {project.tags && <p>Tags: {project.tags}</p>}
                {project.materials && <p>Materialien: {project.materials}</p>}

                <p>Bewertung: {renderStars(project.rating)}</p>

                {project.rating_comment && (
                  <p>Kommentar: {project.rating_comment}</p>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PopularProjectsPage;