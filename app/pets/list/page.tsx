"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pet } from "@/types/pets";
import { PETS_ITEMS_KEY } from "@/utils/constants";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [petList, setPetList] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(petList);
  const handleFavorite = (pet: Pet) => {
    const updated = petList.map((p) => {
      if (p.id === pet.id) {
        return {
          ...p,
          isFavorite: !p.isFavorite,
        };
      }
      return p;
    });
    localStorage.setItem(PETS_ITEMS_KEY, JSON.stringify(updated));
    setPetList(updated);
  };

  const getItems = async () => {
    setLoading(true);
    await setTimeout(() => {
      const pets = localStorage.getItem(PETS_ITEMS_KEY);
      const obj = pets ? JSON.parse(pets!) : [];
      if (obj && Array.isArray(obj)) {
        setPetList(obj);
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getItems();
  }, []);

  const [selectedPet, setselectedPet] = useState<Pet | null>(null);

  const favoriteList = useMemo(
    () => petList.filter((pet) => pet.isFavorite),
    [petList]
  );

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Tabs defaultValue="pets" className="w-96">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pets">Mascotas perdidas</TabsTrigger>
          <TabsTrigger value="preffered">Favoritos</TabsTrigger>
        </TabsList>
        <TabsContent value="pets">
          <Dialog
            open={Boolean(selectedPet)}
            onOpenChange={() => {
              setselectedPet(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (selectedPet) {
                        handleFavorite(selectedPet);
                        setselectedPet({
                          ...selectedPet,
                          isFavorite: !selectedPet.isFavorite,
                        });
                      }
                    }}
                  >
                    {selectedPet?.isFavorite ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        className="text-red-500"
                      >
                        <path
                          fill="currentColor"
                          d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        className="text-red-500"
                      >
                        <path
                          fill="currentColor"
                          d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"
                        ></path>
                      </svg>
                    )}
                  </Button>
                  <div>{selectedPet?.name}</div>
                </DialogTitle>
                <DialogDescription>Tipo: {selectedPet?.type}</DialogDescription>
              </DialogHeader>
              <div>
                <div className=""></div>
                {selectedPet?.image && (
                  <Image
                    src={selectedPet.image}
                    alt={selectedPet?.name}
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
          <div className="max-w-[30rem]">
            <h1 className="text-3xl font-bold mb-4">
              Listado de mascotas desaparecidas
            </h1>
            <div className="flex flex-col gap-3">
              {loading ? (
                <div>Loading...</div>
              ) : petList.length === 0 ? (
                <div>No hay mascotas desaparecidas</div>
              ) : (
                petList.map((pet) => (
                  <div
                    key={pet.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border shadow-lg"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        width={100}
                        height={100}
                      />
                      <div className="font-semibold text-lg">{pet.name}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setselectedPet(pet)}>Ver</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preffered">
          <Dialog
            open={Boolean(selectedPet)}
            onOpenChange={() => {
              setselectedPet(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedPet?.name}</DialogTitle>
                <DialogDescription>Tipo: {selectedPet?.type}</DialogDescription>
              </DialogHeader>
              <div>
                {selectedPet?.image && (
                  <Image
                    src={selectedPet.image}
                    alt={selectedPet?.name}
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
          <div className="max-w-[30rem]">
            <h1 className="text-3xl font-bold mb-4">Listado de favoritos</h1>
            <div className="flex flex-col gap-3">
              {loading ? (
                <div>Loading...</div>
              ) : favoriteList.length === 0 ? (
                <div>No hay favoritos</div>
              ) : (
                favoriteList.map((pet) => (
                  <div
                    key={pet.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border shadow-lg"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        width={100}
                        height={100}
                      />
                      <div className="font-semibold text-lg">{pet.name}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive">Borrar</Button>
                      <Button onClick={() => setselectedPet(pet)}>Ver</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
