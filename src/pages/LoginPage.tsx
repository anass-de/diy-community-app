import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { supabase } from '../lib/supabaseClient';

const LoginPage = () => {

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

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

      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          username,
          full_name: username
        });

      alert('Registrierung erfolgreich');
    }
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

    alert('Login erfolgreich');

    history.push('/projects');
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonItem>
          <IonLabel position="stacked">
            Benutzername
          </IonLabel>

          <IonInput
            value={username}
            onIonInput={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Email
          </IonLabel>

          <IonInput
            type="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Passwort
          </IonLabel>

          <IonInput
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        <IonButton
          expand="block"
          onClick={handleRegister}
        >
          Registrieren
        </IonButton>

        <IonButton
          expand="block"
          fill="outline"
          onClick={handleLogin}
        >
          Login
        </IonButton>

      </IonContent>

    </IonPage>
  );
};

export default LoginPage;