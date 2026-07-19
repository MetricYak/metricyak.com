import * as React from "react"
import { AnnouncementBar } from "./AnnouncementBar"
import { Nav } from "./Nav"
import { Footer } from "./Footer"

type LayoutProps = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-40">
        <AnnouncementBar />
        <Nav />
      </div>
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
