import Link from 'next/link'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-brand-light">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-teal/10 p-4 rounded-full">
            <AlertCircle className="w-16 h-16 text-brand-teal" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-brand-dark mb-4">404</h1>
        <h2 className="text-xl font-bold text-brand-dark mb-4">Página no encontrada</h2>
        
        <p className="text-brand-grey mb-8">
          Lo sentimos, la página que estás buscando ha sido movida, eliminada, o posiblemente nunca existió.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-brand-teal text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors"
          >
            <Home size={20} />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
