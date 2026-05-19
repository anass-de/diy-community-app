import { Redirect, Route } from 'react-router-dom';

import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import ProjectListPage from './pages/ProjectListPage';
import ProjectCreatePage from './pages/ProjectCreatePage';
import ProjectEditPage from './pages/ProjectEditPage';
import LoginPage from './pages/LoginPage';
import NewProjectsPage from './pages/NewProjectsPage';
import PopularProjectsPage from './pages/PopularProjectsPage';
import ProfilePage from './pages/ProfilePage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';

setupIonicReact();

const App = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <LoginPage />
          </Route>

          <Route exact path="/profile">
            <ProfilePage />
          </Route>

          <Route exact path="/projects">
            <ProjectListPage />
          </Route>

          <Route exact path="/projects/new">
            <ProjectCreatePage />
          </Route>

          <Route exact path="/projects/edit/:id">
            <ProjectEditPage />
          </Route>

          <Route exact path="/projects/newest">
            <NewProjectsPage />
          </Route>

          <Route exact path="/projects/popular">
            <PopularProjectsPage />
          </Route>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;