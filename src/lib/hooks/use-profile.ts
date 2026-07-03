"use client";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api/profile";

export const useProfile = () =>
  useQuery({ queryKey: ["profile"], queryFn: getProfile });
