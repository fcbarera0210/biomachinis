export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El middleware ya maneja la redirección si está autenticado
  // Este layout solo renderiza el contenido sin el layout del admin
  return <>{children}</>;
}
