import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">¡Bienvenido a Tecnosalud!</CardTitle>
          <CardDescription>Tu panel de control está listo. Gestiona tus servicios y configuraciones desde aquí.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Aún no tienes servicios activos
          </h3>
          <p className="text-sm text-muted-foreground">
            Contacta a ventas para empezar a usar nuestras soluciones.
          </p>
        </div>
      </div>
    </>
  );
}
