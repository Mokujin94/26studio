import Auth from './pages/auth/Auth'
import Profile from './pages/profile/Profile'
import News from './pages/news/News'
import Messenger from './pages/messenger/Messenger'
import Projects from './pages/projects/Projects'
import Project from './pages/project/Project'
import Groups from './pages/groups/Groups'
import Group from './pages/group/Group'
import Registration from './pages/registration/Registation'
import NewsPaper from './pages/newsPaper/NewsPaper'

import {GROUPS_ROUTE, GROUP_ROUTE, LOGIN_ROUTE, MESSENGER_ROUTE, NEWSPAPER_ROUTE, NEWS_ROUTE, PROFILE_ROUTE, PROJECTS_ROUTE, PROJECT_ROUTE, REGISTRATION_ROUTE} from './utils/consts'

export const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: <Profile/>
    },
    {
        path: MESSENGER_ROUTE,
        Component: <Messenger/>
    },
]

export const publicRoutes = [
    {
        path: NEWS_ROUTE,
        Component: <News/>
    },
    {
        path: NEWSPAPER_ROUTE + '/:id',
        Component: <NewsPaper/>
    },
    {
        path: PROJECTS_ROUTE,
        Component: <Projects/>
    },
    {
        path: PROJECTS_ROUTE + '/:id',
        Component: <Project/>
    },
    {
        path: GROUPS_ROUTE,
        Component: <Groups/>
    },
    {
        path: GROUP_ROUTE + '/:id',
        Component: <Group/>
    },
    {
        path: LOGIN_ROUTE,
        Component: <Auth/>
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth/>
    },
]