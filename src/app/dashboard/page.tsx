'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const profileSchema = z.object({
  displayName: z.string().min(1, { message: "El nombre no puede estar vacío." }),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Dashboard() {
  const { user, isAdmin, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!data.displayName || !updateUserProfile) return;
    setIsUpdating(true);
    try {
      await updateUserProfile({ displayName: data.displayName });
      toast({
        title: "Perfil actualizado",
        description: "Tu nombre ha sido actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const welcomeTitle = user ? (user.displayName || user.email) : 'a Tecnosalud';

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl md:text-3xl font-bold">Dashboard</h1>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {isAdmin ? '¡Bienvenido Administrador!' : `¡Bienvenido, ${welcomeTitle}!`}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Panel de administrador. Gestiona usuarios, servicios y configuraciones desde aquí.'
              : 'Este es tu panel de control. Revisa tus notificaciones y gestiona tu perfil.'
            }
          </CardDescription>
        </CardHeader>
      </Card>
      
      {isAdmin ? (
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
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Tu Perfil</CardTitle>
                    <CardDescription>Actualiza tu información personal.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre para mostrar</FormLabel>
                                        <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input {...field} disabled /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? 'Actualizando...' : 'Actualizar Perfil'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="space-y-6">
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed shadow-sm p-8 min-h-[220px]">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      Aún no tienes servicios activos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Contacta a ventas para empezar a usar nuestras soluciones.
                    </p>
                  </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
}
