'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export default function Dashboard() {
  const { isAdmin } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">¡Bienvenido a Tecnosalud!</CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Panel de administrador. Gestiona usuarios, servicios y configuraciones desde aquí.'
              : 'Tu panel de control está listo. Revisa tus notificaciones y estado de servicios.'
            }
          </CardDescription>
        </CardHeader>
      </Card>
      
      {!isAdmin && (
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
      )}

      {isAdmin && (
         <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Vista de Administrador
            </h3>
            <p className="text-sm text-muted-foreground">
              Aquí puedes gestionar todos los aspectos de la aplicación.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
