import api from "./client";

export function fetchOutfits() {
  return api.get("/outfits");
}

export function fetchOutfit(id) {
  return api.get(`/outfits/${id}`);
}

export function createOutfit(data) {
  // data: { name, items: [clothingIds], occasion }
  return api.post("/outfits", data);
}

export function updateOutfit(id, data) {
  return api.put(`/outfits/${id}`, data);
}

export function deleteOutfit(id) {
  return api.delete(`/outfits/${id}`);
}