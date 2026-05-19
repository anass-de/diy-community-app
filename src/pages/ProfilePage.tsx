import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { supabase } from '../lib/supabaseClient';

const ProfilePage = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        history.replace('/login');
        return;
      }

      const user = authData.user;

      setUserId(user.id);
      setEmail(user.email ?? '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username ?? '');
        setFullName(profile.full_name ?? '');
        setEmail(profile.email ?? user.email ?? '');
      }

      setLoading(false);
    };

    loadProfile();
  }, [history]);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        username,
        full_name: fullName
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Profil gespeichert');
    history.replace('/projects');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    history.replace('/login');
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profil</IonTitle>
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
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            value={email}
            readonly
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Benutzername</IonLabel>
          <IonInput
            value={username}
            placeholder="z.B. anass"
            onIonChange={(e) => setUsername(e.detail.value ?? '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Vollständiger Name</IonLabel>
          <IonInput
            value={fullName}
            placeholder="z.B. Anass Essouliman"
            onIonChange={(e) => setFullName(e.detail.value ?? '')}
          />
        </IonItem>

        <IonButton
          expand="block"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Speichert...' : 'Profil speichern'}
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          onClick={() => history.push('/projects')}
        >
          Zurück zu Projekten
        </IonButton>

        <IonButton
          expand="block"
          color="danger"
          onClick={handleLogout}
        >
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;