import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { supabase } from '../lib/supabaseClient';

const LoginPage = () => {
  const history = useHistory();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        username,
        full_name: fullName
      });
    }

    alert('Registrierung erfolgreich. Du kannst dich jetzt einloggen.');
    setActiveTab('login');
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    history.replace('/projects');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>DIY Projekte App</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSegment
          value={activeTab}
          onIonChange={(e) => setActiveTab(e.detail.value as 'login' | 'register')}
        >
          <IonSegmentButton value="login">
            Login
          </IonSegmentButton>

          <IonSegmentButton value="register">
            Registrieren
          </IonSegmentButton>
        </IonSegment>

        {activeTab === 'register' && (
          <>
            <IonItem>
              <IonLabel position="stacked">Benutzername</IonLabel>
              <IonInput
                value={username}
                onIonChange={(e) => setUsername(e.detail.value ?? '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Vollständiger Name</IonLabel>
              <IonInput
                value={fullName}
                onIonChange={(e) => setFullName(e.detail.value ?? '')}
              />
            </IonItem>
          </>
        )}

        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value ?? '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Passwort</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value ?? '')}
          />
        </IonItem>

        {activeTab === 'login' && (
          <IonButton expand="block" onClick={handleLogin}>
            Login
          </IonButton>
        )}

        {activeTab === 'register' && (
          <IonButton expand="block" onClick={handleRegister}>
            Registrieren
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;