/* eslint-disable @typescript-eslint/no-var-requires */

import axios, { AxiosResponse, Method } from 'axios';
import knex from "knex";

import { TablePriority } from '../../src/db/config';

const knexfile = require('../../knexfile');

export const query = async (
  endpoint: string,
  port: number,
  method: Method = 'GET',
  data: Record<string, unknown> | null = null
): Promise<AxiosResponse<unknown>> => {
  const url = `http://localhost:${port}${endpoint}`;

  const response = await axios.request({
    url,
    method,
    data,
    validateStatus: () => true,
  });

  return response;
};

export const getDB = (): knex => {
  return knex(knexfile);
};

export const migrateDB = async (): Promise<void> => {
  const db = getDB();
  await db.migrate.latest();
};

export const seedDB = async (): Promise<void> => {
  const db = getDB();
  await db.seed.run();
};

export const truncateDB = async (): Promise<void> => {
  const db = getDB();

  for (const table of TablePriority.slice().reverse()) {
    await db.table(table).truncate();
  }
};

export const rollbackDB = async (): Promise<void> => {
  const db = getDB();
  await db.migrate.rollback();
};
