import axios from "axios";
import { ExchangeRate, Planet, Transaction, User } from "server";

export const getPlanets = async () => {
  const { data } = await axios.get<{ planets: Planet[] }>("/api/planets");
  return data.planets;
};

export const getPlanetById = async (id: number) => {
  const { data } = await axios.get<{ planet: Planet }>(`/api/planets/${id}`);
  return data.planet;
};

export const getUsers = async () => {
  const { data } = await axios.get<{ users: User[] }>("/api/users");
  return data.users;
};

export const getUserById = async (id: number) => {
  const { data } = await axios.get<User>(`/api/users/${id}`);
  return data;
};

export const getUsersByHomeworld = async (planetId: number) => {
  const { data } = await axios.get<{ users: User[] }>(
    `/api/users/planet/${planetId}`
  );
  return data.users;
};

export const getTransactions = async () => {
  const { data } = await axios.get<{ transactions: Transaction[] }>(
    "/api/transactions"
  );
  return data.transactions;
};

export const getTransactionById = async (id: number) => {
  const { data } = await axios.get<Transaction>(`/api/transactions/${id}`);
  return data;
};

export const getTransactionByUserId = async (userId: number) => {
  const { data } = await axios.get<{ transactions: Transaction[] }>(
    `/api/transactions/user/${userId}`
  );
  return data.transactions;
};

export const getTransactionByMultipleUserId = async (userIds: string) => {
  const { data } = await axios.get<{ transactions: Transaction[] }>(
    `/api/transactions/users/${userIds}`
  );
  return data.transactions;
};

export const updateBatchTransaction = async (transactions: Transaction[]) => {
  const { data } = await axios.put<{ message: string }>(
    `/api/transactions/update-batch`,
    { transactions }
  );
  return data;
};

export const getExchangeRate = async () => {
  const { data } = await axios.get<ExchangeRate>("/api/exchange-rate");
  return data.rate;
};
