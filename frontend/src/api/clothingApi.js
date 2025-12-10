import api from "./client";

//GET all
export function fetchClothingItems() {
  return api.get("/clothingItems");
}

//GET one
export function fetchClothingItem(id) {
  return api.get(`/clothingItems/${id}`);
}

//POST
export function createClothingItem(data) {
  return api.post("/clothingItems", data);
}

//PUT
export function updateClothingItem(id, data) {
  return api.put(`/clothingItems/${id}`, data);
}

//DELETE
export function deleteClothingItem(id) {
  return api.delete(`/clothingItems/${id}`);
}