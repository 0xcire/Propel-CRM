import { Router } from "express";

export default (router: Router) => {
  router.get("/listings");
  router.post("/listings");
  router.patch("/listings/:id");
  router.delete("/listings/:id");
};
