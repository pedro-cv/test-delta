"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  MAX_FILE_SIZE,
  PET_TYPE_OPTIONS,
  PETS_ITEMS_KEY,
} from "@/utils/constants";
import { toast } from "@/hooks/use-toast";
import uuid from "uuid-random";
import Image from "next/image";

const formSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  type: z.string({ required_error: "El tipo es requerido" }),
  gender: z.enum(["male", "female"], {
    required_error: "El género es requerido",
  }),
  image: z.instanceof(File).refine(
    (file) => {
      const allowedTypes = ["image/png", "image/jpeg"]; // Tipos MIME permitidos.
      return allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
    },
    {
      message: "Invalid file: Must be a PNG/JPEG and under 5MB",
    }
  ),
});

type FormData = z.infer<typeof formSchema>;

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); // Convertir a Base64
  });
};

const Page = () => {
  const defaultValues: Partial<FormData> = {
    name: "",
    type: undefined,
    gender: "male",
  };

  const form = useForm<Partial<FormData>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: Partial<FormData>) {
    try {
      const storage = localStorage.getItem(PETS_ITEMS_KEY);
      const image = await convertFileToBase64(data.image!);
      const isFavorite = false;
      if (storage) {
        let parsed = JSON.parse(storage);

        if (!parsed) {
          parsed = [];
        }
        const updated = [
          ...parsed,
          {
            id: uuid(),
            ...data,
            image,
            isFavorite,
          },
        ];
        localStorage.setItem(PETS_ITEMS_KEY, JSON.stringify(updated));
        toast({
          title: "Listo",
          description: "Mascota creada con éxito",
        });
      } else {
        localStorage.setItem(
          PETS_ITEMS_KEY,
          JSON.stringify([
            {
              id: uuid(),
              ...data,
              image,
              isFavorite,
            },
          ])
        );
      }
      form.reset();
    } catch (e) {
      // nunca hacer
      console.log(e);
      toast({
        title: "Error",
        description: "Hubo un error al crear la mascota",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-96">
        <h1 className="text-3xl font-bold mb-4">Crear mascota</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de mascota</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        {PET_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Sexo</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <span>Hembra</span>
                      <Switch
                        checked={field.value === "male"}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? "male" : "female");
                        }}
                      />
                      <span>Macho</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                        }}
                        accept="image/png, image/jpeg"
                      />
                      {field.value && (
                        <div className="mt-2 flex justify-center">
                          <Image
                            src={URL.createObjectURL(field.value)}
                            alt="preview"
                            width={100}
                            height={100}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Crear
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
