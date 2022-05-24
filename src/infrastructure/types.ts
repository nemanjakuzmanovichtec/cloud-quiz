import { AnyObj } from '@utils/types';

export interface WhereCondition {
  primaryKey: string;
  primaryKeyValue: string;
  secondaryKey?: string;
  secondaryKeyValue?: string;
}

export interface Metadata {
  tableName: string;
}

export interface RemoveOutput {
  deletedCount: number;
}

export interface IDatabase {
  find: (where: WhereCondition, metadata: Metadata) => Promise<AnyObj[]>;
  findOne: (where: WhereCondition, metadata: Metadata) => Promise<AnyObj>;
  save: <T>(data: T, metadata: Metadata) => Promise<T>;
  remove: (where: WhereCondition, metadata: Metadata) => Promise<RemoveOutput>;
}
