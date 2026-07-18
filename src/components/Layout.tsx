import * as React from "react"
import { Nav } from "./Nav"
import { Footer } from "./Footer"

type LayoutProps = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Nav />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  )
}
