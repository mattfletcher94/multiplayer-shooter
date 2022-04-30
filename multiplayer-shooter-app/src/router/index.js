import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import DashboardPageLobbies from '../views/DashboardPageLobbies.vue'
import DashboardPageLobbiesCreate from '../views/DashboardPageLobbiesCreate.vue'
import DashboardPageAccount from '../views/DashboardPageAccount.vue'
import GamePage from '../views/GamePage.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/login/',
			alias: '/',
			name: 'Login',
			component: LoginPage
        },
        {
			path: '/dashboard/game/:id',
            component: GamePage,
            meta: {
				requiresAuth: true,
			},
		},
        {
            path: '/dashboard/',
            component: DashboardPage,
            meta: {
				requiresAuth: true,
				breadcrumbs: [
					{
						text: 'Dashboard',
						link: true,
						exact: true,
						to: '/dashboard/'
					}
				]
            },
            children: [
                {
                    path: 'lobbies',
                    component: DashboardPageLobbies,
					name: 'Lobbies',
					meta: {
						requiresAuth: true,
					}
                },
                {
                    path: 'lobbies/create',
                    component: DashboardPageLobbiesCreate,
					name: 'Create Lobby',
					meta: {
						requiresAuth: true,
					}
                },
				{
                    path: 'account',
                    component: DashboardPageAccount,
					name: 'Account',
					meta: {
						requiresAuth: true,
					}
				},
			]
        }
	]
})

router.beforeEach((to, from, next) => {
	
	// Get current JWT from local storage
	const jwt = window.localStorage.getItem('JWT')

	// If at login screen but already logged in,
	// redirect to the projects page
	if (jwt && to.name === 'Login') {
		return next('/dashboard/')
	}

	// If the router required auth, check to make sure
	// user is actually logged in before sending them there,
	// else send them back to login page.
	if (!jwt && to.meta.requiresAuth) {
		return next('/login/')
	}

	next()
})

export default router
