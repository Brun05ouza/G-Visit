import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "GêVisit",
  description: "Gerencie suas visitas a imóveis de forma rápida e fácil.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(15,15,30,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f8fafc",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  )
}

