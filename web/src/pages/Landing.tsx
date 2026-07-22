import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-12 py-6">
        <span className="font-serif text-xl text-ink">Drema</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/login" className="text-muted hover:text-ink">
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="rounded-full border border-ink/20 px-4 py-2 text-ink hover:border-ink/40 transition-colors"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.2em] text-xs text-gold font-medium mb-6">Do sonho ao imóvel</p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight text-ink mb-6">
            Encontre o profissional ideal para transformar sua ideia em realidade.
          </h1>
          <p className="text-muted text-lg mb-10 max-w-lg mx-auto">
            Conte sobre o seu projeto e conheça arquitetos, engenheiros e designers verdadeiramente compatíveis com
            ele.
          </p>
          <Link
            to="/comecar"
            className="inline-block rounded-full bg-primary text-white px-8 py-3.5 font-medium hover:bg-primary-hover transition-colors"
          >
            Encontrar meu profissional
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-muted py-8">Drema — do sonho ao imóvel.</footer>
    </div>
  )
}
