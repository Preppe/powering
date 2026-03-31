import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import { SidebarProvider } from '#/lib/sidebar-context'
import { getAccessToken, setAccessToken, getSession, checkAuth } from '#/lib/api/auth'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const PUBLIC_PATHS = ['/auth']

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ location }) => {
    const isPublic = PUBLIC_PATHS.includes(location.pathname)

    if (typeof window !== 'undefined') {
      if (!getAccessToken()) {
        const session = await getSession()
        if (session) setAccessToken(session.token)
      }
      if (!getAccessToken() && !isPublic) throw redirect({ to: '/auth' })
    } else {
      const hasAuth = await checkAuth()
      if (!hasAuth && !isPublic) throw redirect({ to: '/auth' })
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-primary-container selection:text-white">
        <TanStackQueryProvider>
          <SidebarProvider>
          {children}
          </SidebarProvider>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
