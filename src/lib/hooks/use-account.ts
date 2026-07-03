"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getAccountStatements,
  getBalance,
  getMovementCep,
  getMovementDetail,
  getMovements,
  type MovementFilters,
} from "@/lib/api/account";

export const useBalance = () =>
  useQuery({ queryKey: ["balance"], queryFn: getBalance });

export const useMovements = (filters: MovementFilters) =>
  useQuery({
    queryKey: ["movements", filters],
    queryFn: () => getMovements(filters),
  });

export const useMovementDetail = (id: string | null) =>
  useQuery({
    queryKey: ["movement-detail", id],
    queryFn: () => getMovementDetail(id as string),
    enabled: !!id,
  });

export const useMovementCep = (id: string | null) =>
  useQuery({
    queryKey: ["movement-cep", id],
    queryFn: () => getMovementCep(id as string),
    enabled: !!id,
  });

export const useAccountStatements = () =>
  useQuery({ queryKey: ["statements"], queryFn: getAccountStatements });
