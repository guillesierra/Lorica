import { useEffect, useState } from "react";
import { AccountPage, HomePage, MethodologyPage, ThreatsPage } from "./pages";

type Route = "analizar" | "amenazas" | "metodologia" | "cuenta";
const routes: readonly Route[] = ["analizar", "amenazas", "metodologia", "cuenta"];

function currentRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/u, "") as Route;
  return routes.includes(hash) ? hash : "analizar";
}

export function App() {
  const [route, setRoute] = useState<Route>(currentRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const page = route === "amenazas" ? <ThreatsPage /> : route === "metodologia" ? <MethodologyPage /> : route === "cuenta" ? <AccountPage /> : <HomePage />;

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#analizar" aria-label="Lorica, inicio">
            <span className="brand-mark" aria-hidden="true">L</span><span>Lorica</span>
          </a>
          <nav aria-label="Navegación principal">
            <a href="#analizar" aria-current={route === "analizar" ? "page" : undefined}>Analizar</a>
            <a href="#amenazas" aria-current={route === "amenazas" ? "page" : undefined}>Alertas en España</a>
            <a href="#metodologia" aria-current={route === "metodologia" ? "page" : undefined}>Cómo detecta</a>
            <a className="account-link" href="#cuenta" aria-current={route === "cuenta" ? "page" : undefined}>Cuenta</a>
          </nav>
        </div>
      </header>
      <main id="contenido">{page}</main>
      <footer className="site-footer shell">
        <div><span className="brand-mark small" aria-hidden="true">L</span><strong>Lorica</strong><p>Orientación preventiva. No sustituye a tu banco, INCIBE ni a las autoridades.</p></div>
        <div className="footer-links">
          <a href="https://www.incibe.es/linea-de-ayuda-en-ciberseguridad" target="_blank" rel="noreferrer">Ayuda INCIBE 017</a>
          <a href="https://www.incibe.es/ciudadania/ayuda/reporte-de-fraude" target="_blank" rel="noreferrer">Reportar fraude</a>
          <a href="https://www.policia.es/_es/denuncias.php" target="_blank" rel="noreferrer">Denunciar</a>
        </div>
      </footer>
    </>
  );
}
